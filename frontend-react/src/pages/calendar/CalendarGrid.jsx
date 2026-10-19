import { useEffect, useMemo, useRef, useState } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { dayEvents, limitLanes, monthWeeks, outsideRange, weekLayout } from '../../utils/calendar.js';

// Una semana mide 140 px: 41 de cabecera con el número del día y 4 carriles de 24 px.
const MAX_LANES = 4;

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const gridPlace = (event) => ({ gridColumn: `${event.startCol + 1} / ${event.endCol + 2}`, gridRow: event.lane + 1 });

function EventButton({ event, week, month, onOpen }) {
    if (event.type === 'season') {
        const out = !isSameMonth(week[event.startCol], month);
        return (
            <button type="button" className={`calendar-season${out ? ' is-out' : ''}`} style={gridPlace(event)} onClick={() => onOpen(event)}>
                <span className="calendar-dot" aria-hidden="true" />
                <span className="calendar-event-text">{event.label}</span>
            </button>
        );
    }

    const { before, after } = outsideRange(week, month, event.startCol, event.endCol);
    const classes = ['calendar-bar'];
    if (event.startsHere) classes.push('starts');
    if (event.endsHere) classes.push('ends');
    if (before > 0) classes.push('is-out');
    return (
        <button
            type="button"
            className={classes.join(' ')}
            style={{ ...gridPlace(event), '--before': before, '--after': after, '--span': event.endCol - event.startCol + 1 }}
            onClick={() => onOpen(event)}
        >
            <span className="calendar-event-text">{event.label}</span>
        </button>
    );
}

function DayPopover({ popover, campaigns, seasons, onOpen, onClose }) {
    const ref = useRef(null);
    const { date, col, weekIndex } = popover;
    const events = useMemo(() => dayEvents(date, campaigns, seasons), [date, campaigns, seasons]);

    useEffect(() => {
        ref.current?.focus();
        const onKey = (event) => event.key === 'Escape' && onClose(true);
        const onPointer = (event) => !ref.current?.contains(event.target) && !event.target.closest('.calendar-more') && onClose(false);
        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onPointer);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onPointer);
        };
    }, [onClose]);

    const side = col >= 4 ? { right: `calc(${6 - col} * 100% / 7)` } : { left: `calc(${col} * 100% / 7)` };
    return (
        <div
            ref={ref}
            tabIndex={-1}
            role="dialog"
            aria-label={`Eventos del ${format(date, "d 'de' MMMM", { locale: es })}`}
            className="calendar-pop"
            style={{ ...side, '--week': weekIndex }}
        >
            <span className="panel-label">{capitalize(format(date, "EEEE d 'de' MMMM", { locale: es }))}</span>
            <ul className="list-unstyled m-0 d-flex flex-column">
                {events.map((event) => (
                    <li key={`${event.type}-${event.label}`}>
                        <button type="button" className="calendar-pop-item" onClick={() => onOpen(event)}>
                            <span className={event.type === 'campaign' ? 'calendar-legend-bar' : 'calendar-legend-dot'} aria-hidden="true" />
                            <span className="calendar-event-text">{event.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function CalendarGrid({ campaigns, seasons, month, today, onOpen }) {
    const weeks = useMemo(() => monthWeeks(month), [month]);
    const layouts = useMemo(() => weeks.map((week) => limitLanes(weekLayout(week, campaigns, seasons), MAX_LANES)), [weeks, campaigns, seasons]);
    const [popover, setPopover] = useState(null);
    const trigger = useRef(null);

    useEffect(() => setPopover(null), [month]);

    const close = (restoreFocus) => {
        setPopover(null);
        if (restoreFocus) trigger.current?.focus();
    };

    return (
        <div className="calendar-wrap">
            <div className="data-card calendar-card">
                <div className="calendar-head" aria-hidden="true">
                    {weeks[0].map((day) => (
                        <span className="calendar-weekday" key={day.getDay()}>{format(day, 'EEE', { locale: es })}</span>
                    ))}
                </div>
                {weeks.map((week, weekIndex) => (
                    <div className="calendar-week" key={format(week[0], 'yyyy-MM-dd')}>
                        <div className="calendar-cells">
                            {week.map((day) => {
                                const classes = ['calendar-cell'];
                                if (day.getDay() === 0 || day.getDay() === 6) classes.push('is-weekend');
                                if (!isSameMonth(day, month)) classes.push('is-out');
                                const isToday = isSameDay(day, today);
                                if (isToday) classes.push('is-today');
                                return (
                                    <div className={classes.join(' ')} key={day.getTime()}>
                                        <span className="calendar-num" aria-current={isToday ? 'date' : undefined}>{format(day, 'd')}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="calendar-events">
                            {layouts[weekIndex].events.map((event) => (
                                <EventButton key={`${event.type}-${event.label}`} event={event} week={week} month={month} onOpen={onOpen} />
                            ))}
                            {layouts[weekIndex].more.map(({ col, count }) => (
                                <button
                                    type="button"
                                    className="calendar-more"
                                    key={col}
                                    style={{ gridColumn: col + 1, gridRow: MAX_LANES }}
                                    aria-label={`${count} más el ${format(week[col], "d 'de' MMMM", { locale: es })}`}
                                    aria-expanded={popover?.col === col && popover?.weekIndex === weekIndex}
                                    onClick={(event) => {
                                        trigger.current = event.currentTarget;
                                        setPopover({ date: week[col], col, weekIndex });
                                    }}
                                >
                                    +{count} más
                                </button>
                            ))}
                        </div>
                        <div className="calendar-lines" aria-hidden="true" />
                    </div>
                ))}
            </div>
            {popover ? <DayPopover popover={popover} campaigns={campaigns} seasons={seasons} onOpen={onOpen} onClose={close} /> : null}
        </div>
    );
}
