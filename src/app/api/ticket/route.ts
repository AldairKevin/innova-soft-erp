import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const saleId = Number(
    searchParams.get("saleId")
  );

  if (!saleId) {
    return NextResponse.json(
      {
        message: "saleId inválido",
      },
      {
        status: 400,
      }
    );
  }

  const sale = await prisma.sale.findUnique({
    where: {
      id: saleId,
    },
    include: {
      details: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale) {
    return NextResponse.json(
      {
        message: "No encontrado",
      },
      {
        status: 404,
      }
    );
  }

  // 🔥 QR
  const qrData = await QRCode.toDataURL(
    `VENTA-${sale.id}`
  );

  const doc = new PDFDocument({
    size: [250, 900],
    margin: 16,
  });

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) =>
    chunks.push(chunk)
  );

  const pdfBuffer: Buffer =
    await new Promise((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      // =========================
      // 🔥 HEADER
      // =========================

      doc
        .roundedRect(0, 0, 250, 90, 0)
        .fill("#0F172A");

      doc
        .fillColor("#FFFFFF")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("INNOVASOFT", 0, 22, {
          align: "center",
        });

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#CBD5E1")
        .text(
          "Sistema Empresarial Profesional",
          {
            align: "center",
          }
        );

      doc.moveDown(2);

      // =========================
      // INFO EMPRESA
      // =========================

      doc
        .fillColor("#111827")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("RUC: 12345678901");

      doc
        .font("Helvetica")
        .fillColor("#475569")
        .text("Arequipa - Perú");

      doc.text(
        `Fecha: ${new Date(
          sale.createdAt
        ).toLocaleString("es-PE")}`
      );

      doc.text(`Ticket: #${sale.id}`);

      doc.moveDown(1);

      // =========================
      // LINEA
      // =========================

      doc
        .strokeColor("#CBD5E1")
        .lineWidth(1)
        .moveTo(16, doc.y)
        .lineTo(234, doc.y)
        .stroke();

      doc.moveDown(1);

      // =========================
      // TITULO DETALLE
      // =========================

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#0F172A")
        .text("DETALLE DE COMPRA");

      doc.moveDown(0.8);

      // =========================
      // PRODUCTOS
      // =========================

      sale.details.forEach((detail) => {
        const qty = Number(detail.quantity);

        const price = Number(detail.price);

        const subtotal =
          qty * price;

        // CARD PRODUCTO
        doc
          .roundedRect(
            16,
            doc.y,
            218,
            48,
            10
          )
          .fill("#F8FAFC");

        const currentY = doc.y + 8;

        doc
          .fillColor("#111827")
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(
            detail.product.name,
            24,
            currentY
          );

        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor("#475569")
          .text(
            `${qty} x S/ ${price.toFixed(
              2
            )}`,
            24,
            currentY + 16
          );

        doc
          .font("Helvetica-Bold")
          .fillColor("#0F172A")
          .text(
            `S/ ${subtotal.toFixed(
              2
            )}`,
            170,
            currentY + 8,
            {
              width: 50,
              align: "right",
            }
          );

        doc.moveDown(3.2);
      });

      // =========================
      // TOTAL
      // =========================

      doc.moveDown(1);

      doc
        .roundedRect(
          16,
          doc.y,
          218,
          55,
          14
        )
        .fill("#0F172A");

      const totalY = doc.y + 10;

      doc
        .fillColor("#94A3B8")
        .fontSize(10)
        .font("Helvetica")
        .text(
          "TOTAL PAGADO",
          0,
          totalY,
          {
            align: "center",
          }
        );

      doc
        .fillColor("#FFFFFF")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(
          `S/ ${Number(
            sale.total
          ).toFixed(2)}`,
          0,
          totalY + 16,
          {
            align: "center",
          }
        );

      doc.moveDown(4);

      // =========================
      // QR
      // =========================

      doc
        .fillColor("#111827")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(
          "Código de verificación",
          {
            align: "center",
          }
        );

      doc.moveDown(0.7);

      const qrSize = 110;

      const qrX =
        (250 - qrSize) / 2;

      doc.image(
        qrData,
        qrX,
        doc.y,
        {
          width: qrSize,
        }
      );

      doc.moveDown(7);

      // =========================
      // FOOTER
      // =========================

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#0F172A")
        .text(
          "Gracias por su compra",
          {
            align: "center",
          }
        );

      doc.moveDown(0.5);

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#64748B")
        .text(
          "INNOVASOFT ERP © 2026",
          {
            align: "center",
          }
        );

      doc.end();
    });

  return new NextResponse(
    new Uint8Array(pdfBuffer),
    {
      headers: {
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          "inline; filename=ticket.pdf",
      },
    }
  );
}