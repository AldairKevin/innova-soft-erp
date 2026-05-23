"use client";

import { useEffect, useState } from "react";

export default function CompanyForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    ruc: "",
    phone: "",
    email: "",
    address: "",
  });

  // CARGAR DATOS
  useEffect(() => {
    async function fetchBusiness() {
      try {
        const res = await fetch("/api/business");

        const data = await res.json();

        setForm({
          name: data.name || "",
          ruc: data.ruc || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBusiness();
  }, []);

  // MANEJAR INPUTS
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // GUARDAR
  async function handleSubmit() {
    try {
      setLoading(true);

      const res = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error al guardar");
      }

      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error(error);

      alert("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0f172a] border border-cyan-500/20 rounded-3xl p-6 shadow-xl">

      <h2 className="text-2xl font-bold text-white mb-6">
        Información de Empresa
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre empresa"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
        />

        <input
          type="text"
          name="ruc"
          value={form.ruc}
          onChange={handleChange}
          placeholder="RUC"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3 outline-none focus:border-cyan-400"
        />

      </div>

      <textarea
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Dirección"
        className="bg-[#111827] border border-gray-700 text-white rounded-xl p-3 outline-none focus:border-cyan-400 w-full mt-4 min-h-[120px]"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-5 bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>

    </div>
  );
}