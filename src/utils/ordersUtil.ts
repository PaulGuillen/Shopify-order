/* =========================
FORMAT DATE (SHOPIFY STYLE)
========================= */

export function formatShopifyDate(dateString: string) {

    const date = new Date(dateString);
    const now = new Date();

    const today = now.toLocaleDateString("es-PE");
    const yesterdayDate = new Date();
    yesterdayDate.setDate(now.getDate() - 1);

    const yesterday = yesterdayDate.toLocaleDateString("es-PE");

    const dateDay = date.toLocaleDateString("es-PE");

    const time = date.toLocaleTimeString("es-PE", {
        hour: "numeric",
        minute: "2-digit",
    });

    if (dateDay === today) {
        return `Hoy a las ${time}`;
    }

    if (dateDay === yesterday) {
        return `Ayer a las ${time}`;
    }

    const weekday = date.toLocaleDateString("es-PE", {
        weekday: "long",
    });

    return `${weekday} a las ${time}`;
}


/* =========================
PAYMENT LABEL
========================= */

export function paymentLabel(status: string) {
    switch (status) {
        case "paid":
            return "Pagado";

        case "pending":
            return "Pendiente";

        default:
            return status;
    }
}

/* =========================
FULFILLMENT LABEL
========================= */

export function fulfillmentLabel(status: string | null) {
    switch (status) {
        case "fulfilled":
            return "Preparado";

        case null:
            return "No preparado";

        default:
            return status;
    }
}

/* =========================
PAYMENT CSS CLASS
========================= */

export function paymentClass(status: string) {
    switch (status) {
        case "paid":
            return "status-paid";

        case "pending":
            return "status-pending";

        default:
            return "";
    }
}

/* =========================
FULFILLMENT CSS CLASS
========================= */

export function fulfillmentClass(status: string | null) {
    switch (status) {
        case "fulfilled":
            return "status-delivered";

        case null:
            return "status-confirm";

        default:
            return "";
    }
}

export function isToday(day: string) {
    const today = new Date().toISOString().slice(0, 10);
    return day === today;
}

export function isYesterday(day: string) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const y = yesterday.toISOString().slice(0, 10);

    return day === y;
}

export function isLast7Days(day: string) {
    const date = new Date(day);
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    return date >= last7;
}
