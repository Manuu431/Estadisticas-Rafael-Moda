import { addDays, differenceInCalendarDays, endOfMonth, endOfWeek, format, parseISO, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

const WEEK = { weekStartsOn: 1 };

const day = (value) => startOfDay(parseISO(value));
const shortDate = (date) => format(date, 'd MMM', { locale: es });
const seasonLabel = (name, isStart) => `${isStart ? 'Empieza' : 'Termina'} ${name}`;

export function monthWeeks(month) {
    const first = startOfWeek(startOfMonth(month), WEEK);
    const total = differenceInCalendarDays(endOfWeek(endOfMonth(month), WEEK), first) + 1;
    return Array.from({ length: total / 7 }, (_, week) =>
        Array.from({ length: 7 }, (_, col) => addDays(first, week * 7 + col))
    );
}

// Cada evento de la semana lleva su carril (la línea en la que se pinta). Se reparten primero las campañas,
// de la más larga a la más corta, y después los cambios de temporada, así una campaña no cambia de carril
// a mitad de semana y los cambios de temporada rellenan los huecos.
export function weekLayout(week, campaigns, seasons) {
    const weekStart = startOfDay(week[0]);
    const weekEnd = startOfDay(week[6]);
    const col = (date) => differenceInCalendarDays(date, weekStart);
    const events = [];

    campaigns.forEach((campaign) => {
        const start = day(campaign.start_date);
        const end = day(campaign.end_date);
        if (end < weekStart || start > weekEnd) return;
        events.push({
            type: 'campaign',
            label: campaign.name,
            original: campaign,
            startCol: col(start < weekStart ? weekStart : start),
            endCol: col(end > weekEnd ? weekEnd : end),
            startsHere: start >= weekStart,
            endsHere: end <= weekEnd,
        });
    });
    events.sort((a, b) => a.startCol - b.startCol || b.endCol - a.endCol);

    const points = [];
    seasons.forEach((season) => {
        [[season.start_date, true], [season.end_date, false]].forEach(([value, isStart]) => {
            const date = day(value);
            if (date < weekStart || date > weekEnd) return;
            points.push({
                type: 'season',
                label: seasonLabel(season.name, isStart),
                original: season,
                startCol: col(date),
                endCol: col(date),
                isStart,
            });
        });
    });
    points.sort((a, b) => a.startCol - b.startCol);

    const lanes = [];
    [...events, ...points].forEach((event) => {
        let lane = lanes.findIndex((busy) => busy.every((c) => c < event.startCol || c > event.endCol));
        if (lane === -1) {
            lane = lanes.length;
            lanes.push([]);
        }
        for (let c = event.startCol; c <= event.endCol; c += 1) lanes[lane].push(c);
        event.lane = lane;
    });

    return { events: [...events, ...points], laneCount: lanes.length };
}

// Si la semana tiene más carriles de los que caben, el último carril visible se reserva para «+N más»
// y cada día cuenta cuántos eventos se le han quedado ocultos.
export function limitLanes(layout, maxLanes) {
    if (layout.laneCount <= maxLanes) return { events: layout.events, more: [] };

    const visible = maxLanes - 1;
    const hidden = layout.events.filter((event) => event.lane >= visible);
    const more = [];
    for (let col = 0; col < 7; col += 1) {
        const count = hidden.filter((event) => event.startCol <= col && event.endCol >= col).length;
        if (count > 0) more.push({ col, count });
    }
    return { events: layout.events.filter((event) => event.lane < visible), more };
}

// Los eventos de un día concreto, para la lista que despliega «+N más».
export function dayEvents(date, campaigns, seasons) {
    const target = startOfDay(date);
    const week = Array.from({ length: 7 }, (_, col) => addDays(startOfWeek(target, WEEK), col));
    const col = differenceInCalendarDays(target, week[0]);
    return weekLayout(week, campaigns, seasons)
        .events.filter((event) => event.startCol <= col && event.endCol >= col)
        .sort((a, b) => a.lane - b.lane);
}

export function monthEvents(campaigns, seasons, month) {
    const from = startOfMonth(month);
    const to = endOfMonth(month);
    const events = [];

    campaigns.forEach((campaign) => {
        const start = day(campaign.start_date);
        const end = day(campaign.end_date);
        if (end < from || start > to) return;
        events.push({
            name: campaign.name,
            kind: 'Campaña',
            when: `${shortDate(start)} – ${shortDate(end)}`,
            type: 'campaign',
            sort: start < from ? from : start,
            original: campaign,
        });
    });

    seasons.forEach((season) => {
        [[season.start_date, true], [season.end_date, false]].forEach(([value, isStart]) => {
            const date = day(value);
            if (date < from || date > to) return;
            events.push({
                name: seasonLabel(season.name, isStart),
                kind: 'Temporada',
                when: shortDate(date),
                type: 'season',
                sort: date,
                original: season,
            });
        });
    });

    return events.sort((a, b) => a.sort - b.sort);
}

// Regla del diseño: de cada campaña futura, su inicio; de la que está en curso, su final; de las
// temporadas, el inicio y el final. Una campaña que termina hoy sigue «en curso».
export function upcomingDates(campaigns, seasons, today, limit = 5) {
    const now = startOfDay(today);
    const dates = [];

    campaigns.forEach((campaign) => {
        const start = day(campaign.start_date);
        const end = day(campaign.end_date);
        if (start >= now) dates.push({ date: start, label: campaign.name, type: 'campaign', original: campaign });
        else if (end >= now) dates.push({ date: end, label: `Termina ${campaign.name}`, type: 'campaign', original: campaign });
    });

    seasons.forEach((season) => {
        [[season.start_date, true], [season.end_date, false]].forEach(([value, isStart]) => {
            const date = day(value);
            if (date >= now) dates.push({ date, label: seasonLabel(season.name, isStart), type: 'season', original: season });
        });
    });

    return dates.sort((a, b) => a.date - b.date).slice(0, limit);
}

export function daysLabel(days) {
    if (days === 0) return 'hoy';
    if (days === 1) return 'mañana';
    return `en ${days} días`;
}
