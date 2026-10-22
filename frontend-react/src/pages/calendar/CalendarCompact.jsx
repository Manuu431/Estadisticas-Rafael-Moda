import { useMemo } from 'react';
import { format, isSameDay, isSameMonth } from 'date-fns';
import { monthWeeks, outsideRange, weekLayout } from '../../utils/calendar.js';

const INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Versión del móvil: sin texto de eventos. La campaña es una barra fina bajo el número y el cambio de
// temporada, un punto. Pulsar un día no hace nada (no hay acción en el diseño).
export function CalendarCompact({ campaigns, seasons, month, today }) {
    const weeks = useMemo(() => monthWeeks(month), [month]);

    return (
        <div className="calendar-compact">
            <div className="calendar-compact-head" aria-hidden="true">
                {INITIALS.map((initial, index) => <span key={index}>{initial}</span>)}
            </div>
            {weeks.map((week) => {
                const { events } = weekLayout(week, campaigns, seasons);
                const dotCols = new Set(events.filter((event) => event.type === 'season').map((event) => event.startCol));
                const bars = events.filter((event) => event.type === 'campaign');
                const lanes = [...new Set(bars.map((event) => event.lane))].sort((a, b) => a - b);
                return (
                    <div className="calendar-compact-week" key={format(week[0], 'yyyy-MM-dd')}>
                        {week.map((day, col) => {
                            const isToday = isSameDay(day, today);
                            return (
                                <div className={`calendar-compact-cell${isSameMonth(day, month) ? '' : ' is-out'}`} key={day.getTime()}>
                                    <span className={`calendar-compact-num${isToday ? ' is-today' : ''}`} aria-current={isToday ? 'date' : undefined}>
                                        {format(day, 'd')}
                                    </span>
                                    {dotCols.has(col) ? <span className="calendar-compact-dot" aria-hidden="true" /> : null}
                                </div>
                            );
                        })}
                        <div className="calendar-compact-bars" aria-hidden="true">
                            {bars.map((event) => {
                                const { before, after } = outsideRange(week, month, event.startCol, event.endCol);
                                const classes = ['calendar-compact-bar'];
                                if (event.startsHere) classes.push('starts');
                                if (event.endsHere) classes.push('ends');
                                return (
                                    <span
                                        key={event.label}
                                        className={classes.join(' ')}
                                        style={{
                                            '--col': `${event.startCol + 1} / ${event.endCol + 2}`,
                                            '--row': lanes.indexOf(event.lane) + 1,
                                            '--before': before,
                                            '--after': after,
                                            '--span': event.endCol - event.startCol + 1,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
