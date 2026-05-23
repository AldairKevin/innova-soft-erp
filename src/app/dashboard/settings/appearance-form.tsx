"use client";

import { useState } from "react";

export default function AppearanceForm() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="bg-[#0f172a] border border-cyan-500/20 rounded-3xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Apariencia
      </h2>

      <div className="flex items-center justify-between bg-[#111827] p-4 rounded-2xl border border-gray-700">
        <div>
          <h3 className="text-white font-semibold">
            Modo Oscuro
          </h3>

          <p className="text-gray-400 text-sm">
            Cambia el tema del sistema
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-16 h-8 rounded-full transition relative ${
            darkMode
              ? "bg-cyan-500"
              : "bg-gray-600"
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
              darkMode
                ? "translate-x-9"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}