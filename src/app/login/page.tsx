"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MonitorSmartphone,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Credenciales inválidas");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* LEFT */}
        <div className="hidden lg:flex flex-1 flex-col justify-between border-r border-white/10 p-12">
          <div>
            {/* LOGO IZQUIERDO CORREGIDO */}
            <div className="relative w-[430px] h-[140px]">
              <Image
                src="/uploads/logo.png"
                alt="Innova Soft"
                fill
                priority
                unoptimized
                className="object-contain object-left"
              />
            </div>

            {/* HERO */}
            <div className="mt-16 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Plataforma moderna para negocios
              </div>

              <h1 className="mt-8 text-6xl font-black leading-tight tracking-tight">
                Controla tu empresa con estilo profesional.
              </h1>

              <p className="mt-8 text-lg leading-8 text-slate-400">
                Ventas, productos, reportes, inventario y tickets en una sola
                plataforma moderna.
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-5 max-w-xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
              <div className="flex items-center gap-3 mb-3">
                <MonitorSmartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold">Multi dispositivo</h3>
              </div>
              <p className="text-sm text-slate-400 leading-6">
                Compatible con escritorio, tablet y móviles.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">Seguridad avanzada</h3>
              </div>
              <p className="text-sm text-slate-400 leading-6">
                Protección mediante JWT y rutas privadas seguras.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full lg:w-[520px] items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl shadow-cyan-950/20">
            {/* LOGIN LOGO CORREGIDO */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[330px] h-[120px] mb-6">
                <Image
                  src="/uploads/logo.png"
                  alt="Logo"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />
              </div>

              <h2 className="text-4xl font-black tracking-tight">
                Bienvenido
              </h2>

              <p className="mt-3 text-slate-400 leading-7">
                Inicia sesión para acceder al panel administrativo.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm text-slate-300 font-medium">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@innovasoft.com"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-12 pr-4 text-white outline-none transition-all focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm text-slate-300 font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-4 h-5 w-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-12 pr-14 text-white outline-none transition-all focus:border-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-500 font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? (
                  "Ingresando..."
                ) : (
                  <>
                    Acceder al sistema
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
              Innova Soft ERP © 2026
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}