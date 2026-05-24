"use server";

import { prisma } from "@/lib/prisma";

export async function getSalesSummary() {
  try {
    // 1. Traer ventas con sus detalles para calcular todo de una vez
    const sales = await prisma.sale.findMany({
      include: { details: true }
    });

    if (sales.length === 0) return { totalRevenue: 0, todayRevenue: 0, topProducts: [] };

    // 2. Suma total de dinero
    const total = sales.reduce((acc, s) => acc + Number(s.total), 0);

    // 3. Agrupar cantidades por ID de producto
    const mapping: Record<string, number> = {};
    sales.forEach(s => {
      s.details.forEach(d => {
        mapping[d.productId] = (mapping[d.productId] || 0) + d.quantity;
      });
    });

    // 4. Traer los nombres de los productos actuales
    const products = await prisma.product.findMany();

    const top = Object.entries(mapping).map(([id, qty]) => {
      const p = products.find(prod => prod.id === id);
      return {
        name: p ? p.name : `Producto ID: ${id}`, // Si no encuentra el nombre, pone el ID
        quantity: qty
      };
    }).sort((a, b) => b.quantity - a.quantity);

    return {
      totalRevenue: total,
      todayRevenue: total, // Temporalmente igual al total para confirmar que carga
      topProducts: top
    };
  } catch (error) {
    console.error("Error en reporte:", error);
    return { totalRevenue: 0, todayRevenue: 0, topProducts: [] };
  }
}