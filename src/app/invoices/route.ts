import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//
// GET FACTURAS
//

export async function GET() {

  try {

    const invoices = await prisma.invoice.findMany({

      include: {

        customer: true,

        items: {
          include: {
            product: true,
          },
        },

      },

      orderBy: {
        createdAt: "desc",
      },

    });

    return NextResponse.json(invoices);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Error obteniendo facturas",
      },
      {
        status: 500,
      }
    );

  }

}

//
// CREAR FACTURA
//

export async function POST(req: Request) {

  try {

    const body = await req.json();

    //
    // VALIDAR ITEMS
    //

    if (!body.items || body.items.length === 0) {

      return NextResponse.json(
        {
          error: "No hay productos",
        },
        {
          status: 400,
        }
      );

    }

    //
    // OBTENER PRODUCTOS
    //

    const products = await prisma.product.findMany({

      where: {

        id: {

          in: body.items.map(
            (item: any) => item.productId
          ),

        },

      },

    });

    //
    // CALCULAR TOTAL
    //

    let total = 0;

    for (const item of body.items) {

      const product = products.find(
        (p) => p.id === item.productId
      );

      //
      // PRODUCTO NO EXISTE
      //

      if (!product) {

        return NextResponse.json(
          {
            error: "Producto no encontrado",
          },
          {
            status: 404,
          }
        );

      }

      //
      // STOCK INSUFICIENTE
      //

      if (product.stock < item.quantity) {

        return NextResponse.json(
          {
            error: `Stock insuficiente para ${product.name}`,
          },
          {
            status: 400,
          }
        );

      }

      //
      // SUMAR TOTAL
      //

      total += Number(product.price) * item.quantity;

    }

    //
    // CREAR FACTURA
    //

    const invoice = await prisma.invoice.create({

      data: {

        customerId: body.customerId,

        total,

        items: {

          create: body.items.map((item: any) => {

            const product = products.find(
              (p) => p.id === item.productId
            );

            return {

              productId: item.productId,

              quantity: item.quantity,

              price: Number(product?.price),

            };

          }),

        },

      },

      include: {

        customer: true,

        items: {
          include: {
            product: true,
          },
        },

      },

    });

    //
    // DESCONTAR STOCK
    //

    for (const item of body.items) {

      await prisma.product.update({

        where: {
          id: item.productId,
        },

        data: {

          stock: {
            decrement: item.quantity,
          },

        },

      });

    }

    return NextResponse.json(invoice);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "Error creando factura",
      },
      {
        status: 500,
      }
    );

  }

}