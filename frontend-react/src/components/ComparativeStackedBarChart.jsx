import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export function ComparativeStackedBarChart({ data, showBy, groupBy }) {
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
  ];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} margin={{ top: 10, bottom: 60 }}>
        <XAxis dataKey={groupBy} tick={{ dy: 10 }} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        {[showBy].map((item, i) => (
          <Bar
            key={item}
            dataKey={item}
            stackId="a"
            fill={COLORS[i % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}