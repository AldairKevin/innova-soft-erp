import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const params = await context.params;

    const invoice: any = await prisma.invoice.findUnique({

      where: {
        id: Number(params.id),
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
    // FACTURA NO EXISTE
    //

    if (!invoice) {

      return new Response(
        "Factura no encontrada",
        {
          status: 404,
        }
      );

    }

    //
    // CALCULAR SUBTOTAL E IGV
    //

    const subtotal = invoice.total / 1.18;

    const igv = invoice.total - subtotal;

    //
    // ITEMS HTML
    //

    const itemsHtml = invoice.items.map((item: any) => {

      const total = item.quantity * item.price;

      return `

        <tr>

          <td class="product">
            ${item.product.name}
          </td>

          <td>
            ${item.quantity}
          </td>

          <td>
            S/ ${Number(item.price).toFixed(2)}
          </td>

          <td class="bold">
            S/ ${total.toFixed(2)}
          </td>

        </tr>

      `;

    }).join("");

    //
    // HTML
    //

    const html = `

<!DOCTYPE html>

<html lang="es">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Factura ${invoice.id}
  </title>

  <style>

    *{
      margin:0;
      padding:0;
      box-sizing:border-box;
    }

    body{
      font-family:Arial, sans-serif;
      background:#e2e8f0;
      padding:40px;
      color:#0f172a;
    }

    .container{
      max-width:950px;
      margin:auto;
      background:white;
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 15px 45px rgba(0,0,0,0.12);
    }

    //
    // HEADER
    //

    .header{
      background:linear-gradient(
        135deg,
        #020617,
        #0f172a
      );

      color:white;

      padding:45px;

      display:flex;
      justify-content:space-between;
      align-items:center;
    }

    .logo{
      font-size:34px;
      font-weight:bold;
      margin-bottom:10px;
    }

    .subtitle{
      color:#cbd5e1;
      font-size:14px;
      line-height:1.6;
    }

    .invoice-box{
      text-align:right;
    }

    .invoice-title{
      font-size:36px;
      font-weight:bold;
      margin-bottom:10px;
    }

    .invoice-number{
      color:#93c5fd;
      font-size:18px;
      font-weight:600;
    }

    //
    // CONTENT
    //

    .content{
      padding:45px;
    }

    .grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:24px;
      margin-bottom:40px;
    }

    .card{
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:18px;
      padding:24px;
    }

    .label{
      color:#64748b;
      font-size:13px;
      margin-bottom:10px;
      text-transform:uppercase;
      letter-spacing:1px;
      font-weight:600;
    }

    .value{
      font-size:21px;
      font-weight:bold;
      color:#020617;
    }

    //
    // TABLE
    //

    table{
      width:100%;
      border-collapse:collapse;
      overflow:hidden;
      border-radius:18px;
      margin-top:10px;
    }

    thead{
      background:#0f172a;
      color:white;
    }

    th{
      text-align:left;
      padding:18px;
      font-size:14px;
      font-weight:600;
    }

    td{
      padding:18px;
      border-bottom:1px solid #e2e8f0;
      font-size:15px;
      color:#334155;
    }

    tbody tr:nth-child(even){
      background:#f8fafc;
    }

    .product{
      font-weight:600;
      color:#020617;
    }

    .bold{
      font-weight:bold;
      color:#020617;
    }

    //
    // SUMMARY
    //

    .summary{
      display:flex;
      justify-content:flex-end;
      margin-top:40px;
    }

    .summary-box{
      width:360px;
      background:#f8fafc;
      border:1px solid #e2e8f0;
      border-radius:20px;
      padding:30px;
    }

    .summary-row{
      display:flex;
      justify-content:space-between;
      margin-bottom:18px;
      font-size:16px;
      color:#334155;
    }

    .summary-total{
      border-top:2px solid #cbd5e1;
      padding-top:20px;
      margin-top:20px;

      display:flex;
      justify-content:space-between;

      font-size:28px;
      font-weight:bold;

      color:#2563eb;
    }

    //
    // STATUS
    //

    .status{
      margin-top:25px;

      display:inline-flex;
      align-items:center;
      justify-content:center;

      background:#16a34a;

      color:white;

      padding:12px 20px;

      border-radius:999px;

      font-size:13px;
      font-weight:bold;

      letter-spacing:1px;
    }

    //
    // FOOTER
    //

    .footer{
      background:#f8fafc;
      border-top:1px solid #e2e8f0;

      padding:28px;

      text-align:center;

      color:#64748b;

      font-size:14px;
      line-height:1.7;
    }

    .thanks{
      font-weight:bold;
      color:#0f172a;
      margin-bottom:6px;
    }

  </style>

</head>

<body>

  <div class="container">

    <div class="header">

      <div>

        <div class="logo">
          INNOVASOFT ERP
        </div>

        <div class="subtitle">

          Sistema Profesional de Facturación Electrónica<br />

          Perú · SUNAT · ERP Empresarial

        </div>

      </div>

      <div class="invoice-box">

        <div class="invoice-title">
          FACTURA
        </div>

        <div class="invoice-number">
          F001-${invoice.id}
        </div>

      </div>

    </div>

    <div class="content">

      <div class="grid">

        <div class="card">

          <div class="label">
            Cliente
          </div>

          <div class="value">
            ${invoice.customer.name}
          </div>

        </div>

        <div class="card">

          <div class="label">
            Documento
          </div>

          <div class="value">
            ${invoice.customer.document}
          </div>

        </div>

        <div class="card">

          <div class="label">
            Fecha de Emisión
          </div>

          <div class="value">
            ${new Date(invoice.createdAt)
              .toLocaleDateString("es-PE")}
          </div>

        </div>

        <div class="card">

          <div class="label">
            Estado SUNAT
          </div>

          <div class="value">
            ${invoice.status}
          </div>

        </div>

      </div>

      <table>

        <thead>

          <tr>

            <th>
              Producto
            </th>

            <th>
              Cantidad
            </th>

            <th>
              Precio
            </th>

            <th>
              Subtotal
            </th>

          </tr>

        </thead>

        <tbody>

          ${itemsHtml}

        </tbody>

      </table>

      <div class="summary">

        <div class="summary-box">

          <div class="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              S/ ${subtotal.toFixed(2)}
            </span>

          </div>

          <div class="summary-row">

            <span>
              IGV (18%)
            </span>

            <span>
              S/ ${igv.toFixed(2)}
            </span>

          </div>

          <div class="summary-total">

            <span>
              TOTAL
            </span>

            <span>
              S/ ${Number(invoice.total).toFixed(2)}
            </span>

          </div>

          <div class="status">
            ${invoice.status}
          </div>

        </div>

      </div>

    </div>

    <div class="footer">

      <div class="thanks">
        Gracias por confiar en InnovaSoft ERP
      </div>

      Facturación Electrónica Profesional · SUNAT Perú

    </div>

  </div>

</body>

</html>

`;

    return new Response(html, {

      headers: {
        "Content-Type": "text/html; charset=UTF-8",
      },

    });

  } catch (error) {

    console.log(error);

    return new Response(
      "Error generando factura",
      {
        status: 500,
      }
    );

  }

}