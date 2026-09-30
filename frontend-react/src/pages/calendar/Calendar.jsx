import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, format, startOfDay, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import EventCalendar from './EventCalendar.jsx';
import { getMilestones, openItem } from './calendarEvents.js';
import { CustomToolbar } from './CustomToolBar.jsx';
import { DATABASE_TABLES } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";

const getRemaining = (days) => {
    if (days === 0) return 'hoy';
    if (days === 1) return 'mañana';
    return `en ${days} días`;
};

function Calendar(props) {
    const { data: campaigns } = useFetch(DATABASE_TABLES['campaigns'].endpoint);
    const { data: seasons } = useFetch(DATABASE_TABLES['seasons'].endpoint);
    const [date, setDate] = useState(startOfMonth(new Date()));
    const navigate = useNavigate();

    const upcoming = useMemo(() => {
        const today = startOfDay(new Date());
        return getMilestones(campaigns ?? [], seasons ?? [])
            .filter((milestone) => differenceInCalendarDays(milestone.date, today) >= 0)
            .slice(0, 5);
    }, [campaigns, seasons]);

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-kicker">Campañas y cambios de temporada</span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <CustomToolbar date={date} onNavigate={setDate} />
            </header>
            <div className="row g-4 align-items-start">
                <div className="col-12 col-xl-9">
                    <EventCalendar
                        campaigns={campaigns ?? []}
                        seasons={seasons ?? []}
                        date={date}
                        onNavigate={setDate}
                    />
                </div>
                <div className="col-12 col-xl-3">
                    <section className="panel-card d-flex flex-column gap-1">
                        <h2 className="panel-card-title m-0 mb-2">Próximas fechas</h2>
                        {upcoming.length === 0 ? (
                            <p className="panel-muted m-0">No hay fechas próximas.</p>
                        ) : (
                            upcoming.map((milestone, index) => (
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
                            ))
                        )}
                        <div className="calendar-legend d-flex flex-column gap-2 mt-3 pt-3">
                            <span className="d-flex align-items-center gap-2">
                                <span className="calendar-legend-bar" aria-hidden="true" />
                                Campaña
                            </span>
                            <span className="d-flex align-items-center gap-2">
                                <span className="calendar-legend-dot" aria-hidden="true" />
                                Cambio de temporada
                            </span>
                            <span>Pulsa una campaña para ver sus datos.</span>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Calendar;