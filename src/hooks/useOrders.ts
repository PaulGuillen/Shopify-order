import { useEffect, useRef, useState } from "react";
import { fetchOrders } from "../services/orderService";
import type { Order } from "../services/orderService";

export function useOrders(shop: string) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetched = useRef(false);

    useEffect(() => {
        if (!shop || fetched.current) return;

        fetched.current = true;

        const loadOrders = async () => {
            try {
                const data = await fetchOrders(shop);
                setOrders(data);
            } catch (err) {
                setError("Error cargando pedidos");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [shop]);

    return { orders, loading, error };
}
