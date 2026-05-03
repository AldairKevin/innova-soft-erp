import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sales = await prisma.sale.findMany({
    include: {
      details: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(sales);
}