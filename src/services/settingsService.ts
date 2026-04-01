const API_URL = import.meta.env.VITE_API_URL;

export const getSettings = async (shop: string) => {
    const res = await fetch(`${API_URL}/settings/${shop}`);

    if (!res.ok) throw new Error("Error obteniendo settings");

    return res.json();
};

export const saveSettings = async (
    shop: string,
    payload: {
        statusConfig?: any;
        couriers?: string[];
    }
) => {
    const res = await fetch(`${API_URL}/settings/${shop}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error guardando settings");

    return res.json();
};