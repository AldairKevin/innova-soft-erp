import Link from "next/link";

import DashboardUser from "@/components/dashboard-user";

import {
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">

      {/* EFECTOS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">

        <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-500/20 blur-3xl rounded-full" />

      </div>

      <div className="relative z-10 p-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl mb-5">

              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />

              <span className="text-sm font-bold text-blue-300">
                Sistema Empresarial Activo
              </span>

            </div>

            <h1 className="text-5xl font-black tracking-tight">
              InnovaSoft 🚀
            </h1>

            <p className="text-slate-400 text-lg mt-3 max-w-2xl">
              Plataforma inteligente para gestión de ventas,
              inventario y análisis empresarial.
            </p>

          </div>

          <DashboardUser />

        </div>

        {/* MODULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {/* POS */}
          <Link
            href="/dashboard/pos"
            className="group bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">

                <ShoppingCart size={38} />

              </div>

              <h2 className="text-3xl font-black mb-3">
                POS
              </h2>

              <p className="text-blue-100 leading-relaxed">
                Sistema de ventas y caja.
              </p>

              <div className="mt-8 flex items-center gap-2 font-bold">

                Abrir módulo

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />

              </div>

            </div>

          </Link>

          {/* INVENTARIO */}
          <Link
            href="/dashboard/inventory"
            className="group bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2rem] p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">

                <Package size={38} />

              </div>

              <h2 className="text-3xl font-black mb-3">
                Inventario
              </h2>

              <p className="text-emerald-100 leading-relaxed">
                Gestión de stock y productos.
              </p>

              <div className="mt-8 flex items-center gap-2 font-bold">

                Abrir módulo

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />

              </div>

            </div>

          </Link>

          {/* REPORTES */}
          <Link
            href="/dashboard/reports"
            className="group bg-gradient-to-br from-purple-600 to-purple-800 rounded-[2rem] p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">

                <BarChart3 size={38} />

              </div>

              <h2 className="text-3xl font-black mb-3">
                Reportes
              </h2>

              <p className="text-purple-100 leading-relaxed">
                Estadísticas y análisis empresarial.
              </p>

              <div className="mt-8 flex items-center gap-2 font-bold">

                Abrir módulo

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />

              </div>

            </div>

          </Link>

          {/* CONFIG */}
          <Link
            href="/dashboard/settings"
            className="group bg-gradient-to-br from-slate-700 to-slate-900 rounded-[2rem] p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full" />

            <div className="relative z-10">

              <div className="bg-white/20 w-fit p-4 rounded-2xl mb-6">

                <Settings size={38} />

              </div>

              <h2 className="text-3xl font-black mb-3">
                Configuración
              </h2>

              <p className="text-slate-300 leading-relaxed">
                Ajustes generales del sistema.
              </p>

              <div className="mt-8 flex items-center gap-2 font-bold">

                Abrir módulo

                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />

              </div>

            </div>

          </Link>

        </div>

      </div>

    </div>

  );

}