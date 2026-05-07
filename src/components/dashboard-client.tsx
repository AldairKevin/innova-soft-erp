"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    productos: number;
    stock: number;
    ventas: number;
    hoy: number;
    usuarios: number;
    chart: { date: string; total: number }[];
  };
};

export default function DashboardClient({ data }: Props) {
  return (
    <div className="space-y-8">

      {/* 🔥 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <Card title="Productos" value={data.productos} />
        <Card title="Stock" value={data.stock} />
        <Card title="Ventas" value={`S/ ${data.ventas}`} />
        <Card title="Hoy" value={`S/ ${data.hoy}`} />
        <Card title="Usuarios" value={data.usuarios} />
      </div>

      {/* 📊 GRÁFICO REAL */}
      <div className="bg-slate-900 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Ventas (últimos 7 días)</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chart}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}