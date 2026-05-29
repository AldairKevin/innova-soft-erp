"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Printer, Calendar, Receipt, DollarSign, Users } from "lucide-react";

type Sale = {
  id: number;
  customerName: string;
  total: number;
  createdAt: string;
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    try {
      const res = await fetch("/api/sales/history");
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const text = search.toLowerCase();
      return (
        sale.customerName?.toLowerCase().includes(text) ||
        sale.id.toString().includes(text)
      );
    });
  }, [sales, search]);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const todaySales = sales.filter((sale) => {
    const today = new Date().toLocaleDateString();
    return new Date(sale.createdAt).toLocaleDateString() === today;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h1 className="text-4xl font-black text-white">Historial de Ventas</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">Ventas</p>
            <h2 className="text-3xl font-black text-white mt-2">{sales.length}</h2>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl">
            <p className="text-slate-400 text-sm">Hoy</p>
            <h2 className="text-3xl font-black text-white mt-2">{todaySales.length}</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4 rounded-2xl shadow-xl">
            <p className="text-white/70 text-sm">Ingresos</p>
            <h2 className="text-3xl font-black text-white mt-2">S/ {totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-slate-400">
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Cliente</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-b border-slate-900">
                <td className="px-6 py-5 text-white">#{sale.id}</td>
                <td className="px-6 py-5 text-white">{sale.customerName}</td>
                <td className="px-6 py-5 flex justify-center">
                  <button
                    onClick={() => window.open(`/api/ticket?invoiceId=${sale.id}`, "_blank")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Printer size={16} /> Imprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}