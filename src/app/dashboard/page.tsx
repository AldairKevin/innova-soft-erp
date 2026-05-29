import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard-client";
import InvoicesTable from "@/components/InvoicesTable";

export default async function DashboardPage() {
  // 1. Obtener token de cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 2. Validar autenticación
  if (!token) {
    redirect("/login");
  }

  try {
    // 3. Obtener datos de la base de datos
    const [invoiceCount, totalInvoiced] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: { total: true },
      }),
    ]);

    // 4. Mapear datos a la estructura que espera tu componente
    // Esto evita el error de propiedades faltantes
    const data = {
      totalSales: Number(totalInvoiced._sum.total ?? 0),
      invoiceCount: invoiceCount,
      productos: 0, // Ajusta si tienes lógica para esto
      stock: 0,     // Ajusta si tienes lógica para esto
      ventas: invoiceCount,
      hoy: 0,       // Puedes filtrar por fecha si lo necesitas
      usuarios: 0,
      chart: [],    // Datos para el gráfico
    };

    // 5. Renderizar
    return (
      <div className="p-6 space-y-6">
        <DashboardClient data={data} />
        <InvoicesTable />
      </div>
    );

  } catch (error) {
    console.error("💥 ERROR DASHBOARD:", error);

    // 6. Vista de error amigable
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-600 text-2xl font-bold mb-4">
          Error al cargar el Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Hubo un problema procesando la información.
        </p>
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Volver al Login
        </a>
      </div>
    );
  }
}