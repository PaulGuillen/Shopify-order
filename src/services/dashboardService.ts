const API = import.meta.env.VITE_API_URL;

export const getDashboard = async (shop: string) => {
    const res = await fetch(`${API}/dashboard/${shop}`);
    return res.json();
};

export const getAnalytics = async (
    shop: string,
    groupBy: string,
    range: number
) => {
    const res = await fetch(
        `${API}/dashboard/analytics/${shop}?groupBy=${groupBy}&range=${range}`
    );
    return res.json();
};