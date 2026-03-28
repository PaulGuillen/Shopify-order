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
   🧾 BOLETA SUNAT 🔥
========================= */
const generarBoleta = (order: any, payload: any) => {
    const doc = new jsPDF();

    const cliente = payload.cliente;
    const productos = payload.productos;
    const pago = payload.pago;

    const empresa = {
        nombre: "RESTAURANT CAPIRONA",
        razon: "GAMARRA TRUJILLO ELEINE IRMA",
        direccion:
            "PZA. LA PAZ SN C.P. VILLA SARAMIRIZA FRENTE A LA PLAZA",
        ubigeo: "MAN SERICHE - DATEM DEL MARAÑON - LORETO",
        ruc: "10156751117",
        serie: "EB01",
    };

    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString(), 10, 8);
    doc.text(":: Boleta de Venta Electronica - Impresion ::", 70, 8);

    doc.rect(10, 12, 190, 130);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(empresa.nombre, 12, 18);

    doc.setFont("helvetica", "normal");
    doc.text(empresa.razon, 12, 23);
    doc.text(empresa.direccion, 12, 28);
    doc.text(empresa.ubigeo, 12, 33);

    doc.rect(130, 16, 65, 22);

    doc.setFont("helvetica", "bold");
    doc.text("BOLETA DE VENTA ELECTRONICA", 132, 22);

    doc.setFont("helvetica", "normal");
    doc.text(`RUC: ${empresa.ruc}`, 132, 28);
    doc.text(`${empresa.serie}-${order.order_number}`, 132, 34);

    doc.setFontSize(8);

    doc.text("Fecha de Emisión :", 12, 45);
    doc.text(new Date().toLocaleDateString(), 60, 45);

    doc.text("Señor(es) :", 12, 50);
    doc.text(cliente.name || "-", 60, 50);

    doc.text("Tipo de Moneda :", 12, 55);
    doc.text("SOLES", 60, 55);

    doc.text("Observación :", 12, 60);
    doc.text("VENTA DE PRODUCTOS", 60, 60);

    doc.setFont("helvetica", "bold");

    let y = 70;

    doc.text("Cantidad", 12, y);
    doc.text("Unidad", 30, y);
    doc.text("Descripción", 50, y);

    doc.text("Valor Unit.", 135, y, { align: "right" });
    doc.text("Desc.", 155, y, { align: "right" });
    doc.text("Importe", 190, y, { align: "right" });

    doc.setFont("helvetica", "normal");
    y += 5;

    const maxWidth = 50;

    /* BASE */
    const baseQty = Number(productos.base.quantity || 1);
    const baseTotal = Number(productos.base.total || 0);
    const baseUnit = baseTotal / baseQty;

    const baseLines = doc.splitTextToSize(
        productos.base.name || "Producto",
        maxWidth
    );

    doc.text(baseQty.toFixed(2), 12, y);
    doc.text("UND", 30, y);
    doc.text(baseLines, 50, y);

    doc.text(baseUnit.toFixed(2), 135, y, { align: "right" });
    doc.text("0.00", 155, y, { align: "right" });
    doc.text(baseTotal.toFixed(2), 190, y, { align: "right" });

    y += baseLines.length * 5;

    /* UPSELLS */
    productos.upsells.forEach((p: any) => {
        const qty = Number(p.quantity || 1);
        const total = Number(p.total || 0);
        const unit = total / qty;

        const lines = doc.splitTextToSize(p.title, maxWidth);

        doc.text(qty.toFixed(2), 12, y);
        doc.text("UND", 30, y);
        doc.text(lines, 50, y);

        doc.text(unit.toFixed(2), 135, y, { align: "right" });
        doc.text("0.00", 155, y, { align: "right" });
        doc.text(total.toFixed(2), 190, y, { align: "right" });

        y += lines.length * 5;
    });

    const totalY = y + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Importe Total :", 120, totalY);
    doc.text(`S/ ${pago.totalFinal.toFixed(2)}`, 190, totalY, {
        align: "right",
    });

    doc.text(
        `SON: ${numeroALetras(pago.totalFinal)} SOLES`,
        12,
        totalY + 10
    );

    doc.setFont("helvetica", "normal");

    doc.setFontSize(7);
    doc.text(
        "Esta es una representación impresa de la Boleta Electrónica.",
        12,
        140
    );

    doc.save(`boleta-${empresa.serie}-${order.order_number}.pdf`);
};

/* =========================
   🧾 FACTURA EMPRESARIAL 🔥
========================= */
const generarFactura = (order: any, payload: any) => {
    const doc = new jsPDF();

    const cliente = payload.cliente;
    const productos = payload.productos;
    const pago = payload.pago;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("MI EMPRESA SAC", 10, 10);

    doc.setFont("helvetica", "normal");
    doc.text("RUC: 20123456789", 10, 15);
    doc.text("Dirección: Lima - Perú", 10, 20);

    doc.rect(140, 10, 60, 25);

    doc.setFont("helvetica", "bold");
    doc.text("FACTURA ELECTRÓNICA", 142, 16);
    doc.text(`F001-${order.order_number}`, 142, 22);

    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), 142, 28);

    doc.rect(10, 35, 190, 25);

    doc.text(`Cliente: ${cliente.name}`, 12, 42);
    doc.text(`RUC/DNI: ${cliente.dni || "-"}`, 12, 48);
    doc.text(`Teléfono: ${cliente.phoneWithPrefix}`, 12, 54);

    let y = 70;

    doc.setFont("helvetica", "bold");
    doc.text("Item", 12, y);
    doc.text("Descripción", 30, y);
    doc.text("Cant", 120, y);
    doc.text("V.Unit", 140, y);
    doc.text("Total", 190, y, { align: "right" });

    doc.setFont("helvetica", "normal");
    y += 5;

    const maxWidth = 50;
    let index = 1;

    const drawRow = (desc: string, qty: number, total: number) => {
        const unit = total / qty;
        const lines = doc.splitTextToSize(desc, maxWidth);

        doc.text(String(index++), 12, y);
        doc.text(lines, 30, y);

        doc.text(qty.toFixed(2), 125, y, { align: "right" });
        doc.text(unit.toFixed(2), 155, y, { align: "right" });
        doc.text(total.toFixed(2), 190, y, { align: "right" });

        y += lines.length * 5;
    };

    drawRow(
        productos.base.name,
        Number(productos.base.quantity),
        Number(productos.base.total)
    );

    productos.upsells.forEach((p: any) => {
        drawRow(p.title, Number(p.quantity), Number(p.total));
    });

    doc.rect(120, y + 5, 80, 40);

    const total = pago.totalFinal;

    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 122, y + 20);
    doc.text(total.toFixed(2), 195, y + 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.text(`SON: ${numeroALetras(total)} SOLES`, 10, y + 55);

    doc.save(`factura-${order.order_number}.pdf`);
};

/* =========================
   NUMERO A LETRAS
========================= */
const numeroALetras = (num: number) => {
    const entero = Math.floor(num);
    const decimales = Math.round((num - entero) * 100);

    return `${entero} CON ${decimales
        .toString()
        .padStart(2, "0")}/100`;
};