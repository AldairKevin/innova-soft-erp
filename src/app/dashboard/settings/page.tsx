"use client";

import { useEffect, useState } from "react";

import {
  Building2,
  ShieldCheck,
  Database,
  Moon,
  Save,
} from "lucide-react";

type SettingsType = {
  primaryColor: string;
  darkMode: boolean;
  notifications: boolean;
  currency: string;
  igv: number;
  facturaSerie: string;
  boletaSerie: string;
};

type BusinessType = {
  name: string;
  ruc: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
};

export default function SettingsPage() {
  //
  // SETTINGS
  //

  const [settings, setSettings] = useState<SettingsType>({
    primaryColor: "#2563eb",
    darkMode: false,
    notifications: true,
    currency: "PEN",
    igv: 18,
    facturaSerie: "F001",
    boletaSerie: "B001",
  });

  //
  // BUSINESS
  //

  const [business, setBusiness] =
    useState<BusinessType>({
      name: "",
      ruc: "",
      address: "",
      phone: "",
      email: "",
      logo: "",
    });

  //
  // STATES
  //

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  //
  // FETCH DATA
  //

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, businessRes] =
        await Promise.all([
          fetch("/api/settings"),
          fetch("/api/business"),
        ]);

      const settingsData =
        await settingsRes.json();

      const businessData =
        await businessRes.json();

      setSettings(settingsData);

      setBusiness({
        name: businessData?.name || "",
        ruc: businessData?.ruc || "",
        address:
          businessData?.address || "",
        phone: businessData?.phone || "",
        email: businessData?.email || "",
        logo: businessData?.logo || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //
  // SAVE
  //

  const saveSettings = async () => {
    try {
      setSaving(true);

      //
      // SETTINGS
      //

      await fetch("/api/settings", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(settings),
      });

      //
      // BUSINESS
      //

      await fetch("/api/business", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(business),
      });

      alert("Configuración actualizada");
    } catch (error) {
      console.error(error);

      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  //
  // LOADING
  //

  if (loading) {
    return (
      <div className="text-white">
        Cargando configuración...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Configuración
        </h1>

        <p className="text-gray-400 mt-1">
          Administra las preferencias del
          sistema.
        </p>
      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* EMPRESA */}

        <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/10 p-3 rounded-xl">
              <Building2
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg">
                Empresa
              </h2>

              <p className="text-gray-400 text-sm">
                Información del negocio
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre empresa"
              value={business.name || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  name: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              placeholder="RUC"
              value={business.ruc || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  ruc: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              placeholder="Dirección"
              value={business.address || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  address: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={business.phone || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  phone: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="email"
              placeholder="Correo"
              value={business.email || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  email: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              placeholder="Logo URL"
              value={business.logo || ""}
              onChange={(e) =>
                setBusiness({
                  ...business,
                  logo: e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        {/* PREFERENCIAS */}

        <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-violet-500/10 p-3 rounded-xl">
              <Moon
                className="text-violet-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg">
                Preferencias
              </h2>

              <p className="text-gray-400 text-sm">
                Personaliza el sistema
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* DARK MODE */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Modo oscuro
                </p>

                <p className="text-gray-400 text-sm">
                  Activar tema oscuro
                </p>
              </div>

              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    darkMode:
                      !settings.darkMode,
                  })
                }
                className={`w-14 h-8 rounded-full relative transition ${
                  settings.darkMode
                    ? "bg-cyan-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute top-1 transition ${
                    settings.darkMode
                      ? "right-1"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* NOTIFICACIONES */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  Notificaciones
                </p>

                <p className="text-gray-400 text-sm">
                  Alertas del sistema
                </p>
              </div>

              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications:
                      !settings.notifications,
                  })
                }
                className={`w-14 h-8 rounded-full relative transition ${
                  settings.notifications
                    ? "bg-cyan-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute top-1 transition ${
                    settings.notifications
                      ? "right-1"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* MONEDA */}

            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Moneda
              </label>

              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    currency:
                      e.target.value,
                  })
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
              >
                <option value="PEN">
                  Soles (PEN)
                </option>

                <option value="USD">
                  Dólares (USD)
                </option>
              </select>
            </div>

            {/* IGV */}

            <div>
              <label className="text-sm text-gray-400 block mb-2">
                IGV %
              </label>

              <input
                type="number"
                value={settings.igv}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    igv: Number(
                      e.target.value
                    ),
                  })
                }
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* COMPROBANTES */}

        <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-500/10 p-3 rounded-xl">
              <ShieldCheck
                className="text-emerald-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg">
                Comprobantes
              </h2>

              <p className="text-gray-400 text-sm">
                Series del sistema
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Serie factura"
              value={
                settings.facturaSerie
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  facturaSerie:
                    e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />

            <input
              type="text"
              placeholder="Serie boleta"
              value={
                settings.boletaSerie
              }
              onChange={(e) =>
                setSettings({
                  ...settings,
                  boletaSerie:
                    e.target.value,
                })
              }
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
            />
          </div>
        </div>

        {/* SISTEMA */}

        <div className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500/10 p-3 rounded-xl">
              <Database
                className="text-orange-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg">
                Sistema
              </h2>

              <p className="text-gray-400 text-sm">
                Estado del servidor
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">
                Backend
              </span>

              <span className="text-emerald-400 font-medium">
                Online
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                PostgreSQL
              </span>

              <span className="text-emerald-400 font-medium">
                Conectado
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Versión
              </span>

              <span className="text-white font-medium">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN */}

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 transition px-6 py-3 rounded-xl text-white font-semibold"
        >
          <Save size={18} />

          {saving
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}