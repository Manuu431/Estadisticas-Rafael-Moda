import { useMemo, useState } from 'react';
import { parseISO, startOfDay } from 'date-fns';
import ComparePeriods from './ComparePeriods.jsx';
import CompareKpis from './CompareKpis.jsx';
import CompareChart from './CompareChart.jsx';
import CompareBreakdown from './CompareBreakdown.jsx';
import { CardError, Skeleton } from '../controlPanel/cards/CardState.jsx';
import { DATABASE_TABLES } from '../../config/database.js';
import { useFetch } from '../../hooks/useFetch.js';
import { previousEdition } from '../../utils/campaigns.js';
import {
    COMPARE_BUCKETS,
    COMPARE_GROUPS,
    bucketLabel,
    bucketRanges,
    formatBucketRange,
    compareKpis,
    comparePeriodNames,
    compareState,
    defaultDates,
    defaultPair,
    pairBuckets
} from '../../utils/compare.js';
import { apiDate, formatCompactRange, formatShortRange } from '../../utils/dates.js';
import { salesPeriodRange } from '../../utils/salesPeriod.js';
import { useIsMobile } from '../../utils/useIsMobile.js';

const COMPARE_URL = DATABASE_TABLES.statistics.compare;
const NO_PICKS = { a: '', b: '' };
const PICK_MESSAGE = 'Elige los dos periodos para compararlos.';

const asPeriod = (item) => ({ id: String(item.id), name: item.name, from: item.start_date, to: item.end_date });

function datesPeriod(period, today) {
    const range = salesPeriodRange(period, today);
    if (!range) return null;
    return { id: '', name: formatShortRange(range.from, range.to), from: apiDate(range.from), to: apiDate(range.to) };
}

function Comparative({ title }) {
    const today = useMemo(() => startOfDay(new Date()), []);
    const isMobile = useIsMobile();
    const [mode, setMode] = useState('campaigns');
    const [picks, setPicks] = useState({ campaigns: NO_PICKS, seasons: NO_PICKS });
    const [dates, setDates] = useState(() => defaultDates(today));
    const [bucket, setBucket] = useState('week');
    const [group, setGroup] = useState('brand');

    const list = useFetch(mode === 'dates' ? null : DATABASE_TABLES[mode].endpoint);
    const started = useMemo(
        () => (list.data ?? []).filter((item) => item.start_date <= apiDate(today)),
        [list.data, today]
    );

    const { a, b } = useMemo(() => {
        if (mode === 'dates') return { a: datesPeriod(dates.a, today), b: datesPeriod(dates.b, today) };
        const fallback = defaultPair(started, today);
        const picked = picks[mode];
        const first = started.find((item) => String(item.id) === picked.a) ?? fallback.a;
        const second = started.find((item) => String(item.id) === picked.b) ?? (first ? previousEdition(started, first) : null);
        return { a: first ? asPeriod(first) : null, b: second ? asPeriod(second) : null };
    }, [mode, dates, picks, started, today]);

    const ready = Boolean(a && b);
    const request = useFetch(
        ready ? COMPARE_URL : null,
        ready ? { aFrom: a.from, aTo: a.to, bFrom: b.from, bTo: b.to } : undefined
    );
    const state = compareState({
        ready,
        data: request.loading || !request.settled ? null : request.data,
        error: request.error,
        listLoading: list.loading,
        listError: list.error
    });
    const names = ready ? comparePeriodNames(a, b) : null;

    const options = started.map((item) => ({
        value: String(item.id),
        label: item.name,
        range: formatCompactRange(parseISO(item.start_date), parseISO(item.end_date))
    }));

    const choose = (side, value) => {
        setPicks((prev) => ({
            ...prev,
            [mode]: side === 'a' ? { a: value, b: '' } : { ...prev[mode], b: value }
        }));
    };

    const changeDates = (side, next) => setDates((prev) => ({ ...prev, [side]: next }));

    const bucketNoun = COMPARE_BUCKETS.find((item) => item.value === bucket).noun;
    const groupLabel = COMPARE_GROUPS.find((item) => item.value === group).label.toLowerCase();

    const content = (() => {
        if (state.kind === 'pick') return <p className="compare-message panel-card m-0">{PICK_MESSAGE}</p>;
        if (state.kind === 'error') {
            return (
                <section className="panel-card">
                    <CardError onRetry={list.error ? list.refetch : request.refetch} />
                </section>
            );
        }
        if (state.kind === 'loading') return <CompareSkeleton />;

        const { a: periodA, b: periodB, breakdown } = request.data;
        const pairs = pairBuckets({ ...a, days: periodA.days }, { ...b, days: periodB.days }, bucket);
        const spansYears = [a, b].some((period) => period.from.slice(0, 4) !== period.to.slice(0, 4));
        const rangesA = bucketRanges(a.from, a.to, bucket);
        const rangesB = bucketRanges(b.from, b.to, bucket);
        const rows = pairs.map((pair, index) => ({
            ...pair,
            label: bucketLabel(pair.start, bucket, isMobile, spansYears),
            rangeA: formatBucketRange(rangesA[index]),
            rangeB: formatBucketRange(rangesB[index])
        }));

        return (
            <>
                <CompareKpis kpis={compareKpis(periodA.summary, periodB.summary)} shortB={names.shortB} isMobile={isMobile} />
                <div className="compare-main">
                    <section className="panel-card compare-card">
                        <div className="compare-card-head is-chart">
                            <h2 className="panel-card-title m-0 compare-head-title">Ventas por {bucketNoun}</h2>
                            <span className="compare-legend">
                                <span className="compare-legend-item">
                                    <span className="panel-dot is-a" aria-hidden="true" />
                                    {isMobile ? names.shortA : names.legendA}
                                </span>
                                <span className="compare-legend-item">
                                    <span className="panel-dot is-b" aria-hidden="true" />
                                    {isMobile ? names.shortB : names.legendB}
                                </span>
                            </span>
                            <Segs label="Mostrar por" options={COMPARE_BUCKETS} value={bucket} onChange={setBucket} />
                        </div>
                        <CompareChart
                            rows={rows}
                            height={isMobile ? 260 : 320}
                            label="Ventas de los dos periodos"
                        />
                    </section>
                    <section className="panel-card compare-card">
                        <div className="compare-card-head is-breakdown">
                            <h2 className="panel-card-title m-0 compare-head-title">Desglose</h2>
                            <span className="panel-muted compare-head-note">
                                {isMobile ? `Por ${groupLabel} · ${names.shortA} frente a ${names.shortB}` : `Por ${groupLabel}`}
                            </span>
                            <Segs label="Desglosar por" options={COMPARE_GROUPS} value={group} onChange={setGroup} />
                        </div>
                        <CompareBreakdown key={`${group}-${a.from}-${a.to}-${b.from}-${b.to}`} rows={breakdown[group]} group={group} names={names} isMobile={isMobile} />
                    </section>
                </div>
            </>
        );
    })();

    return (
        <div className="compare-page">
            <header className="panel-heading d-flex flex-column">
                <span className="panel-period">Dos periodos, uno al lado del otro</span>
                <h1 className="panel-title m-0">{title}</h1>
            </header>
            <ComparePeriods
                mode={mode}
                onModeChange={setMode}
                options={options}
                a={a?.id ?? ''}
                b={b?.id ?? ''}
                onChoose={choose}
                dates={dates}
                onDatesChange={changeDates}
            />
            {content}
        </div>
    );
}

function Segs({ label, options, value, onChange }) {
    return (
        <div className="panel-segs d-flex compare-segs" role="group" aria-label={label}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`panel-seg${value === option.value ? ' is-on' : ''}`}
                    aria-pressed={value === option.value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

function CompareSkeleton() {
    return (
        <>
            <div className="compare-kpis">
                {[0, 1, 2, 3].map((index) => (
                    <div className="compare-kpi" key={index}>
                        <Skeleton className="compare-skeleton-line" />
                        <Skeleton className="compare-skeleton-value" />
                    </div>
                ))}
            </div>
            <div className="compare-main">
                <section className="panel-card compare-card" aria-busy="true" aria-label="Cargando la comparativa">
                    <Skeleton className="compare-skeleton-line" />
                    <Skeleton className="is-chart" />
                </section>
                <section className="panel-card compare-card" aria-busy="true">
                    <Skeleton className="compare-skeleton-line" />
                    <Skeleton className="is-box" />
                </section>
            </div>
        </>
    );
}

export default Comparative;
