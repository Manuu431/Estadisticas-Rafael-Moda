import { useMemo, useState } from 'react';
import PeriodPicker from '../../components/PeriodPicker.jsx';
import PairedBarChart from '../../components/PairedBarChart.jsx';
import { DATABASE_TABLES } from '../../config/database.js';
import { SHOW_BY_OPTIONS } from '../../config/info.js';
import { useFetch } from '../../hooks/useFetch.js';
import { bucketSales, filterByRange, summarize } from '../../utils/compareData.js';
import { formatEuros, formatEurosRound, formatShare } from '../../utils/format.js';

const THIS_YEAR = new Date().getFullYear();

const INITIAL = {
    start_date: `${THIS_YEAR}-01-01`,
    end_date: `${THIS_YEAR}-12-31`,
    period: '',
    selectDateBy: 'exact_date'
};

const SERIES = [
    { key: 'amount', name: 'Ingresos', color: 'var(--rm-orange)' },
    { key: 'cost', name: 'Gastos', color: 'var(--rm-cost)' }
];

function Expenses({ title }) {
    const [filters, setFilters] = useState(INITIAL);
    const [applied, setApplied] = useState(INITIAL);
    const [showBy, setShowBy] = useState('month');
    const { data } = useFetch(DATABASE_TABLES.sales.endpoint);

    const sales = useMemo(
        () => filterByRange(data ?? [], applied.start_date, applied.end_date),
        [data, applied.start_date, applied.end_date]
    );
    const totals = useMemo(() => summarize(sales), [sales]);
    const buckets = useMemo(() => bucketSales(sales, showBy), [sales, showBy]);
    const rows = useMemo(() => [...buckets].reverse(), [buckets]);
    const showByLabel = SHOW_BY_OPTIONS.find((option) => option.value === showBy)?.label.toLowerCase() ?? '';

    return (
        <>
            <header className="d-flex flex-column gap-1 mb-4">
                <span className="panel-kicker">Lo que cuesta la ropa que vendes, frente a lo que ingresas</span>
                <h1 className="panel-title m-0">{title}</h1>
            </header>
            <div className="d-flex flex-column gap-4">
                <PeriodPicker
                    filters={filters}
                    setFilters={setFilters}
                    onApply={setApplied}
                    onClear={() => {
                        setFilters(INITIAL);
                        setApplied(INITIAL);
                    }}
                />
                <div className="row g-4">
                    <div className="col-12 col-md-4">
                        <section className="panel-card d-flex flex-column gap-2 h-100">
                            <span className="panel-card-title d-flex align-items-center gap-2">
                                <span className="panel-dot is-income" aria-hidden="true" />
                                Ingresos
                            </span>
                            <span className="panel-display">{formatEuros(totals.amount)}</span>
                            <span className="panel-muted">Lo que han pagado los clientes</span>
                        </section>
                    </div>
                    <div className="col-12 col-md-4">
                        <section className="panel-card d-flex flex-column gap-2 h-100">
                            <span className="panel-card-title d-flex align-items-center gap-2">
                                <span className="panel-dot is-cost" aria-hidden="true" />
                                Gastos en mercancía
                            </span>
                            <span className="panel-display">{formatEuros(totals.cost)}</span>
                            <span className="panel-muted">
                                Lo que costó la ropa vendida · {formatShare(totals.cost, totals.amount)} de lo ingresado
                            </span>
                        </section>
                    </div>
                    <div className="col-12 col-md-4">
                        <section className="panel-card d-flex flex-column gap-2 h-100">
                            <span className="panel-card-title">Beneficio</span>
                            <span className="panel-display text-positive">{formatEuros(totals.profit)}</span>
                            <span className="panel-muted">
                                Te quedas con el {formatShare(totals.profit, totals.amount)} de cada venta
                            </span>
                        </section>
                    </div>
                </div>
                <div className="row g-4 align-items-start">
                    <div className="col-12 col-xl-7">
                        <section className="panel-card d-flex flex-column gap-3">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <h2 className="panel-card-title m-0">Ingresos y gastos por {showByLabel}</h2>
                                <div className="panel-segs d-inline-flex" role="group" aria-label="Mostrar por">
                                    {SHOW_BY_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`panel-seg${showBy === option.value ? ' is-on' : ''}`}
                                            aria-pressed={showBy === option.value}
                                            onClick={() => setShowBy(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex gap-3 panel-muted">
                                <span className="d-flex align-items-center gap-2">
                                    <span className="panel-dot is-income" aria-hidden="true" />
                                    Ingresos
                                </span>
                                <span className="d-flex align-items-center gap-2">
                                    <span className="panel-dot is-cost" aria-hidden="true" />
                                    Gastos
                                </span>
                            </div>
                            <PairedBarChart data={buckets} series={SERIES} label="Ingresos y gastos" />
                        </section>
                    </div>
                    <div className="col-12 col-xl-5">
                        <section className="panel-card d-flex flex-column gap-3">
                            <h2 className="panel-card-title m-0">
                                {showBy === 'year' ? 'Año a año' : showBy === 'month' ? 'Mes a mes' : 'Día a día'}
                            </h2>
                            {rows.length === 0 ? (
                                <p className="panel-muted m-0">No hay ventas en este periodo.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Periodo</th>
                                                <th scope="col" className="data-numeric">Ingresos</th>
                                                <th scope="col" className="data-numeric d-none d-lg-table-cell">Gastos</th>
                                                <th scope="col" className="data-numeric">Beneficio</th>
                                                <th scope="col" className="data-numeric">%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => (
                                                <tr key={row.key}>
                                                    <td className="fw-medium">{row.label}</td>
                                                    <td className="data-numeric">{formatEurosRound(row.amount)}</td>
                                                    <td className="data-numeric panel-muted d-none d-lg-table-cell">{formatEurosRound(row.cost)}</td>
                                                    <td className="data-numeric data-positive">{formatEurosRound(row.profit)}</td>
                                                    <td className="data-numeric">
                                                        <span className={`panel-pct${row.margin < 42 ? ' is-low' : ''}`}>
                                                            {formatShare(row.profit, row.amount)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <p className="panel-muted m-0">
                                En los meses de rebajas el porcentaje baja porque se vende con descuento.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Expenses;