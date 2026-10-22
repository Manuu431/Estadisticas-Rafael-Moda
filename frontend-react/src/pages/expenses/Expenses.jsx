import { useMemo, useState } from 'react';
import { format, startOfDay } from 'date-fns';
import ExpensesPeriod from './ExpensesPeriod.jsx';
import ExpensesPick from './ExpensesPick.jsx';
import ExpensesKpis from './ExpensesKpis.jsx';
import ExpensesChart from './ExpensesChart.jsx';
import ExpensesTable from './ExpensesTable.jsx';
import ExpensesSkeleton from './ExpensesSkeleton.jsx';
import { CardError } from '../controlPanel/cards/CardState.jsx';
import { DATABASE_TABLES } from '../../config/database.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useIsMobile } from '../../utils/useIsMobile.js';
import { GRAINS, chosenPeriod, datesNotice, expensesBuckets, expensesParams, expensesRange, expensesState, expensesTable, periodCount, periodMenu, periodText, skeletonRows, TABLE_ROWS, startedPeriods, wholeRange } from '../../utils/expenses.js';

const LISTS = { campaign: 'campaigns', season: 'seasons' };
const NO_TOTALS = { amount: 0, cost: 0, profit: 0 };

function Expenses({ title }) {
    const today = useMemo(() => startOfDay(new Date()), []);
    const isMobile = useIsMobile();
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

    const params = expensesParams(grain, period);
    const request = useFetch(params ? DATABASE_TABLES.statistics.expenses : null, params ?? undefined);
    const data = request.settled && !request.loading ? request.data : null;
    const state = expensesState({ data, error: request.error, listLoading: Boolean(LISTS[kind]) && list.loading, listError: LISTS[kind] ? list.error : null });
    const totals = data?.totals ?? NO_TOTALS;
    const view = data?.range && kind === 'all' ? { ...data, range: wholeRange(data.range, grain) } : data;
    const buckets = expensesBuckets(grain, view);

    const yearText = periodText('year', expensesRange('year', {}, today));
    const menuText = candidate?.text ?? (shown?.kind === kind ? shown.period.text : null);
    const menu = periodMenu(kind, menuText, yearText);
    const current = GRAINS.find((option) => option.value === grain);

    const content = (() => {
        if (state.kind === 'error') {
            return (
                <section className="panel-card">
                    <CardError onRetry={list.error ? list.refetch : request.refetch} />
                </section>
            );
        }
        if (state.kind === 'loading') return <ExpensesSkeleton rows={skeletonRows(grain, period)} paged={periodCount(grain, period) > TABLE_ROWS} compact={isMobile} />;
        return (
            <>
                <ExpensesKpis totals={totals} compact={isMobile} />
                {state.kind === 'empty' ? (
                    <section className="panel-card">
                        <div className="sales-state">
                            <p className="sales-state-text">{state.message}</p>
                        </div>
                    </section>
                ) : (
                    <div className="expenses-main">
                        <ExpensesChart buckets={buckets} grain={grain} noun={current.noun} compact={isMobile} />
                        <ExpensesTable key={`${grain}|${candidateKey}`} title={current.table} itemLabel={current.label.toLowerCase()} table={expensesTable(grain, buckets, view.range)} />
                    </div>
                )}
            </>
        );
    })();

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
                    grainOptions={GRAINS}
                    grain={grain}
                    onGrainChange={setGrain}
                    large={isMobile}
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
                notice={datesNotice(kind, dates)}
                large={isMobile}
            />
            {content}
        </div>
    );
}

export default Expenses;