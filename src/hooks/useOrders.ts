import { useEffect, useRef, useState } from "react";
import { assignOrder, fetchOrders, getAdvisorOrders, getAdvisorOrdersContacted, updateOrderStatus } from "../services/orderService";
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
            return { success: true };
        } catch (error: any) {
            console.error(error);

            return {
                success: false,
                message: error.message,
            };
        } finally {
            setLoadingAssign(false);
        }
    };

    return { handleAssignOrder, loadingAssign };
};

export const useUpdateOrderStatus = () => {
    const [loadingStatus, setLoadingStatus] = useState(false);

    const handleUpdateStatus = async (
        order: any,
        action: string
    ): Promise<boolean> => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        try {
            setLoadingStatus(true);

            const result = await updateOrderStatus(
                order,
                user.shop,
                action,
                user
            );

            if (!result.success) {
                alert(result.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error updating status:", error);
            return false;
        } finally {
            setLoadingStatus(false);
        }
    };

    return {
        handleUpdateStatus,
        loadingStatus,
    };
};

export const useAdvisorOrdersContacted = (
    advisorId: string,
    shop: string,
    activeTab: string
) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab !== "contactado") return;
        if (!advisorId || !shop) return;

        const fetchData = async () => {
            setLoading(true);

            const data = await getAdvisorOrdersContacted(activeTab, advisorId, shop);

            setOrders(data);

            setLoading(false);
        };

        fetchData();
    }, [advisorId, shop, activeTab]);

    return {
        advisorOrdersContacted: orders,
        loadingContacted: loading,
    };
};