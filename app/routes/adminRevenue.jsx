import { useLoaderData, useNavigate } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getOrders } from "../models/order";

function getLastNDates(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export async function loader() {
  const results = await getOrders(); // fetch orders from DB

  const last30Days = getLastNDates(30);

  // Initialize revenue map
  const revenueMap = {};
  last30Days.forEach((date) => (revenueMap[date] = 0));

  // Aggregate revenue per day
  results.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    if (revenueMap[date] !== undefined) {
      revenueMap[date] += order.totalPrice || 0; // use totalPrice directly
    }
  });

  // Convert to array for chart
  const revenueData = Object.entries(revenueMap).map(([date, amount]) => ({
    date,
    amount,
  }));

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
  const averageRevenue = revenueData.length
    ? totalRevenue / revenueData.length
    : 0;
  const maxRevenue = Math.max(...revenueData.map((r) => r.amount), 0);

  return { revenueData, totalRevenue, averageRevenue, maxRevenue };
}

export default function RevenuePage() {
  const { revenueData, totalRevenue, averageRevenue, maxRevenue } =
    useLoaderData();
  let navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-neutral-950 text-white mt-15">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-6 text-green-400">
          Revenue - Last 30 Days
        </h2>

        <button
          className="  border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-900 transition mb-10"
          onClick={() => navigate(-1)}
        >
          ← Back to dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg border border-green-700/40 text-center">
          <h3 className="text-green-400 font-semibold">Total Revenue</h3>
          <p className="text-xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg border border-green-700/40 text-center">
          <h3 className="text-green-400 font-semibold">Average Revenue</h3>
          <p className="text-xl font-bold mt-2">${averageRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg border border-green-700/40 text-center">
          <h3 className="text-green-400 font-semibold">Highest Revenue Day</h3>
          <p className="text-xl font-bold mt-2">${maxRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg border border-green-700/40">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={revenueData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="date" stroke="#a3f5a3" tick={{ fontSize: 12 }} />
            <YAxis stroke="#a3f5a3" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f1f1f", border: "none" }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#34d399"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
