"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
import { useBusiness } from "@/hooks/useBusiness";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import LogoutButton from "./logout-button";

export default function Sidebar({
  user,
}: {
  user: User | null;
}) {
  const pathname = usePathname();

  const business = useBusiness();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "POS",
      href: "/dashboard/pos",
      icon: ShoppingCart,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "Inventario",
      href: "/dashboard/inventory",
      icon: Package,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "Reportes",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["ADMIN"],
    },
    {
      name: "Configuración",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ];

  return (
    <aside className="h-screen w-72 bg-[#0F172A] border-r border-white/5 text-white flex flex-col justify-between px-5 py-6 shrink-0">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">

          {/* LOGO ICON */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">

            {business?.logo ? (
              <img
                src={business.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Rocket size={24} />
            )}

          </div>

          {/* BUSINESS INFO */}
          <div className="overflow-hidden">

            <h1 className="text-2xl font-black tracking-tight truncate">
              {business?.name || "InnovaSoft"}
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise System
            </p>

          </div>

        </div>

        {/* USER CARD */}
        <div className="relative overflow-hidden mb-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">

          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 pointer-events-none" />

          <div className="relative flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0) ?? "U"}
            </div>

            <div className="flex-1 overflow-hidden">

              <h2 className="font-semibold truncate">
                {user?.name ?? "Usuario"}
              </h2>

              <p className="text-sm text-slate-400 truncate">
                {user?.email ?? "-"}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                <ShieldCheck size={12} />

                {user?.role ?? "SIN ROL"}
              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">

          {links.map((link) => {
            if (!user) return null;

            const role = user.role ?? "";

            if (!link.roles.includes(role)) return null;

            const isActive =
              pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >

                <div
                  className={`transition-transform duration-200 ${
                    isActive
                      ? "scale-110"
                      : "group-hover:scale-105"
                  }`}
                >
                  <link.icon size={20} />
                </div>

                <span className="font-medium">
                  {link.name}
                </span>

              </Link>
            );
          })}

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-4">

        {/* STATUS */}
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">

          <div className="flex items-center gap-2">

            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-sm text-emerald-400 font-medium">
              Sistema operativo
            </span>

          </div>

          <p className="text-xs text-slate-400 mt-2">
            Todos los servicios funcionando correctamente.
          </p>

        </div>

        {/* LOGOUT */}
        <LogoutButton />

      </div>
    </aside>
  );
}