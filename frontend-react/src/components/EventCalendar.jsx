import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';

const locales = { es };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

function EventCalendar({ campaigns = [], seasons = [] }) {
    const navigate = useNavigate();

    const handleClick = (event) => {
        localStorage.setItem(
            event.type === 'campaign' ? 'temporalCampaign' : 'temporalSeason',
            JSON.stringify(event.original)
        );
        navigate(event.type === 'campaign' ? '/campañas' : '/temporadas');
    };

    const events = [];

    campaigns.forEach((c) => {
        events.push({
            title: `${c.name}`,
            start: new Date(c.start_date),
            end: new Date(c.end_date),
            type: 'campaign',
            original: c,
        });
    });

    seasons.forEach((s) => {
        events.push({
            title: `Inicio: ${s.name}`,
            start: new Date(s.start_date),
            end: new Date(s.start_date),
            type: 'season',
            original: s,
        });
        events.push({
            title: `Fin: ${s.name}`,
            start: new Date(s.end_date),
            end: new Date(s.end_date),
            type: 'season',
            original: s,
        });
    });

    const getColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    const eventPropGetter = (event) => {
        const backgroundColor = getColorFromName(event.original.name);
        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                padding: '2px 4px',
                fontWeight: 'bold',
            },
        };
    };

    return (
        <div className="row px-2 py-3" style={{ height: '80vh'}}>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleClick}
                views={['month']}
                messages={{
                    month: 'Mes',
                    day: 'Día',
                    today: 'Hoy',
                    previous: 'Anterior',
                    next: 'Siguiente',
                }}
                eventPropGetter={eventPropGetter}
            />
        </div>
    );
}

export default EventCalendar;