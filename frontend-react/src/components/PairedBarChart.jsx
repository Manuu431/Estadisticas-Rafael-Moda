import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatEuros } from '../utils/format.js';

const shortNumber = (value) =>
    value >= 1000
        ? `${(value / 1000).toLocaleString('es-ES', { maximumFractionDigits: 0 })} mil`
        : value.toLocaleString('es-ES');

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="chart-tooltip d-flex flex-column gap-1">
            <span className="fw-semibold">{label}</span>
            {payload.map((item) => (
                <span className="d-flex align-items-center gap-2" key={item.dataKey}>
                    <span className="panel-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    {item.name}
                    <strong className="ms-auto">{formatEuros(item.value)}</strong>
                </span>
            ))}
        </div>
    );
}

function PairedBarChart({ data, series, height = 320, label = 'Gráfica de barras' }) {
    if (data.length === 0) {
        return <p className="panel-muted m-0">No hay ventas en este periodo.</p>;
    }

    return (
        <div role="img" aria-label={label}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barGap={2}>
                    <CartesianGrid vertical={false} stroke="var(--rm-line-soft)" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                        tick={{ fill: 'var(--rm-ink-3)', fontSize: 11 }}
                    />
                    <YAxis
                        width={60}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={shortNumber}
                        tick={{ fill: 'var(--rm-ink-3)', fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--rm-cream-light)' }} />
                    {series.map((item) => (
                        <Bar
                            key={item.key}
                            dataKey={item.key}
                            name={item.name}
                            fill={item.color}
                            radius={[4, 4, 2, 2]}
                            maxBarSize={28}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PairedBarChart;