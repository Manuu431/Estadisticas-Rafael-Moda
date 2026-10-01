import { useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { buildEvents, openItem } from './calendarEvents.js';

const locales = { es };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const eventPropGetter = (event) => ({ className: event.type === 'season' ? 'is-season' : '' });

const dayPropGetter = (date) => {
    const day = getDay(date);
    return day === 0 || day === 6 ? { className: 'is-weekend' } : {};
};

const messages = {
    showMore: (count) => `+${count} más`,
    noEventsInRange: 'No hay campañas ni cambios de temporada este mes.',
};

const COMPACT_WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

const buildFormats = (compact) => ({
    dateFormat: 'd',
    weekdayFormat: compact
        ? (date) => COMPACT_WEEKDAYS[getDay(date)]
        : (date, culture, localizerInstance) => localizerInstance.format(date, 'EEE', culture),
});

function EventCalendar({ campaigns = [], seasons = [], date, onNavigate, compact = false }) {
    const navigate = useNavigate();
    const events = useMemo(() => buildEvents(campaigns, seasons), [campaigns, seasons]);
    const formats = useMemo(() => buildFormats(compact), [compact]);

    return (
        <div className={`data-card calendar-card${compact ? ' is-compact' : ''}`}>
            <BigCalendar
                localizer={localizer}
                culture="es"
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={date}
                onNavigate={onNavigate}
                toolbar={false}
                popup
                views={['month']}
                onSelectEvent={(event) => openItem(navigate, event)}
                eventPropGetter={eventPropGetter}
                dayPropGetter={dayPropGetter}
                messages={messages}
                formats={formats}
            />
        </div>
    );
}

export default EventCalendar;