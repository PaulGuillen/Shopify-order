import { useEffect, useRef, useState } from "react";
import { getProducts, getShalomAgencies } from "../services/homeService";

const STORAGE_KEY = "agencies_cache";
const PRODUCTS_KEY = "products_cache";

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

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

export const useProducts = (shop: string) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [hasLoadedProducts, setHasLoadedProducts] = useState(false);

    const hasFetched = useRef(false);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);

            const data = await getProducts(shop);

            setProducts(data);

            // 🔥 GUARDAR CACHE
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProducts(false);
            setHasLoadedProducts(true);
        }
    };

    useEffect(() => {
        // 🔥 CACHE PRIMERO
        const cache = localStorage.getItem(PRODUCTS_KEY);

        if (cache) {
            setProducts(JSON.parse(cache));
        }

        // 🔥 FETCH SOLO UNA VEZ
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchProducts();
        }
    }, [shop]);

    return {
        products,
        loadingProducts,
        hasLoadedProducts,
    };
};

export const useAdvisors = (shop: string) => {
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [loadingAdvisors, setLoadingAdvisors] = useState(false);
    const [hasLoadedAdvisors, setHasLoadedAdvisors] = useState(false);

    const loaded = useRef(false);

    const STORAGE_KEY = `advisors_cache`;

    const loadAdvisors = async () => {
        try {
            setLoadingAdvisors(true);

            const API = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API}/users?shop=${shop}`);
            const data = await response.json();

            /* 🔥 FILTRAR SOLO ASESORAS */
            const advisorsOnly = data
                .filter((u: any) => u.role !== "admin")
                .map((u: any) => ({
                    id: u.id,
                    name: u.email.split("@")[0],
                    email: u.email,
                    status: u.active ? "activo" : "suspendido",
                }));

            setAdvisors(advisorsOnly);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(advisorsOnly));
        } catch (error) {
            console.error("Error loading advisors", error);

            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
                setAdvisors(JSON.parse(cached));
            }
        } finally {
            setLoadingAdvisors(false);
            setHasLoadedAdvisors(true);
        }
    };

    useEffect(() => {
        if (!shop || loaded.current) return;

        loaded.current = true;

        const cached = localStorage.getItem(STORAGE_KEY);

        if (cached) {
            setAdvisors(JSON.parse(cached));
        }

        loadAdvisors();
    }, [shop]);

    return {
        advisors,
        loadingAdvisors,
        hasLoadedAdvisors,
    };
};