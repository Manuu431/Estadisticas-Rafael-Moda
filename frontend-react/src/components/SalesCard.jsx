import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Card({ className = "", children }) {
  return (
    <div className={`bg-white rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

const data = [
  { month: "Jun", sales: 400 },
  { month: "Jul", sales: 460 },
  { month: "Ago", sales: 500 },
  { month: "Sep", sales: 480 },
  { month: "Oct", sales: 530 },
  { month: "Nov", sales: 600 },
  { month: "Dic", sales: 700 },
  { month: "Ene", sales: 750 },
  { month: "Feb", sales: 680 },
  { month: "Mar", sales: 720 },
  { month: "Abr", sales: 790 },
  { month: "May", sales: 850 },
];

export default function SalesCard() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">
          Ventas últimos 12 meses
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}