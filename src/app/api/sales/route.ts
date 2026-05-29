import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =====================================================================
// NUBEFACT
// =====================================================================

async function sendToNubefact(
  payload: any,
  url: string,
  token: string
) {
  console.log("=== ENVIANDO A NUBEFACT ===");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token token="${token}"`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log("=== RESPUESTA NUBEFACT ===", data);

  if (!response.ok || data.errors) {
    throw new Error(
      data.errors || data.message || "Error Nubefact"
    );
  }

  return data;
}

// =====================================================================
// POST
// =====================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      items,
      customerName,
      document,
      documentType,
      address,
    } = body;

    // ================================================================
    // VALIDACIONES
    // ================================================================

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "No hay productos",
        },
        {
          status: 400,
        }
      );
    }

    const isRuc = documentType === "RUC";

    const invoiceType = isRuc
      ? "FACTURA"
      : "BOLETA";

    const serie = isRuc
      ? "F001"
      : "B001";

    const tipoComprobante = isRuc ? 1 : 2;

    const tipoDocumentoCliente = isRuc
      ? "6"
      : "1";

    // ================================================================
    // TOTALES
    // ================================================================

    const total = items.reduce(
      (acc: number, item: any) =>
        acc + item.price * item.quantity,
      0
    );

    const subtotal = Number(
      (total / 1.18).toFixed(2)
    );

    const igv = Number(
      (total - subtotal).toFixed(2)
    );

    // ================================================================
    // TRANSACCIÓN
    // ================================================================

    const result = await prisma.$transaction(
      async (tx) => {

        // ============================================================
        // CLIENTE
        // ============================================================

        const customer =
          await tx.customer.upsert({
            where: {
              document,
            },

            update: {
              name: customerName,
              address,
              documentType,
            },

            create: {
              name: customerName,
              document,
              address,
              documentType,
            },
          });

        // ============================================================
        // SALE
        // ============================================================

        const sale = await tx.sale.create({
          data: {
            customerName,
            customerDocument: document,
            customerDocumentType:
              documentType,

            subtotal,
            igv,
            total,
          },
        });

        // ============================================================
        // SALE DETAILS
        // ============================================================

        for (const item of items) {

          await tx.saleDetail.create({
            data: {
              saleId: sale.id,

              productId: item.id,

              quantity: item.quantity,

              price: item.price,

              subtotal:
                item.price * item.quantity,
            },
          });

          // ========================================================
          // STOCK
          // ========================================================

          await tx.product.update({
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

        // ============================================================
        // INVOICE
        // ============================================================

        const invoice =
          await tx.invoice.create({
            data: {
              customerId: customer.id,

              type: invoiceType,

              serie,

              number: sale.id.toString(),

              subtotal,

              igv,

              total,

              status: "PENDING",

              items: {
                create: items.map(
                  (item: any) => ({
                    productId: item.id,

                    quantity: item.quantity,

                    price: item.price,

                    subtotal:
                      item.price *
                      item.quantity,

                    igv: Number(
                      (
                        item.price *
                        item.quantity -
                        item.price *
                          item.quantity /
                          1.18
                      ).toFixed(2)
                    ),

                    total:
                      item.price *
                      item.quantity,
                  })
                ),
              },
            },

            include: {
              customer: true,
              items: true,
            },
          });

        return {
          customer,
          sale,
          invoice,
        };
      }
    );

    const {
      sale,
      invoice,
    } = result;

    // ================================================================
    // NUBEFACT
    // ================================================================

    try {

      const business =
        await prisma.business.findFirst();

      if (
        business?.nubefact_token &&
        business?.nubefact_url
      ) {

        const payload = {
          operacion:
            "generar_comprobante",

          tipo_de_comprobante:
            tipoComprobante,

          serie,

          numero:
            invoice.number,

          sunat_transaction: 1,

          cliente_tipo_de_documento:
            tipoDocumentoCliente,

          cliente_numero_de_documento:
            document,

          cliente_denominacion:
            customerName,

          cliente_direccion:
            address,

          fecha_de_emision:
            new Date()
              .toISOString()
              .split("T")[0],

          moneda: 1,

          porcentaje_de_igv: 18,

          total_gravada:
            subtotal,

          total_igv:
            igv,

          total,

          total_venta:
            total,

          items: items.map(
            (item: any) => {

              const itemSubtotal =
                Number(
                  (
                    item.price /
                    1.18
                  ).toFixed(2)
                );

              const itemIgv =
                Number(
                  (
                    item.price -
                    itemSubtotal
                  ).toFixed(2)
                );

              return {
                unidad_de_medida:
                  "NIU",

                codigo:
                  item.id.toString(),

                descripcion:
                  item.name,

                cantidad:
                  item.quantity,

                valor_unitario:
                  itemSubtotal,

                precio_unitario:
                  item.price,

                descuento: 0,

                subtotal:
                  itemSubtotal *
                  item.quantity,

                tipo_de_igv: 1,

                igv:
                  itemIgv *
                  item.quantity,

                total:
                  item.price *
                  item.quantity,
              };
            }
          ),
        };

        const nubefactResponse =
          await sendToNubefact(
            payload,
            business.nubefact_url,
            business.nubefact_token
          );

        // ============================================================
        // UPDATE INVOICE
        // ============================================================

        await prisma.invoice.update({
          where: {
            id: invoice.id,
          },

          data: {
            status: "COMPLETED",

            sunatStatus:
              nubefactResponse
                ?.aceptada_por_sunat
                ? "ACEPTADO"
                : "PROCESADO",

            sunatResponse:
              JSON.stringify(
                nubefactResponse
              ),

            pdfUrl:
              nubefactResponse
                ?.enlace_del_pdf,

            xmlUrl:
              nubefactResponse
                ?.enlace_del_xml,

            cdrUrl:
              nubefactResponse
                ?.enlace_del_cdr,

            hash:
              nubefactResponse?.cadena_para_codigo_qr,
          },
        });
      }

    } catch (nubefactError: any) {

      console.error(
        "ERROR NUBEFACT",
        nubefactError
      );

      await prisma.invoice.update({
        where: {
          id: invoice.id,
        },

        data: {
          status: "ERROR",

          sunatStatus: "ERROR",

          sunatResponse:
            nubefactError.message,
        },
      });
    }

    // ================================================================
    // RESPUESTA
    // ================================================================

    return NextResponse.json({
      success: true,

      saleId: sale.id,

      invoiceId: invoice.id,
    });

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error procesando venta",

        details:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}