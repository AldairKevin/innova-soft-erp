import { prisma } from "@/lib/prisma";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Percent,     // Reemplaza a ReceiptPercent
  WalletCards  // Reemplaza a Wallet
} from "lucide-react";

export default async function ReportsPage() {
  // 1. Obtenemos datos reales de la base de datos
  const totalSalesCount = await prisma.sale.count();
  const allSales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    include: { details: true }
  });

  // 2. Cálculos financieros precisos
  const totalRevenue = allSales.reduce((acc, sale) => acc + sale.total, 0);
  
  // Cálculo de IGV (18%) y Neto en Perú
  // Neto = Total / 1.18 | IGV = Total - Neto
  const totalNet = totalRevenue / 1.18;
  const totalTax = totalRevenue - totalNet;

  // Tomamos solo las últimas 10 para la tabla
  const recentSales = allSales.slice(0, 10);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={28} /> 
          Panel de Reportes InnovaSoft
        </h1>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Actualizado en tiempo real
        </span>
      </div>

      {/* Cards de Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Ventas Totales</p>
              <p className="text-2xl font-black text-slate-800">{totalSalesCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Venta Bruta</p>
              <p className="text-2xl font-black text-green-600">S/ {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            {/* CORREGIDO: Usando Percent que sí existe en tu versión */}
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Percent size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">IGV (18%)</p>
              <p className="text-2xl font-black text-slate-800">S/ {totalTax.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            {/* CORREGIDO: Usando WalletCards que es más estable */}
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><WalletCards size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Ingreso Neto</p>
              <p className="text-2xl font-black text-slate-800">S/ {totalNet.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de últimas ventas mejorada */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Historial de Transacciones</h2>
          <button className="text-blue-600 text-xs font-bold hover:underline transition-all">Ver todo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 text-[10px] uppercase tracking-[0.15em] border-b">
              <tr>
                <th className="p-6">Referencia</th>
                <th className="p-6">Fecha y Hora</th>
                <th className="p-6">Productos</th>
                <th className="p-6 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="p-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-mono text-xs font-bold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      INV-{String(sale.id).padStart(5, '0')}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-slate-600 font-medium">
                    {new Date(sale.createdAt).toLocaleString('es-PE', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{sale.details.length} Items</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">POS InnovaSoft</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span className="text-lg font-black text-slate-900 leading-none">
                      S/ {sale.total.toFixed(2)}
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