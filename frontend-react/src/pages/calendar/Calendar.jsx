import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, format, startOfDay, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import EventCalendar from './EventCalendar.jsx';
import { getMilestones, getMonthEvents, openItem } from './calendarEvents.js';
import { CustomToolbar } from './CustomToolBar.jsx';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useIsMobile } from "../../utils/useIsMobile.js";

const getRemaining = (days) => {
    if (days === 0) return 'hoy';
    if (days === 1) return 'mañana';
    return `en ${days} días`;
};

function UpcomingList({ upcoming, navigate }) {
    if (upcoming.length === 0) return <p className="panel-muted m-0">No hay fechas próximas.</p>;

    return upcoming.map((milestone, index) => (
        <button
            type="button"
            className="calendar-next d-flex align-items-center gap-3"
            key={`${milestone.type}-${milestone.label}-${index}`}
            onClick={() => openItem(navigate, milestone)}
        >
            <span className={`calendar-chip d-flex flex-column align-items-center justify-content-center${index === 0 ? ' is-next' : ''}`}>
                <span className="fw-bold lh-1">{format(milestone.date, 'd')}</span>
                <span className="calendar-chip-month">{format(milestone.date, 'MMM', { locale: es })}</span>
            </span>
            <span className="d-flex flex-column gap-1 overflow-hidden">
                <span className="fw-semibold text-truncate">{milestone.label}</span>
                <span className="panel-muted">
                    {getRemaining(differenceInCalendarDays(milestone.date, startOfDay(new Date())))}
                </span>
            </span>
        </button>
    ));
}

function Legend({ withHint }) {
    return (
        <div className="calendar-legend d-flex flex-column gap-2">
            <span className="d-flex align-items-center gap-2">
                <span className="calendar-legend-bar" aria-hidden="true" />
                Campaña
            </span>
            <span className="d-flex align-items-center gap-2">
                <span className="calendar-legend-dot" aria-hidden="true" />
                Cambio de temporada
            </span>
            {withHint ? <span>Pulsa una campaña para ver sus datos.</span> : null}
        </div>
    );
}

function Calendar(props) {
    const { data: campaigns } = useFetch(DATABASE_TABLES['campaigns'].endpoint);
    const { data: seasons } = useFetch(DATABASE_TABLES['seasons'].endpoint);
    const [date, setDate] = useState(startOfMonth(new Date()));
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const upcoming = useMemo(() => {
        const today = startOfDay(new Date());
        return getMilestones(campaigns ?? [], seasons ?? [])
            .filter((milestone) => differenceInCalendarDays(milestone.date, today) >= 0)
            .slice(0, 5);
    }, [campaigns, seasons]);

    const monthEvents = useMemo(
        () => getMonthEvents(campaigns ?? [], seasons ?? [], date),
        [campaigns, seasons, date]
    );

    const header = (
        <div className="d-flex flex-column gap-1">
            <span className="panel-kicker">Campañas y cambios de temporada</span>
            <h1 className="panel-title m-0">{props.title}</h1>
        </div>
    );

    if (isMobile) {
        return (
            <div className="d-flex flex-column gap-3">
                {header}
                <CustomToolbar date={date} onNavigate={setDate} />
                <EventCalendar campaigns={campaigns ?? []} seasons={seasons ?? []} date={date} onNavigate={setDate} compact />
                <section className="panel-card d-flex flex-column gap-3">
                    <h2 className="panel-card-title m-0">En {format(date, 'MMMM', { locale: es })}</h2>
                    {monthEvents.length === 0 ? (
                        <p className="panel-muted m-0">No hay campañas ni cambios de temporada este mes.</p>
                    ) : (
                        <ul className="list-unstyled d-flex flex-column gap-3 m-0">
                            {monthEvents.map((event, index) => (
                                <li className="d-flex align-items-center gap-3" key={`${event.type}-${event.name}-${index}`}>
                                    <span
                                        className={event.type === 'campaign' ? 'calendar-legend-bar' : 'calendar-legend-dot'}
                                        aria-hidden="true"
                                    />
                                    <span className="d-flex flex-column overflow-hidden">
                                        <span className="fw-semibold text-truncate">{event.name}</span>
                                        <span className="panel-muted">{event.kind} · {event.when}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section className="panel-card d-flex flex-column gap-1">
                    <h2 className="panel-card-title m-0 mb-2">Próximas fechas</h2>
                    <UpcomingList upcoming={upcoming} navigate={navigate} />
                </section>
                <Legend />
            </div>
        );
    }

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                {header}
                <CustomToolbar date={date} onNavigate={setDate} />
            </header>
            <div className="row g-4 align-items-start">
                <div className="col-12 col-xl-9">
                    <EventCalendar campaigns={campaigns ?? []} seasons={seasons ?? []} date={date} onNavigate={setDate} />
                </div>
                <div className="col-12 col-xl-3">
                    <section className="panel-card d-flex flex-column gap-1">
                        <h2 className="panel-card-title m-0 mb-2">Próximas fechas</h2>
                        <UpcomingList upcoming={upcoming} navigate={navigate} />
                        <div className="calendar-legend-top mt-3 pt-3">
                            <Legend withHint />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Calendar;