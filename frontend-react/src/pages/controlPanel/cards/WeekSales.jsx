import { useMemo } from 'react';
import { fillDays, monthComparison } from '../../../utils/statisticsData.js';
import { formatDayTick, formatShortRange, shiftYear } from '../../../utils/dates.js';
import { formatNumber, formatEuros, formatShare, barWidth, barHeight } from '../../../utils/format.js';
import DeltaPill from '../../../components/DeltaPill.jsx';
import { CardError, Skeleton } from './CardState.jsx';

function WeekSkeleton() {
    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex flex-column gap-2">
                <Skeleton className="w-75 is-hero" />
                <Skeleton className="w-50" />
            </div>
            <Skeleton className="is-bars" />
            <div className="row pt-3 mt-auto g-3 panel-divider">
                {[0, 1, 2].map((slot) => (
                    <div className="col-4 d-flex flex-column gap-2" key={slot}>
                        <Skeleton className="w-50" />
                        <Skeleton className="w-75 is-stat" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function WeekSales({ summary, daily, from, to, showSplit, error, onRetry }) {
    const week = useMemo(() => {
        if (!summary || !daily) return null;
        const comparedFrom = shiftYear(from);
        const comparedTo = shiftYear(to);
        const days = fillDays(daily.days, from, to);
        const comparedDays = fillDays(daily.comparedDays, comparedFrom, comparedTo);
        return {
            bars: days.map((day, index) => ({ ...day, compared: comparedDays[index].total })),
            peak: Math.max(...days.map((day) => day.total), ...comparedDays.map((day) => day.total)),
            comparedLabel: formatShortRange(comparedFrom, comparedTo),
            comparedYear: comparedFrom.getFullYear(),
            delta: monthComparison(summary.summary.total, summary.compared.total).delta
        };
    }, [summary, daily, from, to]);
    if (error) return <CardError onRetry={onRetry} />;
    if (!week) return <WeekSkeleton />;
    const current = summary.summary;
    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex flex-column gap-2">
                <span className="panel-display panel-display-hero">{formatEuros(current.total)}</span>
                <div className="d-flex align-items-center gap-2 flex-wrap panel-note">
                    <DeltaPill value={week.delta} />
                    <span>vs. {week.comparedLabel} · {formatEuros(summary.compared.total)}</span>
                </div>
            </div>
            <div className="d-flex align-items-end gap-2">
                {week.bars.map((day) => (
                    <button
                        type="button"
                        className="d-flex flex-column gap-2 flex-grow-1 panel-bar-col"
                        key={day.date.getTime()}
                        aria-label={`${formatDayTick(day.date)}: ${formatEuros(day.total)}. En ${week.comparedYear}, ${formatEuros(day.compared)}`}
                    >
                        <span className="d-flex align-items-end gap-1 panel-bar-slot">
                            <span className={`panel-bar${day.total > 0 ? '' : ' is-empty'}`} style={barHeight(day.total, week.peak)}>
                                <span className="d-flex flex-column gap-1 panel-tooltip panel-bar-tip" aria-hidden="true">
                                    <span className="fw-semibold">{formatEuros(day.total)}</span>
                                    <span className="panel-muted">{week.comparedYear}: {formatEuros(day.compared)}</span>
                                </span>
                            </span>
                            <span className="panel-bar is-compare" style={barHeight(day.compared, week.peak)} />
                        </span>
                        <span className="text-center panel-bar-label">{formatDayTick(day.date)}</span>
                    </button>
                ))}
            </div>
            {showSplit && current.total > 0 ? (
                <div className="d-flex flex-column gap-2">
                    <span className="d-flex panel-split">
                        <span className="panel-split-fill" style={barWidth(current.mujer, current.total)} />
                    </span>
                    <div className="d-flex justify-content-between gap-3 flex-wrap panel-note">
                        <span className="d-flex align-items-center gap-2">
                            <span className="panel-swatch is-mujer" />
                            Mujer <strong>{formatEuros(current.mujer)}</strong> · {formatShare(current.mujer, current.total)}
                        </span>
                        <span className="d-flex align-items-center gap-2">
                            <span className="panel-swatch is-hombre" />
                            Hombre <strong>{formatEuros(current.hombre)}</strong> · {formatShare(current.hombre, current.total)}
                        </span>
                    </div>
                </div>
            ) : null}
            <div className="row pt-3 mt-auto g-3 panel-divider">
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Prendas</span>
                    <span className="panel-stat">{formatNumber(current.units)}</span>
                </div>
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Tickets</span>
                    <span className="panel-stat">{formatNumber(current.tickets)}</span>
                </div>
                <div className="col-4 d-flex flex-column gap-1">
                    <span className="panel-muted">Ticket medio</span>
                    <span className="panel-stat">{formatEuros(current.tickets > 0 ? current.total / current.tickets : 0)}</span>
                </div>
            </div>
        </div>
    );
}