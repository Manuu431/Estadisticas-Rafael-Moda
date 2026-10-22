import { useMemo } from 'react';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceDot,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';
import { format, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { accumulate, monthComparison } from '../../../utils/statisticsData.js';
import { formatMonthOfYear, formatMonthTitle, formatMonthYear, formatShortDay } from '../../../utils/dates.js';
import { formatNumber, formatEuros, formatShare } from '../../../utils/format.js';
import DeltaPill from '../../../components/DeltaPill.jsx';
import { CardError, Skeleton } from './CardState.jsx';

function YearTooltip({ active, payload, years }) {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;

    return (
        <div className="panel-tooltip d-flex flex-column gap-2">
            <span className="fw-semibold">{formatShortDay(point.date)}</span>
            <div className="d-flex flex-column gap-1">
                <span className="d-flex align-items-center gap-2">
                    <span className="panel-swatch is-accent" />
                    {years.current}
                    <span className="fw-semibold ms-auto">{formatEuros(point.current)}</span>
                </span>
                <span className="d-flex align-items-center gap-2">
                    <span className="panel-swatch is-compare" />
                    {years.previous}
                    <span className="fw-semibold ms-auto">{formatEuros(point.previous)}</span>
                </span>
            </div>
        </div>
    );
}

export function YearLegend({ month }) {
    return (
        <div className="d-flex gap-3 panel-muted">
            <span className="d-flex align-items-center gap-2"><span className="panel-legend-line" />{month.start.getFullYear()}</span>
            <span className="d-flex align-items-center gap-2"><span className="panel-legend-line is-dashed" />{month.start.getFullYear() - 1}</span>
        </div>
    );
}

function MonthSkeleton() {
    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex align-items-end justify-content-between gap-4">
                <div className="d-flex flex-column gap-2 w-50">
                    <Skeleton className="is-hero" />
                    <Skeleton className="w-75" />
                </div>
                <div className="d-flex flex-column gap-2 w-25">
                    <Skeleton />
                    <Skeleton className="is-stat" />
                </div>
            </div>
            <Skeleton className="is-chart" />
            <div className="d-flex flex-column gap-2 mt-auto">
                <Skeleton className="w-75" />
                <Skeleton />
            </div>
        </div>
    );
}

export default function MonthSummary({ summary, daily, month, chart, error, onRetry }) {
    const data = useMemo(() => {
        if (!summary || !daily) return null;
        const points = accumulate(daily.days, daily.comparedDays, chart.from, chart.to).map((point, index) => ({ ...point, day: index + 1 }));
        return {
            previousMonth: subYears(month.start, 1),
            points,
            monthTicks: points.filter((point) => point.date.getDate() === 1).map((point) => point.day),
            ...monthComparison(summary.summary.total, summary.compared.total)
        };
    }, [summary, daily, month, chart]);

    if (error) return <CardError onRetry={onRetry} />;
    if (!data) return <MonthSkeleton />;

    const { previousMonth, points, beaten } = data;
    const current = summary.summary;
    const last = points[points.length - 1];

    return (
        <div className="d-flex flex-column gap-4 flex-grow-1">
            <div className="d-flex align-items-end justify-content-between gap-4 flex-wrap">
                <div className="d-flex flex-column gap-2">
                    <span className="panel-display panel-display-hero">{formatEuros(current.total)}</span>
                    <div className="d-flex align-items-center gap-2 flex-wrap panel-note">
                        <DeltaPill value={data.delta} />
                        <span>vs. {formatMonthYear(previousMonth)} · {formatEuros(summary.compared.total)}</span>
                    </div>
                </div>
                <div className="panel-profit d-flex flex-column gap-1">
                    <span className="panel-muted">Beneficio</span>
                    <span className="panel-stat">{formatEuros(current.profit)}</span>
                    <span className="panel-muted">Margen {formatShare(current.profit, current.total)}</span>
                </div>
            </div>
            <ResponsiveContainer className="year-chart" width="100%" height={200}>
                <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--rm-line-soft)" vertical={false} />
                    <XAxis
                        dataKey="day"
                        type="number"
                        domain={[1, points.length]}
                        ticks={data.monthTicks}
                        tickFormatter={(day) => format(points[day - 1].date, 'MMM', { locale: es })}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--rm-line-soft)' }}
                    />
                    <YAxis
                        width={56}
                        tickCount={5}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatNumber(Math.round(value))}
                    />
                    <Tooltip content={<YearTooltip years={{ current: chart.to.getFullYear(), previous: chart.to.getFullYear() - 1 }} />} />
                    <Area
                        type="linear"
                        dataKey="current"
                        stroke="var(--rm-orange)"
                        strokeWidth={2.5}
                        fill="var(--rm-orange)"
                        fillOpacity={0.08}
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Line
                        type="linear"
                        dataKey="previous"
                        stroke="var(--rm-compare-line)"
                        strokeWidth={1.75}
                        strokeDasharray="4 4"
                        dot={false}
                        isAnimationActive={false}
                    />
                    <ReferenceDot x={last.day} y={last.current} r={5} fill="var(--rm-surface)" stroke="var(--rm-orange)" strokeWidth={2.5} />
                </ComposedChart>
            </ResponsiveContainer>
            <div className="d-flex flex-column gap-2 mt-auto">
                <div className="d-flex justify-content-between gap-3 panel-note">
                    <span>
                        {beaten ? (
                            <>Se ha superado {formatMonthOfYear(previousMonth)} por <strong>{formatEuros(data.difference)}</strong>.</>
                        ) : (
                            <>{formatMonthTitle(previousMonth)} de {previousMonth.getFullYear()} cerró en <strong>{formatEuros(summary.compared.total)}</strong>. Faltan <strong>{formatEuros(data.difference)}</strong> para superarlo.</>
                        )}
                    </span>
                    <span className="fw-semibold text-nowrap">{formatShare(data.progress, 100)}</span>
                </div>
                <span className="panel-track is-thin d-block">
                    <span className="panel-fill d-block" style={{ '--w': `${data.progress}%` }} />
                </span>
            </div>
        </div>
    );
}
