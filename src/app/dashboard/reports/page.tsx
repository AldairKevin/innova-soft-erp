"use client";

import { useEffect, useState } from "react";

import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  RefreshCcw,
  ReceiptText,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function ReportsPage() {

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //
  // CARGAR VENTAS
  //

  const loadSales = async () => {

    try {

      setLoading(true);

      setError("");

      const res = await fetch("/api/sales", {
        cache: "no-store",
      });

      if (!res.ok) {

        throw new Error(
          "No se pudieron cargar las ventas"
        );

      }

      const data = await res.json();

      setSales(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err: any) {

      console.error(err);

      setError(
        err.message ||
        "Ocurrió un error"
      );

    } finally {

      setLoading(false);

    }

  };

  //
  // LOAD
  //

  useEffect(() => {
    loadSales();
  }, []);

  //
  // KPIs
  //

  const totalRevenue = sales.reduce(
    (acc, sale) =>
      acc + Number(sale.total || 0),
    0
  );

  const totalSales = sales.length;

  const totalProductsSold = sales.reduce(
    (acc, sale) => {

      const totalItems = (
        sale.details || []
      ).reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          Number(
            item.quantity || 0
          ),
        0
      );

      return acc + totalItems;

    },
    0
  );

  const averageSale =
    totalSales > 0
      ? totalRevenue / totalSales
      : 0;

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-8 shadow-2xl">

        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 mb-6">

              <Sparkles size={16} />

              Analítica empresarial avanzada

            </div>

            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">

              Reportes &

              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">

                {" "}
                Estadísticas

              </span>

            </h1>

            <p className="text-slate-400 mt-4 text-lg max-w-2xl">

              Monitorea ventas,
              ingresos y rendimiento
              comercial en tiempo
              real.

            </p>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={loadSales}
              className="h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
            >

              <RefreshCcw
                size={20}
                className={`text-blue-400 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

            </button>

            <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/5 px-6 py-4">

              <div className="flex items-center gap-2">

                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-sm text-emerald-400 font-semibold">

                  Sistema operativo

                </span>

              </div>

              <p className="text-xs text-slate-400 mt-1">

                Datos sincronizados en vivo

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (

        <div className="rounded-3xl border border-red-500/10 bg-red-500/5 p-5 flex items-center gap-4 text-red-400">

          <AlertCircle size={22} />

          <span className="font-semibold">
            {error}
          </span>

        </div>

      )}

      {/* KPIs */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* INGRESOS */}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">

                  Ingresos

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  S/{" "}
                  {totalRevenue.toFixed(2)}

                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">

                <DollarSign
                  size={30}
                  className="text-emerald-400"
                />

              </div>

            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-sm text-emerald-400 font-semibold">

              <TrendingUp size={15} />

              Rendimiento positivo

            </div>

          </div>

        </div>

        {/* VENTAS */}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">

                  Ventas

                </p>

                <h2 className="text-5xl font-black text-white mt-4">

                  {totalSales}

                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center">

                <ShoppingCart
                  size={30}
                  className="text-blue-400"
                />

              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">

              Operaciones registradas

            </p>

          </div>

        </div>

        {/* PRODUCTOS */}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">

                  Productos

                </p>

                <h2 className="text-5xl font-black text-white mt-4">

                  {totalProductsSold}

                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-purple-500/10 flex items-center justify-center">

                <Package
                  size={30}
                  className="text-purple-400"
                />

              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">

              Productos vendidos

            </p>

          </div>

        </div>

        {/* TICKET */}

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">

          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[3px] text-slate-500 font-black">

                  Ticket Medio

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  S/{" "}
                  {averageSale.toFixed(2)}

                </h2>

              </div>

              <div className="h-16 w-16 rounded-3xl bg-orange-500/10 flex items-center justify-center">

                <ReceiptText
                  size={30}
                  className="text-orange-400"
                />

              </div>

            </div>

            <p className="text-slate-400 text-sm mt-6">

              Promedio por venta

            </p>

          </div>

        </div>

      </div>

      {/* ÚLTIMAS VENTAS */}

      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-black text-white">

              Últimas Ventas

            </h2>

            <p className="text-slate-400 text-sm mt-1">

              Movimientos recientes del sistema

            </p>

          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">

            <Activity size={16} />

            Tiempo real

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-white/10 text-slate-400">

                <th className="text-left py-4">
                  Cliente
                </th>

                <th className="text-left py-4">
                  Productos
                </th>

                <th className="text-left py-4">
                  Fecha
                </th>

                <th className="text-left py-4">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {sales.slice(0, 8).map((sale) => (

                <tr
                  key={sale.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >

                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <div className="h-11 w-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">

                        <ShieldCheck
                          size={18}
                          className="text-blue-400"
                        />

                      </div>

                      <div>

                        <p className="text-white font-semibold">

                          {sale.customerName}

                        </p>

                        <p className="text-xs text-slate-500">

                          Venta #{sale.id}

                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="py-5 text-slate-300">

                    {(sale.details || []).length} productos

                  </td>

                  <td className="py-5 text-slate-400">

                    {new Date(
                      sale.createdAt
                    ).toLocaleDateString("es-PE")}

                  </td>

                  <td className="py-5">

                    <span className="rounded-xl bg-emerald-500/10 px-4 py-2 text-emerald-400 font-bold">

                      S/{" "}
                      {Number(sale.total).toFixed(2)}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}