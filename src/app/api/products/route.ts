import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // 🔥 convertir Decimal → number
  const data = products.map((p:any) => ({
    ...p,
    price: Number(p.price),
  }));

  return NextResponse.json(data);
}