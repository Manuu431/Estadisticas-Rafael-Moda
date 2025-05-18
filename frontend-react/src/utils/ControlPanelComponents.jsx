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

export function StackedBarChart({ data, brands }) {
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
  ];

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

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
];

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

function renderCustomizedLabel(props) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const color = COLORS[index % COLORS.length];
  const lineHeight = 25;

  const maxLineLength = 10;
  const lines = name.length > maxLineLength
      ? [name.slice(0, maxLineLength), name.slice(maxLineLength)]
      : [name];

  const totalHeight = lineHeight * (lines.length + 1);

  return (
      <text
          x={x}
          y={y}
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={20}
          fontWeight={500}
      >
          {lines.map((line, i) => (
              <tspan
                  key={i}
                  x={x}
                  dy={i === 0 ? -totalHeight / 2 + lineHeight / 2 : lineHeight}
              >
              {line}
              </tspan>
          ))}
          <tspan x={x} dy={lineHeight}>{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
  );
}

export function PieChart({ data }) {
  return (
    <div className="d-flex align-items-center">
      <ResponsiveContainer width="60%" height={500}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
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

export function Select({ selectedMonth, setSelectedMonth }) {
    const options = getOptions();

    return (
        <select
            className="form-select form-select-lg border border-2 border-dark color-dark-gray"
            value={selectedMonth.toISOString()}
            onChange={e => setSelectedMonth(startOfMonth(new Date(e.target.value)))}
        >
            {options.map(date => (
                <option key={date.toISOString()} value={date.toISOString()}>
                    {format(date, "MMMM yyyy", { locale: es })}
                </option>
            ))}
        </select>
    );
}