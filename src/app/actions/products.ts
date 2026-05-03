"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 🔹 helper para serializar Prisma (evita errores con Decimal)
function serializeProduct(product: any) {
  return {
    ...product,
    price: Number(product.price),
  };
}

// OBTENER PRODUCTOS
export async function getProducts() {
  try {
    const productsRaw = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const products = productsRaw.map(serializeProduct);

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al obtener productos",
    };
  }
}

// CREAR PRODUCTO
export async function createProduct(formData: FormData) {
  try {
    const name = String(formData.get("name"));
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    await prisma.product.create({
      data: {
        name,
        price,
        stock,
      },
    });

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al crear producto",
    };
  }
}

// ACTUALIZAR PRODUCTO
export async function updateProduct(formData: FormData) {
  try {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock,
      },
    });

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Error al actualizar producto",
    };
  }
}

// ELIMINAR PRODUCTO
export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/inventory");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al eliminar producto",
    };
  }
}