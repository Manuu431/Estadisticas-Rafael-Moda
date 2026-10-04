import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisLabel, chartPeak, yAxisScale } from '../../utils/expenses.js';
import { formatEuros } from '../../utils/format.js';

const TOP_ROOM = 8;
const SIZES = {
    desktop: { plot: 300, xAxis: 26, xMargin: 13, yAxis: 64, yMargin: 12, barGap: 4, categoryGap: '10%', maxBar: 30, radius: 5 },
    mobile: { plot: 220, xAxis: 22, xMargin: 11, yAxis: 52, yMargin: 8, barGap: 2, categoryGap: '7%', maxBar: 22, radius: 4 }
};

function ChartTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip d-flex flex-column gap-1">
            <span className="fw-semibold">{payload[0].payload.name}</span>
            {payload.map((item) => (
                <span className="d-flex align-items-center gap-2" key={item.dataKey}>
                    <span className={`panel-dot ${item.dataKey === 'amount' ? 'is-income' : 'is-cost'}`} aria-hidden="true" />
                    {item.name}
                    <strong className="ms-auto">{formatEuros(item.value)}</strong>
                </span>
            ))}
        </div>
    );
}

function ExpensesChart({ buckets, noun, compact }) {
    const scale = yAxisScale(chartPeak(buckets));
    const title = `Ingresos y gastos por ${noun}`;
    const size = compact ? SIZES.mobile : SIZES.desktop;
    const radius = [size.radius, size.radius, 2, 2];

    return (
        <section className="panel-card expenses-card" aria-label={title}>
            <div className="expenses-card-head">
                <h2 className="panel-card-title m-0">{title}</h2>
                <div className="expenses-legend">
                    <span><span className="panel-dot is-income" aria-hidden="true" />Ingresos</span>
                    <span><span className="panel-dot is-cost" aria-hidden="true" />Gastos</span>
                </div>
            </div>
            <div className="expenses-chart" role="img" aria-label={title}>
                <ResponsiveContainer width="100%" height={TOP_ROOM + size.plot + size.xAxis}>
                    <BarChart data={buckets} margin={{ top: TOP_ROOM, right: 0, bottom: 0, left: 0 }} barGap={size.barGap} barCategoryGap={size.categoryGap}>
                        <CartesianGrid vertical={false} stroke="var(--rm-line-soft)" />
                        <XAxis
                            dataKey="label"
                            height={size.xAxis}
                            tickLine={false}
                            axisLine={false}
                            tickSize={0}
                            tickMargin={size.xMargin}
                            interval="preserveStartEnd"
                            minTickGap={4}
                        />
                        <YAxis
                            width={size.yAxis}
                            tickLine={false}
                            axisLine={false}
                            tickSize={0}
                            tickMargin={size.yMargin}
                            domain={[0, scale.top]}
                            ticks={scale.ticks}
                            tickFormatter={axisLabel}
                        />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--rm-cream-light)' }} />
                        <Bar dataKey="amount" name="Ingresos" fill="var(--rm-orange)" radius={radius} maxBarSize={size.maxBar} />
                        <Bar dataKey="cost" name="Gastos" fill="var(--rm-cost)" radius={radius} maxBarSize={size.maxBar} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default ExpensesChart;