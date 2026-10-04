import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisLabel, chartPeak, yAxisScale } from '../../utils/expenses.js';
import { formatEuros } from '../../utils/format.js';

const PLOT_HEIGHT = 300;
const TOP_ROOM = 8;
const X_AXIS_HEIGHT = 26;
const Y_AXIS_WIDTH = 64;
const SPREAD_LABELS_FROM = 12;

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

function ExpensesChart({ buckets, noun }) {
    const scale = yAxisScale(chartPeak(buckets));
    const title = `Ingresos y gastos por ${noun}`;

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
                <ResponsiveContainer width="100%" height={TOP_ROOM + PLOT_HEIGHT + X_AXIS_HEIGHT}>
                    <BarChart data={buckets} margin={{ top: TOP_ROOM, right: 0, bottom: 0, left: 0 }} barGap={4} barCategoryGap="10%">
                        <CartesianGrid vertical={false} stroke="var(--rm-line-soft)" />
                        <XAxis
                            dataKey="label"
                            height={X_AXIS_HEIGHT}
                            tickLine={false}
                            axisLine={false}
                            tickSize={0}
                            tickMargin={13}
                            interval={buckets.length > SPREAD_LABELS_FROM ? 'preserveStartEnd' : 0}
                        />
                        <YAxis
                            width={Y_AXIS_WIDTH}
                            tickLine={false}
                            axisLine={false}
                            tickSize={0}
                            tickMargin={12}
                            domain={[0, scale.top]}
                            ticks={scale.ticks}
                            tickFormatter={axisLabel}
                        />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--rm-cream-light)' }} />
                        <Bar dataKey="amount" name="Ingresos" fill="var(--rm-orange)" radius={[5, 5, 2, 2]} maxBarSize={30} />
                        <Bar dataKey="cost" name="Gastos" fill="var(--rm-cost)" radius={[5, 5, 2, 2]} maxBarSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default ExpensesChart;