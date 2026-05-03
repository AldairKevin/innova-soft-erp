import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Asegura que no devuelva datos viejos

export async function GET() {
  const products = await prisma.product.findMany({

    orderBy: { name: 'asc' }
  });
  return NextResponse.json(products);
}