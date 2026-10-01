import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format, isToday, parseISO, startOfDay, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import PanelCard from '../../components/PanelCard.jsx';
import WeekSales from './cards/WeekSales.jsx';
import MonthSummary, { YearLegend } from './cards/MonthSummary.jsx';
import TopBrands from './cards/TopBrands.jsx';
import Campaigns from './cards/Campaigns.jsx';
import { PeriodFilter, SectionFilter } from './cards/Filters.jsx';
import { PERIOD_VALUES, SECTION_VALUES } from './cards/filterOptions.js';
import { DATABASE_TABLES } from '../../config/database.js';
import { useFetch } from '../../hooks/useFetch.js';
import { apiDate, formatLongRange, formatMonthTitle, lastFinishedMonth, lastSevenDays, periodRange, periodSubtitle, shiftYear, yearChartRange } from '../../utils/dates.js';

const STATISTICS = DATABASE_TABLES.statistics;
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

function lastSaleLabel(lastSale) {
    if (!lastSale) return 'Sin ventas todavía';
    const moment = parseISO(lastSale.replace(' ', 'T'));
    return isToday(moment) ? `Actualizado a las ${format(moment, 'HH:mm')}` : 'Sin ventas todavía';
}

function ControlPanel(props) {
    const [params, setParams] = useSearchParams();
    const section = SECTION_VALUES.includes(params.get('seccion')) ? params.get('seccion') : '';
    const period = PERIOD_VALUES.includes(params.get('periodo')) ? params.get('periodo') : 'hoy';
    const today = useMemo(() => startOfDay(new Date()), []);
    const week = useMemo(() => lastSevenDays(today), [today]);
    const month = useMemo(() => lastFinishedMonth(today), [today]);
    const chart = useMemo(() => yearChartRange(month, today), [month, today]);
    const brandRange = useMemo(() => periodRange(period, today), [period, today]);

    const setFilter = (key, value) => {
        const next = new URLSearchParams(params);
        if (value) next.set(key, value);
        else next.delete(key);
        setParams(next, { replace: true });
    };

    const query = (from, to, comparedFrom, comparedTo) => ({
        from: apiDate(from),
        to: apiDate(to),
        comparedFrom: apiDate(comparedFrom),
        comparedTo: apiDate(comparedTo),
        ...(section ? { section } : {})
    });

    const weekQuery = query(week.from, week.to, shiftYear(week.from), shiftYear(week.to));
    const weekSummary = useFetch(STATISTICS.summary, weekQuery);
    const weekDaily = useFetch(STATISTICS.daily, weekQuery);
    const monthSummary = useFetch(STATISTICS.summary, query(month.start, month.end, subYears(month.start, 1), subYears(month.end, 1)));
    const monthDaily = useFetch(STATISTICS.daily, query(chart.from, chart.to, subYears(chart.from, 1), subYears(chart.to, 1)));
    const brands = useFetch(STATISTICS.brands, { from: apiDate(brandRange.from), to: apiDate(brandRange.to), ...(section ? { section } : {}) });
    const campaigns = useFetch(DATABASE_TABLES.campaigns.endpoint, section ? { section } : undefined);

    const requests = [weekSummary, weekDaily, monthSummary, monthDaily, brands, campaigns];
    const refresh = (...sources) => () => sources.forEach((source) => source.refetch());

    return (
        <>
            <header className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
                <div className="d-flex flex-column gap-1">
                    <span className="panel-kicker">
                        {capitalize(format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }))} · {lastSaleLabel(weekSummary.data?.summary.lastSale)}
                    </span>
                    <h1 className="panel-title m-0">{props.title}</h1>
                </div>
                <div className="panel-head-tools d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="panel-icon-btn"
                        onClick={refresh(...requests)}
                        disabled={requests.some((request) => request.loading)}
                        aria-label="Actualizar los datos"
                    >
                        <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                    </button>
                    <SectionFilter section={section} setSection={(value) => setFilter('seccion', value)} />
                </div>
            </header>
            <div className="row g-4">
                <div className="col-12 col-xl-5">
                    <PanelCard title="Ventas de esta semana" action={<span className="panel-muted">{formatLongRange(week.from, week.to)}</span>}>
                        <WeekSales
                            summary={weekSummary.data}
                            daily={weekDaily.data}
                            from={week.from}
                            to={week.to}
                            showSplit={!section}
                            error={weekSummary.error || weekDaily.error}
                            onRetry={refresh(weekSummary, weekDaily)}
                        />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-7">
                    <PanelCard title={formatMonthTitle(month.start)} action={<YearLegend month={month} />}>
                        <MonthSummary
                            summary={monthSummary.data}
                            daily={monthDaily.data}
                            month={month}
                            chart={chart}
                            error={monthSummary.error || monthDaily.error}
                            onRetry={refresh(monthSummary, monthDaily)}
                        />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-7">
                    <PanelCard
                        title="Marca más vendida"
                        note={periodSubtitle(period, brandRange)}
                        action={<PeriodFilter period={period} setPeriod={(value) => setFilter('periodo', value)} />}
                    >
                        <TopBrands brands={brands.data} error={brands.error} onRetry={refresh(brands)} />
                    </PanelCard>
                </div>
                <div className="col-12 col-xl-5">
                    <PanelCard
                        title="Campañas"
                        action={<Link className="panel-link d-inline-flex align-items-center gap-1" to="/planificacion">Ver todas<i className="bi bi-chevron-right" aria-hidden="true" /></Link>}
                    >
                        <Campaigns campaigns={campaigns.data} today={today} section={section} error={campaigns.error} onRetry={refresh(campaigns)} />
                    </PanelCard>
                </div>
            </div>
        </>
    );
}

export default ControlPanel;
