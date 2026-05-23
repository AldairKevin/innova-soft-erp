"use client";

export default function SystemForm() {
  return (
    <div className="bg-[#0f172a] border border-cyan-500/20 rounded-3xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Configuración del Sistema
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="IGV"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3"
        />

        <select className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3">
          <option>PEN</option>
          <option>USD</option>
        </select>

        <input
          type="text"
          placeholder="Serie Factura"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Serie Boleta"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3"
        />
      </div>

      <button className="mt-5 bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl text-white font-semibold">
        Guardar configuración
      </button>
    </div>
  );
}