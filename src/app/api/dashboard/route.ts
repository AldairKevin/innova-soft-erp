import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("📊 Dashboard API ejecutándose...");

    const [invoiceCount, totalInvoiced] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: { total: true },
      }),
    ]);

    console.log("✔ DATA:", { invoiceCount, totalInvoiced });

    return NextResponse.json({
      totalSales: Number(totalInvoiced._sum.total ?? 0),
      invoiceCount,
    });

  } catch (error) {
    console.error("💥 ERROR REAL EN DASHBOARD API:", error);

    return NextResponse.json(
      {
        error: "Dashboard API crash",
        details: String(error),
      },
      { status: 500 }
    );
  }
}