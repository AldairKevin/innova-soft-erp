import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

//
// GET SETTINGS
//

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error obteniendo configuración",
      },
      {
        status: 500,
      }
    );
  }
}

//
// UPDATE SETTINGS
//

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.settings.update({
      where: {
        id: 1,
      },

      data: {
        primaryColor: body.primaryColor,
        darkMode: body.darkMode,
        notifications: body.notifications,
        currency: body.currency,
        igv: body.igv,
        facturaSerie: body.facturaSerie,
        boletaSerie: body.boletaSerie,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error actualizando configuración",
      },
      {
        status: 500,
      }
    );
  }
}