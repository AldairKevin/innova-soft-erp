"use client";

import { useEffect, useState } from "react";

interface Invoice {
  id: number;
  total: number;
  status: string;
  createdAt: string;

  customer: {
    name: string;
    document: string;
  };
}

export default function InvoicesTable() {

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  //
  // OBTENER FACTURAS
  //

  async function fetchInvoices() {

    const res = await fetch("/api/invoices");

    const data = await res.json();

    setInvoices(data);
  }

  //
  // EMITIR FACTURA
  //

  async function emitInvoice(id: number) {

    await fetch("/api/sunat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        invoiceId: id,
      }),
    });

    //
    // RECARGAR
    //

    fetchInvoices();
  }

  //
  // LOAD
  //

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold text-white">
          Facturas
        </h2>

        <span className="text-sm text-slate-400">
          Total: {invoices.length}
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-slate-400">

              <th className="text-left py-4">
                Cliente
              </th>

              <th className="text-left py-4">
                Documento
              </th>

              <th className="text-left py-4">
                Total
              </th>

              <th className="text-left py-4">
                Fecha
              </th>

              <th className="text-left py-4">
                Estado
              </th>

              <th className="text-left py-4">
                Emitir
              </th>

              <th className="text-left py-4">
                PDF
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >

                <td className="py-4 text-white">
                  {invoice.customer.name}
                </td>

                <td className="py-4 text-slate-300">
                  {invoice.customer.document}
                </td>

                <td className="py-4 text-slate-300">
                  S/ {invoice.total}
                </td>

                <td className="py-4 text-slate-300">
                  {new Date(invoice.createdAt)
                    .toLocaleDateString("es-PE")}
                </td>

                <td className="py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === "ACEPTADO"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {invoice.status}
                  </span>

                </td>

                <td className="py-4">

                  <button
                    onClick={() => emitInvoice(invoice.id)}

                    disabled={
                      invoice.status === "ACEPTADO"
                    }

                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      invoice.status === "ACEPTADO"
                        ? "bg-green-600 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >

                    {invoice.status === "ACEPTADO"
                      ? "Emitido"
                      : "Emitir"}

                  </button>

                </td>

                <td className="py-4">

                  <a
                    href={`/api/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm text-white transition"
                  >
                    PDF
                  </a>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}