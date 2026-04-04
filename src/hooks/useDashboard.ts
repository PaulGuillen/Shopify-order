import { useEffect, useRef, useState } from "react";
import { getDashboard, getAnalytics } from "../services/dashboardService";

export const useDashboard = (shop: string) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);

    const loaded = useRef(false); // 🔥 CLAVE

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await getDashboard(shop);
            setSummary(data);
        } catch (e) {
            console.error("❌ dashboard error", e);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async (groupBy = "month", range = 30) => {
        try {
            const data = await getAnalytics(shop, groupBy, range);
            setAnalytics(data);
        } catch (e) {
            console.error("❌ analytics error", e);
        }
    };

    useEffect(() => {
        if (!shop || loaded.current) return;

        loaded.current = true;

        loadDashboard();
        loadAnalytics("month", 30);
    }, [shop]);

    return {
        summary,
        analytics,
        loading,
        reloadAnalytics: loadAnalytics,
    };
};