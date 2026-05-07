import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const saleId = Number(searchParams.get("saleId"));

  if (!saleId) {
    return NextResponse.json(
      { message: "saleId inválido" },
      { status: 400 }
    );
  }

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      details: {
        include: { product: true },
      },
    },
  });

  if (!sale) {
    return NextResponse.json(
      { message: "No encontrado" },
      { status: 404 }
    );
  }

  // 🔥 QR (contiene ID de venta o link de verificación)
  const qrData = await QRCode.toDataURL(
    `VENTA:${sale.id}`
  );

  const doc = new PDFDocument({
    size: [226, 700],
    margin: 10,
  });

  const chunks: Buffer[] = [];

  doc.on("data", (c) => chunks.push(c));

  const pdfBuffer: Buffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // HEADER
    doc.fontSize(14).text("INNOVA SOFT S.A.C.", {
      align: "center",
    });

    doc.fontSize(10).text("RUC: 12345678901", {
      align: "center",
    });

    doc.text("Arequipa - Perú", {
      align: "center",
    });

    doc.moveDown();
    doc.text("------------------------------");

    // INFO
    const fecha = new Date(sale.createdAt).toLocaleString(
      "es-PE"
    );

    doc.text(`Fecha: ${fecha}`);
    doc.text(`Ticket: #${sale.id}`);

    doc.text("------------------------------");

    // DETALLE
    sale.details.forEach((d) => {
      const name = d.product.name;
      const qty = Number(d.quantity);
      const price = Number(d.price);
      const total = qty * price;

      doc.text(name);
      doc.text(
        `${qty} x S/ ${price.toFixed(2)} = S/ ${total.toFixed(2)}`
      );
    });

    doc.text("------------------------------");

    // TOTAL
    doc
      .fontSize(12)
      .text(
        `TOTAL: S/ ${Number(sale.total).toFixed(2)}`,
        { align: "right" }
      );

    doc.moveDown();

    // 🔥 QR EN EL TICKET
    doc.text("QR de verificación:", { align: "center" });

    const imgWidth = 120;
    const imgX = (226 - imgWidth) / 2;

    doc.image(qrData, imgX, doc.y, {
      width: imgWidth,
    });

    doc.moveDown(6);

    // FOOTER
    doc
      .fontSize(10)
      .text("Gracias por su compra", {
        align: "center",
      });

    doc.end();
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        "inline; filename=ticket.pdf",
    },
  });
}