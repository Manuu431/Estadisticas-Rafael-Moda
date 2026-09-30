import { useMemo } from 'react';
import { SECTION_LABELS } from '../config/labels.js';
import { summarizeBySection } from '../utils/statisticsData.js';
const groups = [...Object.entries(SECTION_LABELS), ['total', 'Total']];
const formatNumber = (value) => value.toLocaleString('es-ES');
const formatMoney = (cents) => `${(cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const metrics = [
    { key: 'units', label: 'Prendas vendidas', format: (s) => formatNumber(s.units) },
    { key: 'sales', label: 'Ventas', format: (s) => formatNumber(s.sales) },
    { key: 'profit', label: 'Beneficio', format: (s) => formatMoney(s.profitCents) }
];
function SectionSummary({ sales }) {
    const summary = useMemo(() => summarizeBySection(sales ?? []), [sales]);
    return (
        <div className="row g-3">
            {groups.map(([key, label]) => (
                <div className="col-12 col-md-4" key={key} data-cy={`summary-${key}`}>
                    <div className="card h-100">
                        <h5 className="card-header bg-orange text-white">{label}</h5>
                        <ul className="list-group list-group-flush">
                            {metrics.map((metric) => (
                                <li className="list-group-item bg-light-gray d-flex justify-content-between" key={metric.key}>
                                    <span>{metric.label}</span>
                                    <strong data-cy={`summary-${key}-${metric.key}`}>{metric.format(summary[key])}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default SectionSummary;