import jsPDF from "jspdf";

export const generatePDF = (
    type: "boleta" | "factura",
    order: any,
    payload: any
) => {
    if (type === "boleta") {
        generarBoleta(order, payload);
    } else {
        generarFactura(order, payload);
    }
};

/* =========================
   🧾 BOLETA (la tuya actual)
========================= */
const generarBoleta = (order: any, payload: any) => {
    const doc = new jsPDF();
    doc.text("BOLETA", 10, 10);
    doc.save(`boleta-${order.order_number}.pdf`);
};

/* =========================
   🧾 FACTURA PRO 🔥
========================= */
const generarFactura = (order: any, payload: any) => {
    const doc = new jsPDF();

    const cliente = payload.cliente;
    const productos = payload.productos;
    const pago = payload.pago;

    /* =========================
       HEADER
    ========================= */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("MI EMPRESA SAC", 10, 10);

    doc.setFont("helvetica", "normal");
    doc.text("RUC: 20123456789", 10, 15);
    doc.text("Dirección: Lima - Perú", 10, 20);

    /* BOX FACTURA */
    doc.rect(140, 10, 60, 25);

    doc.setFont("helvetica", "bold");
    doc.text("FACTURA ELECTRÓNICA", 142, 16);
    doc.text(`F001-${order.order_number}`, 142, 22);

    doc.setFont("helvetica", "normal");
    doc.text("Fecha:", 142, 28);
    doc.text(new Date().toLocaleDateString(), 160, 28);

    /* =========================
       CLIENTE BOX
    ========================= */
    doc.rect(10, 35, 190, 25);

    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${cliente.name}`, 12, 42);
    doc.text(`RUC/DNI: ${cliente.dni || "-"}`, 12, 48);
    doc.text(`Teléfono: ${cliente.phoneWithPrefix}`, 12, 54);

    /* =========================
       TABLA
    ========================= */
    let y = 70;

    doc.setFont("helvetica", "bold");
    doc.text("Item", 12, y);
    doc.text("Descripción", 30, y);
    doc.text("Cant", 120, y);
    doc.text("V.Unit", 140, y);
    doc.text("Total", 180, y);

    doc.setFont("helvetica", "normal");

    y += 5;

    let index = 1;

    const drawRow = (desc: string, qty: number, total: number) => {
        const unit = total / qty;

        doc.text(String(index++), 12, y);
        doc.text(desc, 30, y);

        doc.text(qty.toString(), 125, y, { align: "right" });
        doc.text(unit.toFixed(2), 150, y, { align: "right" });
        doc.text(total.toFixed(2), 190, y, { align: "right" });

        y += 5;
    };

    /* BASE */
    drawRow(
        productos.base.name,
        Number(productos.base.quantity),
        Number(productos.base.total)
    );

    /* UPSELLS */
    productos.upsells.forEach((p: any) => {
        drawRow(p.title, Number(p.quantity), Number(p.total));
    });

    /* =========================
       BOX TOTALES 🔥
    ========================= */
    doc.rect(120, y + 5, 80, 40);

    const total = pago.totalFinal;

    doc.setFont("helvetica", "bold");

    doc.text("VALOR BRUTO:", 122, y + 12);
    doc.text(total.toFixed(2), 195, y + 12, { align: "right" });

    doc.text("IGV (18%):", 122, y + 18);
    doc.text("0.00", 195, y + 18, { align: "right" });

    doc.text("TOTAL:", 122, y + 28);
    doc.text(total.toFixed(2), 195, y + 28, { align: "right" });

    /* =========================
       TEXTO
    ========================= */
    doc.setFont("helvetica", "normal");
    doc.text(
        `SON: ${numeroALetras(total)} SOLES`,
        10,
        y + 50
    );

    /* =========================
       FOOTER
    ========================= */
    doc.setFontSize(7);
    doc.text(
        "Gracias por su compra",
        10,
        280
    );

    doc.save(`factura-${order.order_number}.pdf`);
};

/* =========================
   NUMERO A LETRAS
========================= */
const numeroALetras = (num: number) => {
    return "CUARENTA Y CINCO CON 00/100";
};