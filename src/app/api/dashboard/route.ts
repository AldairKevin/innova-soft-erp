import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);

  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: last7Days,
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  const grouped: Record<string, number> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const key = d.toLocaleDateString("sv-SE");
    grouped[key] = 0;
  }

  sales.forEach((sale: any) => {
    const key = new Date(sale.createdAt).toLocaleDateString("sv-SE");
    grouped[key] += Number(sale.total || 0);
  });

  const chart = Object.entries(grouped).map(([date, total]) => ({
    date,
    total,
  }));

  const productos = await prisma.product.count();
  const usuarios = await prisma.user.count();

  const stock = await prisma.product.aggregate({
    _sum: { stock: true },
  });

  const totalVentas = await prisma.sale.aggregate({
    _sum: { total: true },
  });

  return NextResponse.json({
    productos,
    usuarios,
    stock: stock._sum.stock || 0,
    ventas: totalVentas._sum.total || 0,
    hoy: chart[chart.length - 1]?.total || 0,
    chart,
  });
}