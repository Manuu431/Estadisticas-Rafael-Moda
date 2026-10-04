import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatEuros, formatNumber } from '../../utils/format.js';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip d-flex flex-column gap-1">
            <span className="fw-semibold">{label}</span>
            {payload.map((item) => (
                <span className="d-flex align-items-center gap-2" key={item.dataKey}>
                    <span className="panel-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    {item.payload[item.dataKey === 'a' ? 'rangeA' : 'rangeB']}
                    <strong className="ms-auto">{formatEuros(item.value)}</strong>
                </span>
            ))}
        </div>
    );
}

const TICK_CHAR_WIDTH = 7;
const TICK_PADDING = 12;

function CompareChart({ rows, height, label }) {
    const peak = Math.max(0, ...rows.flatMap((row) => [row.a, row.b]));
    const axisWidth = formatNumber(Math.ceil(peak * 2)).length * TICK_CHAR_WIDTH + TICK_PADDING;

    return (
        <div className="compare-chart" role="img" aria-label={label}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={2}>
                    <CartesianGrid vertical={false} stroke="var(--rm-line-soft)" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        width={axisWidth}
                        tickLine={false}
                        axisLine={false}
                        tickCount={5}
                        tickFormatter={formatNumber}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--rm-cream-light)' }} />
                    <Bar dataKey="a" fill="var(--rm-orange)" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="b" fill="var(--rm-compare)" radius={[3, 3, 0, 0]} maxBarSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CompareChart;
