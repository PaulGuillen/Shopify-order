import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";

export function useCustomers() {

    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Error cargando clientes", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        customers,
        loading
    };
}