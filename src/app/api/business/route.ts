import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

//
// GET BUSINESS
//

export async function GET() {
  try {
    const business = await prisma.business.findFirst();

    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error obteniendo negocio",
      },
      {
        status: 500,
      }
    );
  }
}

//
// UPDATE BUSINESS
//

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.business.update({
      where: {
        id: 1,
      },

      data: {
        name: body.name,
        ruc: body.ruc,
        address: body.address,
        phone: body.phone,
        email: body.email,
        logo: body.logo,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error actualizando negocio",
      },
      {
        status: 500,
      }
    );
  }
}