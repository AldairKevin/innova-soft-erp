"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";

import LogoutButton from "./logout-button";

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

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
    <aside className="h-screen w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shrink-0">
      
      {/* TOP */}
      <div>
        <h1 className="text-2xl font-bold mb-6">
          InnovaSoft 🚀
        </h1>

        {/* USER INFO */}
        <div className="mb-6 bg-white/10 p-3 rounded-xl text-sm">
          <p className="font-semibold">
            {user?.name ?? "Usuario"}
          </p>
          <p className="text-slate-400">
            {user?.email ?? "-"}
          </p>
          <p className="text-xs mt-1 text-blue-400">
            {user?.role ?? "SIN ROL"}
          </p>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          {links.map((link) => {
            // 🔥 FIX IMPORTANTE: evita que desaparezca todo
            if (!user) return null;

            const role = user.role ?? "";
            if (!link.roles.includes(role)) return null;

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <link.icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-4">
        <div className="bg-white/10 p-3 rounded-xl text-sm">
          Sistema activo
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}