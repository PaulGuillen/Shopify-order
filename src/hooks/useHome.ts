import { useEffect, useRef, useState } from "react";
import { getShalomAgencies } from "../services/homeService";

const STORAGE_KEY = "agencies_cache";

export const useAgencies = () => {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loadingAgencies, setLoadingAgencies] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const hasFetched = useRef(false); // 👈 clave

    const fetchAgencies = async () => {
        try {
            setLoadingAgencies(true);

            const data = await getShalomAgencies();

            setAgencies(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAgencies(false);
            setHasLoaded(true);
        }
    };

    useEffect(() => {
        const cache = localStorage.getItem(STORAGE_KEY);

        if (cache) {
            setAgencies(JSON.parse(cache));
        }

        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchAgencies();
        }
    }, []);

    return {
        agencies,
        loadingAgencies,
        hasLoaded,
    };
};