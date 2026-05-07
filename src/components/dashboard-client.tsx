"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Package,
  Boxes,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

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

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <h1 className="text-4xl font-black text-white">
            Dashboard Empresarial
          </h1>

          <p className="text-slate-400 mt-2">
            Bienvenido al centro de control de InnovaSoft 🚀
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <TrendingUp size={28} />
            <div>
              <p className="text-sm text-white/80">
                Rendimiento General
              </p>

              <h2 className="text-2xl font-black text-white">
                +24%
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <Card
          title="Productos"
          value={data.productos}
          icon={<Package size={26} />}
        />

        <Card
          title="Stock Total"
          value={data.stock}
          icon={<Boxes size={26} />}
        />

        <Card
          title="Ventas Totales"
          value={`S/ ${data.ventas}`}
          icon={<DollarSign size={26} />}
        />

        <Card
          title="Ventas Hoy"
          value={`S/ ${data.hoy}`}
          icon={<ShoppingCart size={26} />}
        />

        <Card
          title="Usuarios"
          value={data.usuarios}
          icon={<Users size={26} />}
        />

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">

        {/* CHART */}
        <div className="2xl:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Ventas de los últimos 7 días
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Rendimiento financiero semanal
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-xl border border-emerald-500/20">
              <ArrowUpRight size={18} />
              +12.4%
            </div>

          </div>

          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data.chart}>

              <defs>
                <linearGradient
                  id="colorSales"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3B82F6"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#3B82F6"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="date"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
              />

              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  color: "#fff",
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorSales)"
                strokeWidth={4}
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* PERFORMANCE */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">

            <h2 className="text-xl font-bold mb-5">
              Estado del Sistema
            </h2>

            <div className="space-y-4">

              <StatusItem
                label="Servidor"
                value="Activo"
                color="bg-emerald-500"
              />

              <StatusItem
                label="Base de Datos"
                value="Conectada"
                color="bg-blue-500"
              />

              <StatusItem
                label="Ventas"
                value="Operativas"
                color="bg-purple-500"
              />

            </div>

          </div>

          {/* QUICK STATS */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-6 shadow-2xl">

            <p className="text-white/70 text-sm">
              Ingresos del Mes
            </p>

            <h2 className="text-5xl font-black mt-2 text-white">
              S/ {data.ventas}
            </h2>

            <p className="mt-4 text-white/80">
              El sistema mantiene un crecimiento
              constante esta semana.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl hover:border-blue-500/40 transition-all duration-300">

      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">

          <div className="bg-blue-500/10 text-blue-400 p-3 rounded-2xl">
            {icon}
          </div>

          <span className="text-emerald-400 text-sm font-semibold">
            +12%
          </span>

        </div>

        <p className="text-slate-400 text-sm mt-5">
          {title}
        </p>

        <h3 className="text-3xl font-black mt-2 text-white">
          {value}
        </h3>

      </div>

    </div>
  );
}

function StatusItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">

      <div className="flex items-center gap-3">

        <div className={`w-3 h-3 rounded-full ${color}`} />

        <span className="text-slate-300">
          {label}
        </span>

      </div>

      <span className="text-white font-semibold">
        {value}
      </span>

    </div>
  );
}