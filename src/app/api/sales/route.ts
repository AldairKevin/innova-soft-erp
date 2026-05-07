import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 📊 GET - Obtener ventas para reportes
 */
export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" }, // Cambiado a desc para ver las más recientes primero
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error en GET /api/sales:", error);
    return NextResponse.json(
      { message: "Error al obtener ventas" },
      { status: 500 }
    );
  }
}

/**
 * 🛒 POST - Crear venta (POS) con validación de stock
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerName = "Cliente General" } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // 1. Obtener todos los IDs de los productos para buscarlos de un solo golpe
    const productIds = items.map((item: any) => Number(item.id));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 2. Iniciar Transacción
    const result = await prisma.$transaction(async (tx) => {
      let totalVenta = 0;
      const detailsData = [];

      for (const item of items) {
        const product = dbProducts.find((p) => p.id === Number(item.id));

        if (!product) throw new Error(`Producto ID ${item.id} no encontrado`);
        
        const quantity = Number(item.quantity);
        if (quantity <= 0) throw new Error(`Cantidad inválida para ${product.name}`);
        if (product.stock < quantity) throw new Error(`Stock insuficiente para ${product.name}`);

        const subtotal = Number(product.price) * quantity;
        totalVenta += subtotal;

        // Preparar datos para los detalles
        detailsData.push({
          productId: product.id,
          quantity: quantity,
          price: product.price,
        });

        // Actualizar stock del producto
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        });
      }

      // 3. Crear la venta y sus detalles en una sola operación
      return await tx.sale.create({
        data: {
          customerName,
          total: totalVenta,
          details: {
            create: detailsData,
          },
        },
        include: { details: true },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error en POST /api/sales:", error.message);
    return NextResponse.json(
      { message: error.message || "Error al procesar la venta" },
      { status: 400 } // Cambiado a 400 porque suele ser error de stock o datos
    );
  }
}