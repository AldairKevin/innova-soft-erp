import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//
// GET
//

export async function GET() {
  return NextResponse.json({
    message: "SUNAT API funcionando",
  });
}

//
// POST
//

export async function POST(req: Request) {
  try {
    const body = await req.json();

    //
    // BUSCAR FACTURA
    //

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: Number(body.invoiceId),
      },

      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Factura no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    //
    // SIMULACIÓN SUNAT
    //

    const sunatResponse = {
      success: true,
      sunat: "ACEPTADO",
      codigoHash: "ABC123XYZ",
    };

    //
    // ACTUALIZAR ESTADO
    //

    await prisma.invoice.update({
      where: {
        id: invoice.id,
      },

      data: {
        status: "ACEPTADO",
      },
    });

    //
    // RESPUESTA FINAL
    //

    return NextResponse.json({
      invoiceId: invoice.id,

      customer: invoice.customer.name,

      total: invoice.total,

      status: "ACEPTADO",

      sunat: sunatResponse,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Error SUNAT",
      },
      {
        status: 500,
      }
    );
  }
}