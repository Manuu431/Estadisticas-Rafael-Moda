import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { subMonths, startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { groupSalesByFieldForMonth } from './statisticsData';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
];

export function StackedBarChart({ data, brands }) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} margin={{ top: 10, bottom: 60, left: 10, right: 10 }}>
        <XAxis dataKey="month" tick={{ dy: 10 }} angle={-45} textAnchor="end" />
        <YAxis width={30} />
        <Tooltip />
        {brands.map((brand, index) => (
          <Bar
            key={brand}
            dataKey={brand}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomLegend({ payload }) {
  return (
    <ul className="list-unstyled m-0 ms-5">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 30,
            height: 30,
            backgroundColor: entry.color,
            borderRadius: '50%',
          }} />
          <span className="ms-4 fs-4">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function PieChart({ salesData, selectedMonth, groupBy }) {
    const data = groupSalesByFieldForMonth(salesData, selectedMonth, groupBy);

    return (
        <div className="d-flex align-items-center">
            <ResponsiveContainer width="60%" height={460}>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </RechartsPieChart>
            </ResponsiveContainer>

            <div>
                <CustomLegend payload={data.map((entry, index) => ({
                    value: entry.name,
                    color: COLORS[index % COLORS.length],
                }))} />
            </div>
        </div>
    );
}

export function getOptions () {
    const now = new Date();
    const options = [];

    for (let i = 11; i >= 0; i--) {
        const d = startOfMonth(subMonths(now, i));
        options.push(d);
    }

    return options;
}

export function GroupBySelector({ groupBy, setGroupBy }) {
  return (
    <select
      className="form-select form-select-lg border border-2 border-dark"
      value={groupBy}
      onChange={e => setGroupBy(e.target.value)}
    >
      <option value="family">Familia</option>
      <option value="brand">Marca</option>
      <option value="color">Color</option>
      <option value="size">Talla</option>
    </select>
  );
}

function getFormatDate(date) {
    let formatted = format(date, "MMMM yyyy", { locale: es });
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted;
}

export function Select({ selectedMonth, setSelectedMonth }) {
    const options = getOptions();

    return (
        <select
            className="form-select form-select-lg border border-2 border-dark"
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

import { useNavigate } from 'react-router-dom';

function formatDate(dateString) {
    const date = new Date(dateString);
    const formatted = format(date, "d MMM yyyy", { locale: es });

    return formatted.replace(/(\d+)\s(\p{L}+)(\s\d{4})/, (_, d, month, y) => {
        return `${d} ${month.charAt(0).toUpperCase() + month.slice(1)}${y}`;
    });
}

export function Campaigns({ data, startIndex = 0 }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visible = [...data]
        .filter(campaign => new Date(campaign.start_date) >= today)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(startIndex, startIndex + 10);
    
    const navigate = useNavigate();
    const handleClick = (campaign) => {
        localStorage.setItem("temporalCampaign", JSON.stringify(campaign));
        navigate('/campañas');
    };

    return (
        <div className="d-flex flex-column gap-2">
            {visible.map((item, index) => (
                <div
                    key={index}
                    className="campaign-card p-3 border rounded shadow-sm d-flex justify-content-between align-items-center"
                    onClick={() => handleClick(item)}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="fs-5 fw-bold w-75">{item.name}</span>
                    <span className="fs-5 w-25">{formatDate(item.start_date)}</span>
                </div>
            ))}
        </div>
    );
}

/*/**
 * COMPARATIVE CHART
*/
export function ComparativeStackedBarChart({ data, showBy, maxY }) {
  const categoryKeys = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  ).filter(key => key !== showBy);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} margin={{ top: 10, bottom: 60 }}>
        <XAxis dataKey={showBy} tick={{ dy: 10 }} angle={-45} textAnchor="end" />
        <YAxis domain={[0, maxY]} />
        <Tooltip />
        {categoryKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}