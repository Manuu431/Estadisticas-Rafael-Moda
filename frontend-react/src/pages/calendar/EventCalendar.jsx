import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { CustomToolbar } from './CustomToolBar.jsx';

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
            'temporalItem',
            JSON.stringify(event.original)
        );
        navigate(event.type === 'campaign' ? '/campañas' : '/temporadas');
    };

    const events = [];

    campaigns.forEach((c) => {
        events.push({
            title: `🎯${c.name}`,
            start: new Date(c.start_date),
            end: new Date(c.end_date),
            type: 'campaign',
            original: c,
        });
    });

    seasons.forEach((s) => {
        events.push({
            title: `📅Inicio: ${s.name}`,
            start: new Date(s.start_date),
            end: new Date(s.start_date),
            type: 'season',
            original: s,
        });
        events.push({
            title: `📅Fin: ${s.name}`,
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

    const getTextColor = (bgColor) => {
        const hsl = bgColor.match(/\d+/g);
        const lightness = parseInt(hsl[2], 10);
        return lightness > 60 ? 'black' : 'white';
    };

    const eventPropGetter = (event) => {
        const backgroundColor = getColorFromName(event.original.name);
        const color = getTextColor(backgroundColor);
        return {
            style: {
                backgroundColor,
                color,
                borderRadius: '0.5em',
                padding: '0.5em 0.75em',
                fontSize: '1em',
                border: `1px solid black`
            }
        };
    };

    return (
        <div className="row px-2 py-3" style={{ height: '50em', width: '100%' }}>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={handleClick}
                views={['month']}
                components={{ toolbar: CustomToolbar }}
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