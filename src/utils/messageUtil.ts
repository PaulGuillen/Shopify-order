export type MessageType = "lima" | "provincia";

interface BuildMessageParams {
    order: any;
    dni: string;
    phone: string;
    extraProducts: any[];
    total: number;
}

export const buildMessage = (
    {
        order,
        dni,
        phone,
        extraProducts,
        total,
    }: BuildMessageParams,
    type: MessageType
): string => {

    /* =========================
       🔥 NOMBRE (PRIORIDAD)
    ========================= */
    const nombre =
        order.dataUpdated?.cliente?.name ||
        order.customer?.name ||
        "Cliente";

    const productoBase = order.product?.name || "Producto";
    const cantidadBase = order.product?.quantity || 1;

    /* =========================
       PRODUCTOS
    ========================= */

    const productos = [
        `${productoBase}`,
        ...extraProducts.map((p) => p.title),
    ];

    const cantidades = [
        `${cantidadBase} ${productoBase}`,
        ...extraProducts.map((p) => `${p.quantity} ${p.title}`),
    ];

    const productosFinal = productos.join("\n• ");
    const cantidadFinal = cantidades.join("\n• ");

    /* =========================
       DATOS
    ========================= */

    const direccion = `${order.customer?.city || ""}, ${order.customer?.province || ""
        }, ${order.customer?.district || ""}`;

    const telefono = `+51${phone}`;
    const totalFormatted = total.toFixed(2);

    /* =========================
       VALIDACIÓN HORARIO LIMA
    ========================= */

    let deliveryText = "";

    if (type === "lima") {
        const now = new Date();
        const hour = now.getHours();

        const isNextDay = hour >= 18;

        deliveryText = isNextDay
            ? `El delivery será para el día *MAÑANA* entre 10:00 am y 9:00 pm 🚚`
            : `El delivery será para el día *HOY* entre 10:00 am y 9:00 pm 🚚`;
    }

    /* =========================
       MENSAJES
    ========================= */

    if (type === "provincia") {
        return `¡Hola ${nombre}! 🙌

Gracias por tu pedido:
──────────────
📦 *Producto:*
• ${productosFinal}

🔢 *Cantidad:*
• ${cantidadFinal}
──────────────

💵 *Total:* S/ ${totalFormatted}

📍 *Dirección:* ${direccion} 🗺️
📞 *Teléfono:* ${telefono}

Estoy a la espera de tu confirmación ✨  
¡Gracias por confiar en nosotros! 💖`;
    }

    return `¡Hola ${nombre}! 🙌  
Te saluda Gaela, soy del equipo de Velure.es ❤

Gracias por tu pedido:
──────────────
📦 *Producto:*
• ${productosFinal}

🔢 *Cantidad:*
• ${cantidadFinal}
──────────────

💵 *Total:* S/ ${totalFormatted}

📍 *Dirección:* ${direccion} 🗺️

${deliveryText}

En caso tengas alguna duda me comentas por este medio 🤝  
Estaré atenta a ayudarte 👇`;
};

/* =========================
   COPY DIRECTO 🔥
========================= */
export const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
};