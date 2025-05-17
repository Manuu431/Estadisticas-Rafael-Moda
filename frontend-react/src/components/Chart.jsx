import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
} from "recharts";



export default function Chart(props) {
  return (
    <ResponsiveContainer width="100%" height={props.height}>
      <BarChart data={props.data}>
        <XAxis dataKey="month" />
        <Tooltip />
        <Bar dataKey={props.dataKey} fill="#DD6C10" />
      </BarChart>
    </ResponsiveContainer>
  );
}