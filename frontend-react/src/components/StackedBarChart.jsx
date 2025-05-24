export function StackedBarChart({ data, brands, groupKey }) {
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#AA46BE', '#FF595E', '#1982C4', '#6A4C93'
  ];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data} margin={{ top: 10, bottom: 60 }}>
        <XAxis dataKey={groupKey} tick={{ dy: 10 }} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        {brands.map((brand, i) => (
          <Bar
            key={brand}
            dataKey={brand}
            stackId="a"
            fill={COLORS[i % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
