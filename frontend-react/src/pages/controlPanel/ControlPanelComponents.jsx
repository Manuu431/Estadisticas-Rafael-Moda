import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { subMonths, startOfMonth, format, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { groupSalesByFieldForMonth, summarizeBySection } from '../../utils/statisticsData';
import { SECTION_LABELS } from '../../config/labels.js';
import { GROUP_BY_OPTIONS } from '../../config/info.js';

const SERIES_COLORS = ['#DD6C10', '#1176A6', '#5E8C2A', '#4A3AA7', '#1E9E86', '#A3261B', '#B3308A'];
const REST_COLOR = '#8C8178';
const REST_LABEL = 'Otras';
const SURFACE = '#FFFFFF';
const GRID_COLOR = '#F2ECE5';
const AXIS_COLOR = '#756D66';

const seriesColor = (index) => SERIES_COLORS[index] ?? REST_COLOR;
const formatNumber = (value) => value.toLocaleString('es-ES');
const formatMoney = (cents) => `${(cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
const formatShare = (value, total) => `${(total > 0 ? (value / total) * 100 : 0).toLocaleString('es-ES', { maximumFractionDigits: 1 })} %`;
const barWidth = (value, total) => ({ width: `${total > 0 ? (value / total) * 100 : 0}%` });

function foldBrands(data, brands) {
  const totals = brands
    .map((brand) => ({ brand, total: data.reduce((sum, row) => sum + (row[brand] ?? 0), 0) }))
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total);
  const top = totals.slice(0, SERIES_COLORS.length).map((entry) => entry.brand);
  const rest = totals.slice(SERIES_COLORS.length).map((entry) => entry.brand);
  if (rest.length === 0) return { series: top, rows: data };
  const rows = data.map((row) => {
    const folded = { month: row.month, [REST_LABEL]: rest.reduce((sum, brand) => sum + (row[brand] ?? 0), 0) };
    top.forEach((brand) => { folded[brand] = row[brand] ?? 0; });
    return folded;
  });
  return { series: [...top, REST_LABEL], rows };
}

function foldSlices(data) {
  const sorted = [...data].filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, SERIES_COLORS.length);
  const rest = sorted.slice(SERIES_COLORS.length);
  if (rest.length === 0) return top;
  return [...top, { name: REST_LABEL, value: rest.reduce((sum, slice) => sum + slice.value, 0) }];
}

function ChartTooltip({ active, payload, label, title }) {
  if (!active || !payload?.length) return null;
  const rows = [...payload].filter((entry) => entry.value > 0).reverse();
  if (rows.length === 0) return null;

  return (
    <div className="panel-tooltip d-flex flex-column gap-2">
      <span className="fw-semibold">{label ?? title}</span>
      <div className="d-flex flex-column gap-1">
        {rows.map((entry) => (
          <span className="d-flex align-items-center gap-2" key={entry.name}>
            <span className="panel-swatch" style={{ backgroundColor: entry.color ?? entry.payload?.fill }} />
            <span className="flex-grow-1 pe-3">{entry.name}</span>
            <span className="fw-semibold">{formatNumber(entry.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ChartLegend({ items }) {
  return (
    <ul className="list-unstyled d-flex flex-wrap gap-3 m-0 pt-3">
      {items.map((item, index) => (
        <li className="d-flex align-items-center gap-2 panel-muted" key={item}>
          <span className="panel-swatch" style={{ backgroundColor: seriesColor(index) }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PanelCard({ title, note, action, children }) {
  return (
    <section className="panel-card h-100 d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <div className="d-flex flex-column">
          <h2 className="panel-card-title m-0">{title}</h2>
          {note ? <span className="panel-muted">{note}</span> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StackedBarChart({ data, brands }) {
  const { series, rows } = useMemo(() => foldBrands(data, brands), [data, brands]);

  return (
    <div className="d-flex flex-column">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis
            dataKey="month"
            interval={0}
            angle={-40}
            height={64}
            textAnchor="end"
            tickLine={false}
            axisLine={{ stroke: GRID_COLOR }}
            tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          />
          <YAxis width={44} tickLine={false} axisLine={false} tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
          <Tooltip cursor={{ fill: 'rgba(221, 108, 16, .06)' }} content={<ChartTooltip />} />
          {series.map((brand, index) => (
            <Bar
              key={brand}
              dataKey={brand}
              stackId="a"
              maxBarSize={24}
              fill={seriesColor(index)}
              stroke={SURFACE}
              strokeWidth={2}
              radius={index === series.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <ChartLegend items={series} />
    </div>
  );
}

export function PieChart({ salesData, selectedMonth, groupBy }) {
  const data = useMemo(
    () => foldSlices(groupSalesByFieldForMonth(salesData, selectedMonth, groupBy)),
    [salesData, selectedMonth, groupBy]
  );
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  if (total === 0) return <p className="panel-muted m-0">Todavía no hay ventas en este mes.</p>;

  return (
    <div className="row g-4 align-items-center">
      <div className="col-12 col-xxl-5">
        <ResponsiveContainer width="100%" height={260}>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="58%"
              outerRadius="100%"
              paddingAngle={2}
              stroke={SURFACE}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((slice, index) => (
                <Cell key={slice.name} fill={seriesColor(index)} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip title="Prendas vendidas" />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="col-12 col-xxl-7">
        <ol className="list-unstyled d-flex flex-column gap-3 m-0">
          {data.map((slice, index) => (
            <li className="panel-rank" key={slice.name}>
              <span className="panel-swatch" style={{ backgroundColor: seriesColor(index) }} />
              <span className="fw-medium text-truncate">{slice.name}</span>
              <span className="panel-track">
                <span
                  className={`panel-fill d-block${index === 0 ? '' : ' is-soft'}`}
                  style={barWidth(slice.value, data[0].value)}
                />
              </span>
              <span className="text-end">
                <span className="fw-semibold">{formatNumber(slice.value)}</span>
                <span className="panel-muted ms-2">{formatShare(slice.value, total)}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

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

export function SectionBreakdown({ sales }) {
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

export function MonthSummary({ sales }) {
  const summary = useMemo(() => summarizeBySection(sales ?? []), [sales]);

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column gap-2">
        <span className="panel-display">{formatMoney(summary.total.profitCents)}</span>
        <span className="panel-muted">Beneficio del mes seleccionado</span>
      </div>
      <div className="row g-3 panel-divider pt-4 mt-auto">
        <div className="col-6 d-flex flex-column gap-1">
          <span className="panel-muted">Prendas vendidas</span>
          <span className="panel-stat">{formatNumber(summary.total.units)}</span>
        </div>
        <div className="col-6 d-flex flex-column gap-1">
          <span className="panel-muted">Ventas</span>
          <span className="panel-stat">{formatNumber(summary.total.sales)}</span>
        </div>
      </div>
    </div>
  );
}

export function GroupBySelector({ groupBy, setGroupBy }) {
  return (
    <div className="panel-segs d-inline-flex flex-wrap" role="group" aria-label="Segmentar por">
      {GROUP_BY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`panel-seg text-capitalize${option.value === groupBy ? ' is-on' : ''}`}
          aria-pressed={option.value === groupBy}
          onClick={() => setGroupBy(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function getOptions() {
  const now = new Date();
  const options = [];

  for (let i = 11; i >= 0; i--) {
    options.push(startOfMonth(subMonths(now, i)));
  }

  return options;
}

function getFormatDate(date) {
  const formatted = format(date, "MMMM yyyy", { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function Select({ selectedMonth, setSelectedMonth }) {
  const options = getOptions();

  return (
    <select
      className="form-select panel-select"
      aria-label="Mes seleccionado"
      value={selectedMonth.toISOString()}
      onChange={e => setSelectedMonth(startOfMonth(new Date(e.target.value)))}
    >
      {options.map(date => (
        <option key={date.toISOString()} value={date.toISOString()}>
          {getFormatDate(date)}
        </option>
      ))}
    </select>
  );
}

function getRemaining(days) {
  if (days < 0) return 'pendiente';
  if (days === 0) return 'hoy';
  if (days === 1) return 'mañana';
  return `en ${days} días`;
}

export function UpcomingCampaigns({ data, startIndex = 0 }) {
  const isDesktop = window.innerWidth >= 992;
  const maxCampaigns = isDesktop ? 10 : 5;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 1);

  const visible = [...data]
    .filter(campaign => {
      const startDate = new Date(campaign.start_date);
      const inDateRange = startDate <= oneYearLater;
      const hasMissingFinancials = campaign.expenses == null || campaign.profits == null;
      return inDateRange && hasMissingFinancials;
    })
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(startIndex, startIndex + maxCampaigns);

  const navigate = useNavigate();
  const handleClick = (campaign) => {
    localStorage.setItem("temporalItem", JSON.stringify(campaign));
    navigate('/campañas');
  };

  if (visible.length === 0) return <p className="panel-muted m-0">No hay campañas pendientes.</p>;

  return (
    <div className="d-flex flex-column">
      {visible.map((item) => {
        const startDate = new Date(item.start_date);

        return (
          <div
            className="campaign-card d-flex align-items-center gap-3 py-3"
            key={item.id}
            onClick={() => handleClick(item)}
          >
            <span className="panel-date-chip d-flex flex-column align-items-center justify-content-center">
              <span className="fw-semibold lh-1">{format(startDate, 'd')}</span>
              <span className="panel-label mt-1">{format(startDate, 'MMM', { locale: es })}</span>
            </span>
            <span className="fw-semibold flex-grow-1 text-truncate">{item.name}</span>
            <span className="panel-muted text-nowrap">{getRemaining(differenceInCalendarDays(startDate, today))}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CampaignButtons({ currentIndex, setCurrentIndex, total }) {
  const isDesktop = window.innerWidth >= 992;
  const campaignNumber = isDesktop ? 10 : 5;
  total = isDesktop ? total : total - 5;

  const handleUp = () => {
    setCurrentIndex((prev) => Math.max(prev - campaignNumber, 0));
  };

  const handleDown = () => {
    setCurrentIndex((prev) => (prev + campaignNumber < total ? prev + campaignNumber : prev));
  };

  return (
    <div className="d-flex gap-1">
      <CampaignButton
        onClickFunction={handleUp}
        disabled={currentIndex === 0}
        title="Campañas anteriores"
        classIcon="bi bi-chevron-up"
      />
      <CampaignButton
        onClickFunction={handleDown}
        disabled={currentIndex + campaignNumber >= total}
        title="Campañas siguientes"
        classIcon="bi bi-chevron-down"
      />
    </div>
  );
}

function CampaignButton(props) {
  return (
    <button
      type="button"
      className="app-icon-btn d-flex align-items-center justify-content-center"
      onClick={props.onClickFunction}
      disabled={props.disabled}
      title={props.title}
      aria-label={props.title}
    >
      <i className={props.classIcon} aria-hidden="true" />
    </button>
  );
}