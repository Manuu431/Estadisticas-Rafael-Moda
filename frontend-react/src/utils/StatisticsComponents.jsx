import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend
} from "recharts";

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
  '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
];

/**
 * CUSTOM CHART
*/
export function CustomStackedBarChart({ data, showBy, maxY }) {
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

/**
 * EXPENSES
 */

export function ExpensesChart({ data }) {
    console.log("DATA", data);
    return (
        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 10, bottom: 60 }}>
                <XAxis dataKey="name" tick={{ dy: 10 }} angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" stackId="a" fill="#ff0000" name="Gastos" />
                <Bar dataKey="revenue" stackId="a" fill="#008000" name="Ingresos" />
            </BarChart>
        </ResponsiveContainer>
    );
}