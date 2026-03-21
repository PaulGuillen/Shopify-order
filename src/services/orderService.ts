const API = import.meta.env.VITE_API_URL;

export interface Order {
    /* =============================
       🔥 FIREBASE DOC
    ============================== */

    docId: string;
    orderId: string;
    orderNumber: number;

    advisorId: string;
    advisorEmail: string;
    shop: string;

    status: string;

    assignedAt?: {
        _seconds: number;
        _nanoseconds: number;
    };

    /* =============================
       🔥 ORDER DATA (CORE)
    ============================== */

    orderData: {
        /* IDENTIDAD */
        id: string;
        order_id: number;
        order_number: number;
        confirmation: string;

        shopify_admin_id: string;

        /* FECHAS */
        created_at: string;
        created_day: string;
        created_month: string;

        created_timestamp: FirebaseTimestamp;
        updated_at: string;
        updated_timestamp: FirebaseTimestamp;

        /* ESTADO */
        financial_status: string;
        fulfillment_status: string | null;
        cancelled: boolean;

        status: string;

        /* PAGOS */
        currency: string;

        total_price: number;       // FINAL 🔥
        subtotal_price: number;    // SIN DESCUENTO
        total_discount: number;    // DESCUENTO

        payment_gateway: string | null;

        /* 🔥 PRICING (CLAVE) */
        pricing: {
            has_discount: boolean;
            discount_amount: number;
            original_total: number;
            final_total: number;
            promo_type: string | null;
        };

        /* 👤 CUSTOMER */
        customer: {
            name: string | null;
            phone: string | null;

            department: string | null;
            city: string | null;
            district: string | null;

            address: string | null;
            region_type: string | null;

            dni: string | null;
        };

        /* 📦 PRODUCT PRINCIPAL */
        product: {
            id: number;
            name: string;
            quantity: number;
            price: number;
            vendor: string;

            total_line_price: number;
            discount_allocated: number;
        } | null;

        /* 📦 MULTI ITEMS */
        items: Array<{
            id: number;
            name: string;
            quantity: number;
            price: number;

            total: number;
            discount: number;
        }>;

        /* 📊 UTM */
        utm: {
            source: string | null;
            medium: string | null;
            campaign: string | null;
            term: string | null;
            content: string | null;
        };

        /* METADATA */
        source: string;
        tags: string | null;

        /* DEBUG */
        raw_min: {
            total_price: string;
            total_discounts: string;
            total_line_items_price: string;
        };
    };
}

export interface FirebaseTimestamp {
    _seconds: number;
    _nanoseconds: number;
}
export async function fetchOrders(shop: string): Promise<Order[]> {
    const response = await fetch(`${API}/orders/orders-firebase/${shop}`);

    if (!response.ok) {
        throw new Error("Error obteniendo pedidos");
    }

    const data = await response.json();

    return data.orders;
}

export const getAdvisorOrders = async (
    advisorId: string,
    shop: string
) => {
    const res = await fetch(
        `${API}/orders/advisor-orders/${advisorId}/${shop}`
    );

    if (!res.ok) {
        throw new Error("Error fetching advisor orders");
    }

    return res.json();
};

export const assignOrder = async (order: any, advisor: any) => {
    const res = await fetch(`${API}/orders/assign-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            order,
            advisor,
        }),
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.message);
    }

    return data;
};

export const updateOrderStatus = async (
    order: any,
    shop: string,
    action: string,
    user: any,
    newData?: any // 🔥 NUEVO
) => {
    const res = await fetch(`${API}/orders/order-to-deliver`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            order,
            shop,
            action,
            user,
            newData,
        }),
    });

    return await res.json();
};

export const getAdvisorOrdersContacted = async (
    activeTab: string,
    advisorId: string,
    shop: string
) => {
    try {
        const url = new URL(`${API}/orders/orders-by-status`);

        url.searchParams.append("status", activeTab);
        url.searchParams.append("shop", shop);

        if (advisorId) {
            url.searchParams.append("advisorId", advisorId);
        }

        const res = await fetch(url.toString());

        if (!res.ok) {
            throw new Error("Error fetching advisor orders");
        }

        return res.json();
    } catch (error) {
        console.error("Error service contacted:", error);
        return [];
    }
};