export type MessageType = "lima" | "provincia";

interface BuildMessageParams {
    order: any;
    dni: string;
    phone: string;
    extraProducts: any[];
    total: number;
}

export const buildMessage = ({
    order,
    dni,
    phone,
    extraProducts,
    total,
}: BuildMessageParams, type: MessageType): string => {

    const productoBase = order.product?.name || "Producto";
    const cantidadBase = order.product?.quantity || 1;

    /* =========================
       PRODUCTOS
    ========================= */
    const extraText = extraProducts.map((p) => p.title).join(" - ");

    const extraQty = extraProducts
        .map((p) => `${p.quantity} ${p.title}`)
        .join(" - ");

    const productosFinal = extraText
        ? `${productoBase} - ${extraText}`
        : productoBase;

    const cantidadFinal = extraQty
        ? `${cantidadBase} ${productoBase} - ${extraQty}`
        : `${cantidadBase} ${productoBase}`;

    /* =========================
       DATOS
    ========================= */
    const direccion = `${order.customer?.city || ""}, ${order.customer?.province || ""
        }, ${order.customer?.district || ""}`;

    const telefono = `+51${phone}`;

    const totalFormatted = total.toFixed(2);

    /* =========================
       MENSAJES
    ========================= */
    if (type === "provincia") {
        return `¡Hola soy Marcia Meza García DNI ${dni}! 🙌 

Gracias por tu pedido:
📦 Producto: ${productosFinal}
🔢 Cantidad: ${cantidadFinal}
💵 Total: S/. ${totalFormatted}

📍 Dirección: ${direccion} 🗺️
📞 Teléfono: ${telefono}

Estoy a la espera de tu confirmación ✨
¡Gracias por confiar en nosotros!`;
    }

    return `¡Hola ${dni}! 🙌 Te saluda Gaela, soy del equipo de Velure.es ❤

Gracias por tu pedido:
📦 Producto: ${productosFinal}
🔢 Cantidad: ${cantidadFinal}
💵 Total: S/ ${totalFormatted}

📍 Dirección: ${direccion} 🗺️

El delivery sería para el día HOY de 10 am a 6 pm, el motorizado se comunicará con usted para coordinar 🚚

En caso tengas alguna duda me comentas por este medio 🤝 estaré atenta a ayudarte👇`;
};

/* =========================
   COPY DIRECTO 🔥
========================= */
export const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
};