"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  RefreshCcw,
  ReceiptText,
  AlertCircle,
} from "lucide-react";

export default function ReportsPage() {

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CARGAR VENTAS
  const loadSales = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await fetch("/api/sales", {
        cache: "no-store",
      });

      // VALIDAR RESPUESTA
      if (!res.ok) {

        throw new Error("No se pudieron cargar las ventas");

      }

      const data = await res.json();

      setSales(Array.isArray(data) ? data : []);

    } catch (err: any) {

      console.error(err);

      setError(err.message || "Ocurrió un error");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // INGRESOS TOTALES
  const totalRevenue = sales.reduce(
    (acc, sale) => acc + Number(sale.total || 0),
    0
  );

  // TOTAL VENTAS
  const totalSales = sales.length;

  // PRODUCTOS VENDIDOS
  const totalProductsSold = sales.reduce((acc, sale) => {

    const totalItems = (sale.details || []).reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    );

    return acc + totalItems;

  }, 0);

  // TICKET PROMEDIO
  const averageSale =
    totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col gap-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>

          <h1 className="text-4xl font-black text-slate-800">
            Reporte Empresarial
          </h1>

          <p className="text-slate-500 mt-1 font-medium">
            Panel profesional de ventas y rendimiento comercial
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadSales}
            className="bg-white border shadow-sm rounded-2xl p-3 hover:bg-slate-100 transition"
          >

            <RefreshCcw
              size={20}
              className={loading ? "animate-spin text-blue-600" : "text-blue-600"}
            />

          </button>

          <Link
            href="/dashboard"
            className="bg-white border shadow-sm px-5 py-3 rounded-2xl font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-100 transition"
          >

            <ArrowLeft size={18} />

            Regresar

          </Link>

        </div>
      </div>

      {/* ERROR */}
      {error && (

        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3">

          <AlertCircle size={20} />

          <span className="font-semibold">
            {error}
          </span>

        </div>

      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* INGRESOS */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                Ingresos Totales
              </p>

              <h2 className="text-4xl font-black text-emerald-600 mt-2">
                S/ {totalRevenue.toFixed(2)}
              </h2>

            </div>

            <div className="bg-emerald-100 p-4 rounded-2xl">

              <DollarSign
                className="text-emerald-600"
                size={30}
              />

            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">

            <TrendingUp size={16} />

            Rendimiento positivo

          </div>

        </div>

        {/* VENTAS */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                Ventas Registradas
              </p>

              <h2 className="text-4xl font-black text-blue-700 mt-2">
                {totalSales}
              </h2>

            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">

              <ShoppingCart
                className="text-blue-700"
                size={30}
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-medium">
            Operaciones realizadas
          </p>

        </div>

        {/* PRODUCTOS */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                Productos Vendidos
              </p>

              <h2 className="text-4xl font-black text-purple-700 mt-2">
                {totalProductsSold}
              </h2>

            </div>

            <div className="bg-purple-100 p-4 rounded-2xl">

              <Package
                className="text-purple-700"
                size={30}
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-medium">
            Unidades despachadas
          </p>

        </div>

        {/* PROMEDIO */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                Ticket Promedio
              </p>

              <h2 className="text-4xl font-black text-orange-600 mt-2">
                S/ {averageSale.toFixed(2)}
              </h2>

            </div>

            <div className="bg-orange-100 p-4 rounded-2xl">

              <ReceiptText
                className="text-orange-600"
                size={30}
              />

            </div>

          </div>

          <p className="text-sm text-slate-500 font-medium">
            Promedio por cliente
          </p>

        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b flex items-center justify-between">

          <div>

            <h2 className="text-xl font-black text-slate-800">
              Historial de Ventas
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Seguimiento detallado de operaciones comerciales
            </p>

          </div>

          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm">
            {sales.length} registros
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-5 text-left text-xs uppercase tracking-widest text-slate-400 font-black">
                  Cliente
                </th>

                <th className="p-5 text-center text-xs uppercase tracking-widest text-slate-400 font-black">
                  Productos
                </th>

                <th className="p-5 text-center text-xs uppercase tracking-widest text-slate-400 font-black">
                  Fecha
                </th>

                <th className="p-5 text-right text-xs uppercase tracking-widest text-slate-400 font-black">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {sales.length > 0 ? (

                sales.map((sale) => (

                  <tr
                    key={sale.id}
                    className="border-t hover:bg-slate-50 transition"
                  >

                    <td className="p-5">

                      <div>

                        <p className="font-bold text-slate-800">
                          {sale.customerName || "Cliente General"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Venta #{sale.id}
                        </p>

                      </div>

                    </td>

                    <td className="p-5 text-center font-semibold text-slate-600">

                      {(sale.details || []).reduce(
                        (acc: number, item: any) =>
                          acc + Number(item.quantity || 0),
                        0
                      )}

                    </td>

                    <td className="p-5 text-center text-slate-500 font-medium">

                      {new Date(sale.createdAt).toLocaleDateString()}

                    </td>

                    <td className="p-5 text-right font-black text-emerald-600 text-lg">

                      S/ {Number(sale.total || 0).toFixed(2)}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={4}
                    className="text-center p-10 text-slate-400 font-medium"
                  >

                    No hay ventas registradas

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}