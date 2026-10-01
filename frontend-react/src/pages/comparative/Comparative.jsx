import { useMemo, useState } from 'react';
import PeriodPicker from '../../components/PeriodPicker.jsx';
import PairedBarChart from '../../components/PairedBarChart.jsx';
import DeltaPill from '../../components/DeltaPill.jsx';
import { DATABASE_TABLES } from '../../config/database.js';
import { GROUP_BY_OPTIONS, SHOW_BY_OPTIONS } from '../../config/info.js';
import { useFetch } from '../../hooks/useFetch.js';
import { bucketSales, compareGroups, deltaPercent, filterByRange, summarize } from '../../utils/compareData.js';
import { formatEuros, formatNumber } from '../../utils/format.js';

const THIS_YEAR = new Date().getFullYear();

const INITIAL = {
    start_date_1: `${THIS_YEAR}-01-01`,
    end_date_1: `${THIS_YEAR}-12-31`,
    start_date_2: `${THIS_YEAR - 1}-01-01`,
    end_date_2: `${THIS_YEAR - 1}-12-31`,
    period_1: '',
    period_2: '',
    selectDateBy: 'exact_date'
};

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const SERIES = [
    { key: 'a', name: 'Periodo A', color: 'var(--rm-orange)' },
    { key: 'b', name: 'Periodo B', color: 'var(--rm-compare)' }
];

function Comparative({ title }) {
    const [filters, setFilters] = useState(INITIAL);
    const [applied, setApplied] = useState(INITIAL);
    const [showBy, setShowBy] = useState('month');
    const [groupBy, setGroupBy] = useState('brand');
    const { data } = useFetch(DATABASE_TABLES.sales.endpoint);

    const salesA = useMemo(
        () => filterByRange(data ?? [], applied.start_date_1, applied.end_date_1),
        [data, applied.start_date_1, applied.end_date_1]
    );
    const salesB = useMemo(
        () => filterByRange(data ?? [], applied.start_date_2, applied.end_date_2),
        [data, applied.start_date_2, applied.end_date_2]
    );
    const totalsA = useMemo(() => summarize(salesA), [salesA]);
    const totalsB = useMemo(() => summarize(salesB), [salesB]);

    const chartData = useMemo(() => {
        const bucketsA = bucketSales(salesA, showBy);
        const bucketsB = bucketSales(salesB, showBy);
        const length = Math.max(bucketsA.length, bucketsB.length);
        return Array.from({ length }, (_, index) => ({
            label: bucketsA[index]?.label ?? bucketsB[index]?.label ?? '',
            a: bucketsA[index]?.amount ?? 0,
            b: bucketsB[index]?.amount ?? 0
        }));
    }, [salesA, salesB, showBy]);

    const breakdown = useMemo(() => compareGroups(salesA, salesB, groupBy), [salesA, salesB, groupBy]);
    const showByLabel = SHOW_BY_OPTIONS.find((option) => option.value === showBy)?.label.toLowerCase() ?? '';
    const groupLabel = GROUP_BY_OPTIONS.find((option) => option.value === groupBy)?.label ?? groupBy;

    const kpis = [
        { label: 'Ventas', a: formatEuros(totalsA.amount), b: formatEuros(totalsB.amount), delta: deltaPercent(totalsA.amount, totalsB.amount) },
        { label: 'Beneficio', a: formatEuros(totalsA.profit), b: formatEuros(totalsB.profit), delta: deltaPercent(totalsA.profit, totalsB.profit) },
        { label: 'Prendas vendidas', a: formatNumber(totalsA.units), b: formatNumber(totalsB.units), delta: deltaPercent(totalsA.units, totalsB.units) },
        { label: 'Ticket medio', a: formatEuros(totalsA.average), b: formatEuros(totalsB.average), delta: deltaPercent(totalsA.average, totalsB.average) }
    ];

    return (
        <>
            <header className="d-flex flex-column gap-1 mb-4">
                <span className="panel-kicker">Dos periodos, uno al lado del otro</span>
                <h1 className="panel-title m-0">{title}</h1>
            </header>
            <div className="d-flex flex-column gap-4">
                <section className="panel-card d-flex flex-column gap-3">
                    <h2 className="panel-card-title m-0">Qué comparar</h2>
                    <PeriodPicker
                        periods={2}
                        filters={filters}
                        setFilters={setFilters}
                        onApply={setApplied}
                        onClear={() => {
                            setFilters(INITIAL);
                            setApplied(INITIAL);
                        }}
                    />
                </section>
                <div className="row g-4">
                    {kpis.map((kpi) => (
                        <div className="col-6 col-xl-3" key={kpi.label}>
                            <section className="panel-card d-flex flex-column gap-2 h-100">
                                <span className="panel-card-title">{kpi.label}</span>
                                <span className="panel-display panel-display-kpi">{kpi.a}</span>
                                <DeltaPill value={kpi.delta} />
                                <span className="panel-muted">Periodo B: {kpi.b}</span>
                            </section>
                        </div>
                    ))}
                </div>
                <div className="row g-4 align-items-start">
                    <div className="col-12 col-xl-7">
                        <section className="panel-card d-flex flex-column gap-3">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <h2 className="panel-card-title m-0">Ventas por {showByLabel}</h2>
                                <div className="d-flex gap-3 panel-muted">
                                    <span className="d-flex align-items-center gap-2">
                                        <span className="panel-dot is-a" aria-hidden="true" />
                                        Periodo A
                                    </span>
                                    <span className="d-flex align-items-center gap-2">
                                        <span className="panel-dot is-b" aria-hidden="true" />
                                        Periodo B
                                    </span>
                                </div>
                            </div>
                            <div className="panel-segs d-inline-flex align-self-start" role="group" aria-label="Mostrar por">
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
                            <PairedBarChart data={chartData} series={SERIES} label="Ventas de los dos periodos" />
                        </section>
                    </div>
                    <div className="col-12 col-xl-5">
                        <section className="panel-card d-flex flex-column gap-3">
                            <div className="d-flex flex-column gap-1">
                                <h2 className="panel-card-title m-0">Desglose</h2>
                                <span className="panel-muted">Por {groupLabel} · periodo A frente a B</span>
                            </div>
                            <div className="panel-segs d-inline-flex align-self-start" role="group" aria-label="Segmentar por">
                                {GROUP_BY_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`panel-seg${groupBy === option.value ? ' is-on' : ''}`}
                                        aria-pressed={groupBy === option.value}
                                        onClick={() => setGroupBy(option.value)}
                                    >
                                        {capitalize(option.label)}
                                    </button>
                                ))}
                            </div>
                            {breakdown.length === 0 ? (
                                <p className="panel-muted m-0">No hay ventas en estos periodos.</p>
                            ) : (
                                <ul className="list-unstyled m-0">
                                    {breakdown.map((row) => (
                                        <li className="compare-row d-flex align-items-center gap-3" key={row.name}>
                                            <span className="d-flex flex-column flex-grow-1 overflow-hidden">
                                                <span className="fw-semibold text-truncate">{row.name}</span>
                                                <span className="panel-muted">Periodo B: {formatEuros(row.b)}</span>
                                            </span>
                                            <span className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                                                <span className="fw-semibold">{formatEuros(row.a)}</span>
                                                <DeltaPill value={deltaPercent(row.a, row.b)} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comparative;