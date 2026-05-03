"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";

export async function createSale(data: any) {

  try {

    const sale = await prisma.sale.create({

      data: {

        customerName: data.customerName,

        total: data.total,

        details: {

          create: data.items.map((item: any) => ({

            quantity: item.quantity,

            price: Number(item.price),

            productId: item.id,

          })),

        },

      },

    });

    // ACTUALIZAR STOCK
    for (const item of data.items) {

      await prisma.product.update({

        where: {
          id: item.id,
        },

        data: {

          stock: {
            decrement: item.quantity,
          },

        },

      });

    }

    revalidatePath("/dashboard/pos");

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      sale,
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: "Error al registrar venta",
    };

  }

}