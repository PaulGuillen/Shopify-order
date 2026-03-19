const API = import.meta.env.VITE_API_URL;

export const getShalomAgencies = async () => {
    try {
        const res = await fetch(`${API}/shalom/agencies`);

        if (!res.ok) {
            throw new Error("Error obteniendo agencias");
        }

        const data = await res.json();

        return data.data;
    } catch (error) {
        console.error("Error en getShalomAgencies:", error);
        return [];
    }
};