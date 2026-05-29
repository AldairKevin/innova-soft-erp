import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { toWords } from "number-to-words";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paramId = Number(searchParams.get("invoiceId"));

  if (!paramId) return new Response("ID requerido", { status: 400 });

  // 1. Buscar en Invoice (usando el esquema nuevo)
  let invoice: any = await prisma.invoice.findUnique({
    where: { id: paramId },
    include: { items: { include: { product: true } }, customer: true },
  });

  // 2. Si no existe, buscar por saleId
  if (!invoice) {
    invoice = await prisma.invoice.findFirst({
      where: { saleId: paramId },
      include: { items: { include: { product: true } }, customer: true },
    });
  }

  const business = await prisma.business.findFirst() as any;

  if (!invoice || !business) {
    return new Response("Comprobante no encontrado", { status: 404 });
  }

  // --- GENERACIÓN DEL PDF ---
  const doc = new PDFDocument({ size: [260, 800], margins: { top: 15, left: 10, right: 10, bottom: 15 } });
  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));

  // Cabecera
  doc.font("Courier-Bold").fontSize(10).text(business.name.toUpperCase(), { align: "center" });
  doc.font("Courier").fontSize(8).text(`RUC: ${business.ruc}`, { align: "center" });
  doc.text(business.address || "", { align: "center" });
  doc.moveDown(0.5);
  doc.text("---------------------------------------------", { align: "center" });

  // Tipo y Serie-Número (Corregido: 'series' en lugar de 'serie')
  doc.font("Courier-Bold").fontSize(9).text(invoice.type.toUpperCase(), { align: "center" });
  doc.text(`${invoice.series}-${invoice.number.toString().padStart(8, "0")}`, { align: "center" });
  doc.text("---------------------------------------------", { align: "center" });

  // Cliente
  doc.font("Courier").fontSize(8);
  doc.text(`FECHA: ${new Date(invoice.createdAt).toLocaleDateString("es-PE")}`);
  doc.text(`CLIENTE: ${invoice.customer?.name.substring(0, 30).toUpperCase() || "CLIENTE VARIOS"}`);
  doc.text(`${invoice.customer?.documentType || "DNI"}: ${invoice.customer?.document || "-"}`);
  doc.text("---------------------------------------------", { align: "center" });

  // Detalle
  doc.font("Courier-Bold").fontSize(7);
  doc.text("CANT DESCRIPCION      P.UNIT   TOTAL", 10, doc.y);
  doc.moveDown(0.5);
  doc.font("Courier").fontSize(8);
  
  invoice.items.forEach((item: any) => {
    const y = doc.y;
    doc.text(item.quantity.toString(), 10, y);
    doc.text(item.product?.name.substring(0, 14) || "Prod", 30, y);
    doc.text(Number(item.price).toFixed(2), 140, y);
    doc.text(Number(item.total).toFixed(2), 200, y);
    doc.moveDown(1);
  });

  doc.text("---------------------------------------------", { align: "center" });

  // Totales
  const total = Number(invoice.total);
  const igv = Number(invoice.igv);
  const subtotal = Number(invoice.subtotal);

  doc.text(`SUBTOTAL: S/ ${subtotal.toFixed(2)}`, { align: "right" });
  doc.text(`IGV (${invoice.igvPercent}%): S/ ${igv.toFixed(2)}`, { align: "right" });
  doc.font("Courier-Bold").fontSize(10).text(`TOTAL:    S/ ${total.toFixed(2)}`, { align: "right" });

  // Leyenda
  if (invoice.type === "FACTURA") {
    doc.moveDown(0.5);
    doc.fontSize(7).font("Courier-Oblique")
       .text(`SON: ${invoice.legend || toWords(Math.floor(total)).toUpperCase() + " SOLES"}`);
  }

  // QR
  doc.moveDown(1);
  const qrData = `${business.ruc}|${invoice.type}|${invoice.series}|${invoice.number}|${invoice.igv}|${total}|${new Date(invoice.createdAt).toISOString()}|${invoice.hash || ""}`;
  const qrBase64 = await QRCode.toDataURL(qrData);
  doc.image(Buffer.from(qrBase64.split(",")[1], "base64"), 80, doc.y, { width: 90 });
  doc.moveDown(9);

  // Pie
  doc.fontSize(6).text("Representación impresa del comprobante electrónico.", { align: "center" });
  doc.text("Hash: " + (invoice.hash || "PENDIENTE"), { align: "center" });

  doc.end();
  const buffer = await new Promise<Buffer>((resolve) => { doc.on("end", () => resolve(Buffer.concat(buffers))); });
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "application/pdf" } });
}