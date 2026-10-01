import { endOfMonth, format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const seasonLabel = (name, isStart) => `${isStart ? 'Empieza' : 'Termina'} ${name}`;

const shortDate = (date) => format(date, 'd MMM', { locale: es });

export function getMonthEvents(campaigns, seasons, month) {
    const from = startOfMonth(month);
    const to = endOfMonth(month);
    const events = [];

    campaigns.forEach((campaign) => {
        const start = new Date(campaign.start_date);
        const end = new Date(campaign.end_date);
        if (end < from || start > to) return;
        events.push({
            name: campaign.name,
            kind: 'Campaña',
            when: `${shortDate(start)} – ${shortDate(end)}`,
            type: 'campaign',
            sort: start < from ? from : start
        });
    });

    seasons.forEach((season) => {
        [[season.start_date, true], [season.end_date, false]].forEach(([value, isStart]) => {
            const date = new Date(value);
            if (date < from || date > to) return;
            events.push({
                name: seasonLabel(season.name, isStart),
                kind: 'Temporada',
                when: shortDate(date),
                type: 'season',
                sort: date
            });
        });
    });

    return events.sort((a, b) => a.sort - b.sort);
}

export const openItem = (navigate, item) => {
    localStorage.setItem('temporalItem', JSON.stringify(item.original));
    navigate(item.type === 'campaign' ? '/campañas' : '/temporadas');
};

export function getMilestones(campaigns, seasons) {
    const milestones = [];

    campaigns.forEach((campaign) => {
        milestones.push({ date: new Date(campaign.start_date), label: campaign.name, type: 'campaign', original: campaign });
        milestones.push({ date: new Date(campaign.end_date), label: `Termina ${campaign.name}`, type: 'campaign', original: campaign });
    });

    seasons.forEach((season) => {
        milestones.push({ date: new Date(season.start_date), label: seasonLabel(season.name, true), type: 'season', original: season });
        milestones.push({ date: new Date(season.end_date), label: seasonLabel(season.name, false), type: 'season', original: season });
    });

    return milestones.sort((a, b) => a.date - b.date);
}

export function buildEvents(campaigns, seasons) {
    const events = campaigns.map((campaign) => ({
        title: campaign.name,
        start: new Date(campaign.start_date),
        end: new Date(campaign.end_date),
        type: 'campaign',
        original: campaign,
    }));

    seasons.forEach((season) => {
        events.push({
            title: seasonLabel(season.name, true),
            start: new Date(season.start_date),
            end: new Date(season.start_date),
            type: 'season',
            original: season,
        });
        events.push({
            title: seasonLabel(season.name, false),
            start: new Date(season.end_date),
            end: new Date(season.end_date),
            type: 'season',
            original: season,
        });
    });

    return events;
}