const API_URL = "http://localhost:4000";

export interface Order {
    order_id: number;
    order_number: number;

    created_day: string;

    financial_status: string;
    fulfillment_status: string | null;

    total_price: number;
    currency: string;

    customer: {
        name: string | null;
        phone: string | null;
        city: string | null;
        region_type: string | null;
    };

    product: {
        name: string;
        quantity: number;
    } | null;

    statuts: string | null;
}

export async function fetchOrders(shop: string): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders/orders-firebase/${shop}`);

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
        `${API_URL}/orders/advisor-orders/${advisorId}/${shop}`
    );

    if (!res.ok) {
        throw new Error("Error fetching advisor orders");
    }

    return res.json();
};

export const assignOrder = async (order: any, advisor: any) => {
    const res = await fetch(`${API_URL}/orders/assign-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            order,
            advisor,
        }),
    });

    if (!res.ok) {
        throw new Error("Error assigning order");
    }

    return res.json();
};