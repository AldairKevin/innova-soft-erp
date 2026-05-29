"use server";

export async function createSale(data: {
  items: any[];
  customerName?: string;
  document?: string;
  address?: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/sales`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: data.items,
          customerName: data.customerName || "Cliente",
          document: data.document || "99999999",
          address: data.address || "Lima",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          "Error creando venta"
      );
    }

    return result;
  } catch (error: any) {
    console.error("ERROR createSale:");
    console.error(error);

    return {
      success: false,
      error:
        error.message ||
        "Error procesando venta",
    };
  }
}