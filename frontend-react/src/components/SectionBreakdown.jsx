import { useMemo } from 'react';
import { SECTION_LABELS } from '../config/labels.js';
import { summarizeBySection } from '../utils/statisticsData.js';
import { formatNumber, formatMoney, barWidth } from '../utils/format.js';

const SECTION_ROWS = [...Object.entries(SECTION_LABELS), ['total', 'Total']];

const METRICS = [
    { key: 'units', label: 'Prendas vendidas', format: (summary) => formatNumber(summary.units) },
    { key: 'sales', label: 'Ventas', format: (summary) => formatNumber(summary.sales) },
    { key: 'profit', label: 'Beneficio', format: (summary) => formatMoney(summary.profitCents) }
];

function BreakdownRow({ dataKey, label, summary, total, isTotal }) {
    return (
        <>
            <span className={`d-flex flex-column gap-2 pt-3${isTotal ? ' panel-divider' : ''}`} data-cy={`summary-${dataKey}`}>
                <span className="fw-semibold">{label}</span>
                {isTotal ? null : (
                    <span className="panel-track">
                        <span className="panel-fill d-block" style={barWidth(summary.units, total.units)} />
                    </span>
                )}
            </span>
            {METRICS.map((metric) => (
                <span
                    className={`panel-stat text-end pt-3${isTotal ? ' panel-divider' : ''}`}
                    key={metric.key}
                    data-cy={`summary-${dataKey}-${metric.key}`}
                >
                    {metric.format(summary)}
                </span>
            ))}
        </>
    );
}

function SectionBreakdown({ sales }) {
    const summary = useMemo(() => summarizeBySection(sales ?? []), [sales]);

    return (
        <div className="panel-breakdown">
            <span className="panel-label">Sección</span>
            {METRICS.map((metric) => (
                <span className="panel-label text-end" key={metric.key}>{metric.label}</span>
            ))}
            {SECTION_ROWS.map(([key, label], index) => (
                <BreakdownRow
                    key={key}
                    dataKey={key}
                    label={label}
                    summary={summary[key]}
                    total={summary.total}
                    isTotal={index === SECTION_ROWS.length - 1}
                />
            ))}
        </div>
    );
}

export default SectionBreakdown;