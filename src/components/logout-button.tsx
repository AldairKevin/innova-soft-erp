"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LogOut,
  Loader2,
} from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        group
        relative
        overflow-hidden
        w-full
        rounded-2xl
        border
        border-red-500/20
        bg-red-500/10
        px-5
        py-4
        transition-all
        duration-300
        hover:bg-red-500
        hover:border-red-500
        disabled:opacity-70
      "
    >

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <div className="relative flex items-center justify-center gap-3">

        {loading ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <LogOut
            size={18}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
        )}

        <span className="font-semibold tracking-wide">
          {loading
            ? "Cerrando sesión..."
            : "Cerrar sesión"}
        </span>

      </div>

    </button>
  );
}