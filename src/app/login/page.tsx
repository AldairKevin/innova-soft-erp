"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LockKeyhole,
  Mail,
  Rocket,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import { login } from "../actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(
        email,
        password
      );

      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(
          response.error ||
            "Error al iniciar sesión"
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Error interno del servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white flex items-center justify-center px-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0">

        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-500/20 blur-3xl rounded-full" />

      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">

        <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl shadow-black/40">

          {/* HEADER */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
              <Rocket size={36} />
            </div>

            <h1 className="text-4xl font-black tracking-tight">
              InnovaSoft
            </h1>

            <p className="text-slate-400 mt-2">
              Sistema Empresarial Profesional
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div className="space-y-2">

              <label className="text-sm text-slate-400">
                Correo electrónico
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#0F172A]/80 py-4 pl-12 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="space-y-2">

              <label className="text-sm text-slate-400">
                Contraseña
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#0F172A]/80 py-4 pl-12 pr-14 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 font-bold transition-all hover:scale-[1.01] disabled:opacity-60"
            >

              <span className="flex items-center justify-center gap-2">

                <ShieldCheck size={18} />

                {loading
                  ? "Ingresando..."
                  : "Ingresar al sistema"}

              </span>

            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-8 border-t border-white/5 pt-5 text-center">

            <p className="text-xs text-slate-500">
              © 2026 InnovaSoft ERP
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}