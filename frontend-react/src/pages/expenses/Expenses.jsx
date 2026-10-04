import { useMemo, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import ExpensesPeriod from './ExpensesPeriod.jsx';
import ExpensesPick from './ExpensesPick.jsx';
import ExpensesKpis from './ExpensesKpis.jsx';
import ExpensesChart from './ExpensesChart.jsx';
import { DATABASE_TABLES } from '../../config/database.js';
import { useFetch } from '../../hooks/useFetch.js';
import { formatEurosRound, formatShare } from '../../utils/format.js';
import { chosenPeriod, expensesBuckets, expensesParams, expensesRange, monthsLabel, periodMenu, periodText, startedPeriods, yearsText } from '../../utils/expenses.js';

const LISTS = { campaign: 'campaigns', season: 'seasons' };
const NO_TOTALS = { amount: 0, cost: 0, profit: 0 };

function Expenses({ title }) {
    const today = useMemo(() => startOfDay(new Date()), []);
    const [kind, setKind] = useState('year');
    const [picks, setPicks] = useState({ campaign: '', season: '' });
    const [dates, setDates] = useState(() => ({ key: 'custom', from: `${today.getFullYear()}-01-01`, to: format(today, 'yyyy-MM-dd'), bad: [] }));
    const [grain, setGrain] = useState('month');
    const [shown, setShown] = useState(null);

    const list = useFetch(LISTS[kind] ? DATABASE_TABLES[LISTS[kind]].endpoint : null);
    const started = useMemo(() => startedPeriods(list.data, today), [list.data, today]);
    const item = LISTS[kind] ? chosenPeriod(started, picks[kind], today) : null;

    const candidate = useMemo(() => {
        const range = expensesRange(kind, { item, dates }, today);
        return range ? { ...range, text: periodText(kind, range, item?.name) } : null;
    }, [kind, item, dates, today]);
    const candidateKey = candidate ? `${candidate.from}|${candidate.to}|${candidate.text}` : null;
    if (candidateKey && shown?.key !== candidateKey) setShown({ key: candidateKey, period: candidate, kind });
    const period = candidate ?? shown?.period ?? null;

    const request = useFetch(DATABASE_TABLES.statistics.expenses, expensesParams(grain, period));
    const data = request.settled && !request.loading ? request.data : null;
    const totals = data?.totals ?? NO_TOTALS;
    const buckets = expensesBuckets(grain, data, today);
    const rows = [...buckets].reverse();

    const yearText = periodText('year', expensesRange('year', {}, today));
    const menuText = candidate?.text ?? (shown?.kind === kind ? shown.period.text : null);
    const menu = periodMenu(kind, menuText, yearText);
    const grainOptions = [{ value: 'month', label: monthsLabel(period) }, { value: 'year', label: 'Años' }];
    const noun = grain === 'year' ? 'año' : 'mes';

    return (
        <div className="expenses-page">
            <div className="expenses-head">
                <header className="panel-heading d-flex flex-column">
                    <span className="panel-period">Lo que cuesta la ropa que vendes, frente a lo que ingresas</span>
                    <h1 className="panel-title m-0">{title}</h1>
                </header>
                <ExpensesPeriod
                    menu={menu}
                    kind={kind}
                    onKindChange={setKind}
                    locked={grain === 'year'}
                    lockedText={yearsText(data?.range ?? null, today)}
                    grainOptions={grainOptions}
                    grain={grain}
                    onGrainChange={setGrain}
                />
            </div>
            <ExpensesPick
                kind={kind}
                items={started}
                loading={list.loading}
                value={String(item?.id ?? '')}
                onChange={(id) => setPicks((prev) => ({ ...prev, [kind]: id }))}
                dates={dates}
                onDatesChange={setDates}
            />
            <div className="d-flex flex-column gap-4">
                <ExpensesKpis totals={totals} />
                <div className="expenses-main">
                    <ExpensesChart buckets={buckets} noun={noun} />
                    <section className="panel-card d-flex flex-column gap-3">
                        <h2 className="panel-card-title m-0">{grain === 'year' ? 'Año a año' : 'Mes a mes'}</h2>
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
                                                <td className="fw-medium">{row.name}</td>
                                                <td className="data-numeric">{formatEurosRound(row.amount)}</td>
                                                <td className="data-numeric panel-muted d-none d-lg-table-cell">{formatEurosRound(row.cost)}</td>
                                                <td className="data-numeric data-positive">{formatEurosRound(row.profit)}</td>
                                                <td className="data-numeric">
                                                    <span className={`panel-pct${row.margin !== null && row.margin < 42 ? ' is-low' : ''}`}>
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
    );
}

export default Expenses;