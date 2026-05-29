import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//
// GET INVOICES
//
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("GET invoices error:", error);

    return NextResponse.json(
      { error: "Error obteniendo facturas" },
      { status: 500 }
    );
  }
}

//
// CREATE INVOICE
//
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customerId = Number(body.customerId);
    const total = parseFloat(body.total);

    if (!customerId || isNaN(customerId)) {
      return NextResponse.json(
        { error: "customerId inválido" },
        { status: 400 }
      );
    }

    if (!total || isNaN(total)) {
      return NextResponse.json(
        { error: "total inválido" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.create({
      data: {
        customerId,
        total,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("POST invoice error:", error);

    return NextResponse.json(
      { error: "Error creando factura" },
      { status: 500 }
    );
  }
}