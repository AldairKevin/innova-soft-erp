import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customer.findMany();

  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        document: body.document,
        address: body.address,
      },
    });

    return NextResponse.json(customer);

  } catch (error) {
    return NextResponse.json(
      { error: "Error creando cliente" },
      { status: 500 }
    );
  }
}