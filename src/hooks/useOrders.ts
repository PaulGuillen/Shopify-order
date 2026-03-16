import { useEffect, useRef, useState } from "react";
import { assignOrder, fetchOrders, getAdvisorOrders } from "../services/orderService";
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

export const useAdvisorOrders = (
    advisorId: string,
    shop: string,
    activeTab: string
) => {
    const [advisorOrders, setAdvisorOrders] = useState<any[]>([]);
    const [loadingAdvisor, setLoadingAdvisor] = useState(false);

    useEffect(() => {
        if (activeTab !== "mis_pedidos") return;

        setLoadingAdvisor(true);

        getAdvisorOrders(advisorId, shop)
            .then((data) => {
                setAdvisorOrders(data || []);
            })
            .catch(() => {
                setAdvisorOrders([]);
            })
            .finally(() => {
                setLoadingAdvisor(false);
            });
    }, [advisorId, shop, activeTab]);

    return { advisorOrders, loadingAdvisor };
};

export const useAssignOrder = () => {
    const [loadingAssign, setLoadingAssign] = useState(false);

    const handleAssignOrder = async (order: any) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const advisor = {
            userId: user.userId,
            email: user.email,
            shop: user.shop,
        };

        setLoadingAssign(true);

        try {
            await assignOrder(order, advisor);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setLoadingAssign(false);
        }
    };

    return { handleAssignOrder, loadingAssign };
};