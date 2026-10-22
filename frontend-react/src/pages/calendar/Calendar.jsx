import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, format, startOfDay, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarCompact } from './CalendarCompact.jsx';
import { CalendarGrid } from './CalendarGrid.jsx';
import { CalendarToolbar } from './CalendarToolbar.jsx';
import { openItem } from './calendarEvents.js';
import { CardError, Skeleton } from '../controlPanel/cards/CardState.jsx';
import { DATABASE_TABLES, DATES_ONLY } from "../../config/database.js";
import { useFetch } from "../../hooks/useFetch.js";
import { daysLabel, monthEvents, upcomingDates } from "../../utils/calendar.js";
import { useIsMobile } from "../../utils/useIsMobile.js";

const NO_DATA = [];

function UpcomingRows({ upcoming, today, onOpen }) {
    return upcoming.map((item, index) => (
        <li key={`${item.type}-${item.label}`}>
            <button type="button" className="calendar-next" onClick={() => onOpen(item)}>
                <span className={`calendar-chip${index === 0 ? ' is-next' : ''}`}>
                    <span className="calendar-chip-day">{format(item.date, 'd')}</span>
                    <span className="calendar-chip-month">{format(item.date, 'MMM', { locale: es })}</span>
                </span>
                <span className="calendar-next-text">
                    <span className="calendar-next-name">{item.label}</span>
                    <span className="calendar-next-when">{daysLabel(differenceInCalendarDays(item.date, today))}</span>
                </span>
            </button>
        </li>
    ));
}

function UpcomingBody({ state, upcoming, today, onOpen, onRetry }) {
    if (state === 'error') return <CardError onRetry={onRetry} />;
    if (state === 'loading') {
        return (
            <div className="d-flex flex-column gap-3" aria-busy="true">
                {[0, 1, 2, 3, 4].map((index) => <Skeleton key={index} className="calendar-skeleton-row" />)}
            </div>
        );
    }
    if (upcoming.length === 0) return <p className="panel-muted m-0">No hay fechas próximas.</p>;
    return <ul className="calendar-next-list list-unstyled m-0"><UpcomingRows upcoming={upcoming} today={today} onOpen={onOpen} /></ul>;
}

function Legend({ withHint }) {
    return (
        <div className="calendar-legend">
            <span className="calendar-legend-item">
                <span className="calendar-legend-bar" aria-hidden="true" />
                Campaña
            </span>
            <span className="calendar-legend-item">
                <span className="calendar-legend-dot" aria-hidden="true" />
                Cambio de temporada
            </span>
            {withHint ? <span>Pulsa una campaña para ver sus datos.</span> : null}
        </div>
    );
}

function MonthList({ state, events, month, onRetry }) {
    let body;
    if (state === 'error') body = <CardError onRetry={onRetry} />;
    else if (state === 'loading') {
        body = (
            <div className="d-flex flex-column gap-3" aria-busy="true">
                <Skeleton className="calendar-skeleton-line" />
                <Skeleton className="calendar-skeleton-line" />
            </div>
        );
    } else if (events.length === 0) body = <p className="panel-muted m-0">No hay campañas ni cambios de temporada este mes.</p>;
    else {
        body = (
            <ul className="calendar-month-list list-unstyled d-flex flex-column m-0">
                {events.map((event) => (
                    <li className="calendar-month-item" key={`${event.type}-${event.name}`}>
                        <span className={event.type === 'campaign' ? 'calendar-month-bar' : 'calendar-month-dot'} aria-hidden="true" />
                        <span className="d-flex flex-column overflow-hidden">
                            <span className="calendar-month-name">{event.name}</span>
                            <span className="calendar-month-when">{event.kind} · {event.when}</span>
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="panel-card calendar-month-card d-flex flex-column gap-3">
            <h2 className="panel-card-title m-0">En {format(month, 'MMMM', { locale: es })}</h2>
            {body}
        </section>
    );
}

function Calendar(props) {
    const campaignsFetch = useFetch(DATABASE_TABLES['campaigns'].endpoint, DATES_ONLY);
    const seasonsFetch = useFetch(DATABASE_TABLES['seasons'].endpoint, DATES_ONLY);
    const [month, setMonth] = useState(startOfMonth(new Date()));
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const campaigns = campaignsFetch.data ?? NO_DATA;
    const seasons = seasonsFetch.data ?? NO_DATA;
    const failed = Boolean(campaignsFetch.error || seasonsFetch.error);
    const loading = !failed && (campaignsFetch.data === null || seasonsFetch.data === null);
    const state = failed ? 'error' : loading ? 'loading' : 'ready';
    const retry = () => {
        if (campaignsFetch.error) campaignsFetch.refetch();
        if (seasonsFetch.error) seasonsFetch.refetch();
    };

    const today = startOfDay(new Date());
    const upcoming = useMemo(() => upcomingDates(campaigns, seasons, today), [campaigns, seasons, today.getTime()]);
    const events = useMemo(() => monthEvents(campaigns, seasons, month), [campaigns, seasons, month]);
    const onOpen = (item) => openItem(navigate, item);

    const heading = (
        <div className="panel-heading d-flex flex-column">
            <span className="panel-kicker">Campañas y cambios de temporada</span>
            <h1 className="panel-title m-0">{props.title}</h1>
        </div>
    );

    if (isMobile) {
        return (
            <div className="calendar-page is-mobile d-flex flex-column">
                {heading}
                <CalendarToolbar date={month} onNavigate={setMonth} mobile />
                <CalendarCompact campaigns={campaigns} seasons={seasons} month={month} today={today} />
                <MonthList state={state} events={events} month={month} onRetry={retry} />
                <section className="d-flex flex-column calendar-next-block">
                    <h2 className="calendar-next-title m-0">Próximas fechas</h2>
                    <div className="m-list calendar-next-card">
                        <UpcomingBody state={state} upcoming={upcoming} today={today} onOpen={onOpen} onRetry={retry} />
                    </div>
                </section>
                <Legend />
            </div>
        );
    }

    return (
        <div className="calendar-page">
            <header className="calendar-head-row d-flex align-items-end justify-content-between flex-wrap">
                {heading}
                <CalendarToolbar date={month} onNavigate={setMonth} />
            </header>
            <div className="calendar-layout">
                <CalendarGrid campaigns={campaigns} seasons={seasons} month={month} today={today} onOpen={onOpen} />
                <section className="panel-card calendar-side">
                    <h2 className="panel-card-title m-0">Próximas fechas</h2>
                    <UpcomingBody state={state} upcoming={upcoming} today={today} onOpen={onOpen} onRetry={retry} />
                    <div className="calendar-side-legend">
                        <Legend withHint />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Calendar;
