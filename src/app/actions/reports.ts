"use server";

import { prisma } from "@/lib/prisma";

export async function getSalesSummary() {
  try {
    // 1. Traer ventas con detalles
    const sales = await prisma.sale.findMany({
      include: { details: true },
    });

    if (sales.length === 0) {
      return {
        totalRevenue: 0,
        todayRevenue: 0,
        topProducts: [],
      };
    }

    // 2. Total de ingresos
    const totalRevenue = sales.reduce(
      (acc, s) => acc + Number(s.total),
      0
    );

    // 3. Agrupar ventas por producto (USAMOS number correctamente)
    const mapping: Record<number, number> = {};

    sales.forEach((sale) => {
      sale.details.forEach((d) => {
        const productId = d.productId;
        mapping[productId] = (mapping[productId] || 0) + d.quantity;
      });
    });

    // 4. Traer productos
    const products = await prisma.product.findMany();

    // 🔥 OPTIMIZACIÓN: Map en vez de find()
    const productMap = new Map(products.map((p) => [p.id, p]));

    // 5. Construir top productos
    const topProducts = Object.entries(mapping)
      .map(([id, qty]) => {
        const numericId = Number(id);
        const product = productMap.get(numericId);

        return {
          name: product ? product.name : `Producto ID: ${id}`,
          quantity: qty,
        };
      })
      .sort((a, b) => b.quantity - a.quantity);

    return {
      totalRevenue,
      todayRevenue: totalRevenue, // temporal (puedes mejorar luego por fecha)
      topProducts,
    };
  } catch (error) {
    console.error("Error en reporte:", error);

    return {
      totalRevenue: 0,
      todayRevenue: 0,
      topProducts: [],
    };
  }
}