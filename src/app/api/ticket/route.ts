import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

import path from "path";
import fs from "fs";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const saleId = Number(searchParams.get("saleId"));

    if (!saleId) {
      return NextResponse.json(
        { message: "saleId inválido" },
        { status: 400 }
      );
    }

    //
    // VENTA
    //
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
        { message: "Venta no encontrada" },
        { status: 404 }
      );
    }

    //
    // EMPRESA & SETTINGS
    //
    const business = await prisma.business.findFirst();
    const settings = await prisma.settings.findFirst();

    const PRIMARY = settings?.primaryColor || "#06B6D4";
    const CURRENCY = settings?.currency || "S/";

    //
    // QR
    //
    const qrData = await QRCode.toDataURL(
      JSON.stringify({
        saleId: sale.id,
        total: sale.total,
        business: business?.name,
      })
    );

    //
    // TOTALES
    //
    const total = Number(sale.total);
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    //
    // ALTURA DINÁMICA CORREGIDA
    //
    // Cada item en el bucle suma 85px en el eje Y.
    const itemsHeight = sale.details.length * 85; 
    // La altura requerida para header, tarjetas de total, QR y footer es ~700px.
    const finalHeight = 700 + itemsHeight; 

    //
    // PDF
    //
    const doc = new PDFDocument({
      size: [300, finalHeight],
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      bufferPages: false,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    const pdfBuffer: Buffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      // FONDO
      doc.rect(0, 0, 300, finalHeight).fill("#F8FAFC");

      // HEADER
      doc.rect(0, 0, 300, 165).fill("#020617");

      // LOGO
      try {
        const logoPath = path.join(process.cwd(), "public", "uploads", "logo.png");
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 40, 15, { fit: [220, 80], align: "center" });
        }
      } catch (error) {
        console.log("Error logo:", error);
      }

      // EMPRESA
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(business?.name || "INNOVASOFT", 0, 95, { align: "center" });

      doc
        .fillColor("#CBD5E1")
        .fontSize(8)
        .font("Helvetica")
        .text(`RUC: ${business?.ruc || "00000000000"}`, 0, 120, { align: "center" });

      //
      // START Y
      //
      let y = 185;

      // TÍTULO
      doc
        .fillColor("#0F172A")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("TICKET DE VENTA", 0, y, { align: "center" });
      y += 30;

      // CARD INFO
      doc.roundedRect(16, y, 268, 85, 18).fill("#FFFFFF");
      doc.strokeColor("#E2E8F0").roundedRect(16, y, 268, 85, 18).stroke();
      doc.fillColor(PRIMARY).font("Helvetica-Bold").fontSize(11).text("DETALLE", 28, y + 14);
      
      doc.fillColor("#475569").font("Helvetica").fontSize(9);
      doc.text(`Ticket: #${sale.id}`, 28, y + 38);
      doc.text(`Fecha: ${new Date(sale.createdAt).toLocaleString("es-PE")}`, 28, y + 55);
      y += 105;

      // PRODUCTOS
      doc.fillColor("#020617").font("Helvetica-Bold").fontSize(12).text("PRODUCTOS", 18, y);
      y += 22;

      // ITEMS
      sale.details.forEach((detail) => {
        const qty = Number(detail.quantity);
        const price = Number(detail.price);
        const itemSubtotal = qty * price;

        // CARD
        doc.roundedRect(16, y, 268, 75, 16).fill("#FFFFFF");
        doc.strokeColor("#E2E8F0").roundedRect(16, y, 268, 75, 16).stroke();

        // PRODUCTO
        doc
          .fillColor("#020617")
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(detail.product.name, 28, y + 14, { width: 150 });

        // DETALLE
        doc
          .fillColor("#64748B")
          .font("Helvetica")
          .fontSize(8)
          .text(`${qty} x ${CURRENCY} ${price.toFixed(2)}`, 28, y + 45);

        // SUBTOTAL
        doc.roundedRect(188, y + 20, 72, 30, 10).fill(PRIMARY);
        doc
          .fillColor("#FFFFFF")
          .font("Helvetica-Bold")
          .fontSize(9)
          .text(`${CURRENCY} ${itemSubtotal.toFixed(2)}`, 188, y + 31, {
            width: 72,
            align: "center",
          });

        y += 85;
      });

      // TOTAL CARD
      doc.roundedRect(16, y, 268, 150, 20).fill("#020617");
      doc.fillColor("#94A3B8").font("Helvetica").fontSize(10).text("RESUMEN", 0, y + 18, { align: "center" });

      // SUBTOTAL
      doc.fillColor("#CBD5E1").fontSize(9).text("Subtotal", 30, y + 55);
      doc.text(`${CURRENCY} ${subtotal.toFixed(2)}`, 170, y + 55, { width: 80, align: "right" });

      // IGV
      doc.text("IGV", 30, y + 78);
      doc.text(`${CURRENCY} ${igv.toFixed(2)}`, 170, y + 78, { width: 80, align: "right" });

      // LINEA
      doc.strokeColor("#334155").moveTo(30, y + 102).lineTo(250, y + 102).stroke();

      // TOTAL
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(`${CURRENCY} ${total.toFixed(2)}`, 0, y + 112, { align: "center" });
      y += 180;

      // QR
      doc.fillColor(PRIMARY).font("Helvetica-Bold").fontSize(10).text("VERIFICACIÓN", 0, y, { align: "center" });
      y += 18;
      doc.image(qrData, 95, y, { width: 110 });
      y += 120;

      // FOOTER
      doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(12).text("Gracias por su compra", 0, y, { align: "center" });
      doc
        .fillColor("#64748B")
        .fontSize(8)
        .font("Helvetica")
        .text(`${business?.name || "INNOVASOFT"} ERP © 2026`, 0, y + 16, { align: "center" });

      // FINAL
      doc.end();
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=ticket-${sale.id}.pdf`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error generando PDF" },
      { status: 500 }
    );
  }
}