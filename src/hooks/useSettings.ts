import { useEffect, useRef, useState } from "react";
import { getSettings, saveSettings } from "../services/settingsService";
import type { StatusConfig, StatusKey } from "../utils/StatusConfig";


/* =========================
   🔥 CONSTANTES
========================= */
const SETTINGS_KEY = "settings_cache";

/* =========================
   🔥 DEFAULTS (fallback)
========================= */
const DEFAULT_STATUS_CONFIG: StatusConfig = {
    unassigned: { label: "Sin asignar", color: "#9ca3af" },
    to_contact: { label: "Por contactar", color: "#facc15" },
    contacted: { label: "Contactado", color: "#22c55e" },
    confirmed: { label: "Confirmado", color: "#3b82f6" },
    shipped: { label: "Enviado", color: "#8b5cf6" },
    delivered: { label: "Entregado", color: "#10b981" },
    cancelled: { label: "Cancelado", color: "#ef4444" },
    not_delivered: { label: "No entregado", color: "#f97316" },
};

const DEFAULT_COURIERS = ["Shalom", "Olva", "Zeus"];

/* =========================
   🔥 HOOK
========================= */
export const useSettings = (shop: string) => {
    const [statusConfig, setStatusConfig] = useState<any>(
        DEFAULT_STATUS_CONFIG
    );
    const [couriers, setCouriers] = useState<string[]>(DEFAULT_COURIERS);
    const [loadingSettings, setLoadingSettings] = useState(false);
    const [hasLoadedSettings, setHasLoadedSettings] = useState(false);

    const hasFetched = useRef(false);

    /* =========================
       🔥 FETCH
    ========================= */
    const fetchSettings = async () => {
        try {
            setLoadingSettings(true);

            const data = await getSettings(shop);

            const finalStatus: StatusConfig = (Object.keys(
                DEFAULT_STATUS_CONFIG
            ) as StatusKey[]).reduce((acc, key) => {
                acc[key] = {
                    ...DEFAULT_STATUS_CONFIG[key], // mantiene color
                    ...(data?.statusConfig?.[key] || {}), // override label
                };
                return acc;
            }, {} as StatusConfig);

            const finalCouriers =
                data?.couriers?.length > 0
                    ? data.couriers
                    : DEFAULT_COURIERS;

            setStatusConfig(finalStatus);
            setCouriers(finalCouriers);

            // 🔥 CACHE
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify({
                    statusConfig: finalStatus,
                    couriers: finalCouriers
                })
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSettings(false);
            setHasLoadedSettings(true);
        }
    };

    /* =========================
       🔥 SAVE
    ========================= */
    const updateSettings = async () => {
        try {
            await saveSettings(shop, {
                statusConfig,
                couriers
            });

            // 🔥 actualizar cache
            localStorage.setItem(
                SETTINGS_KEY,
                JSON.stringify({
                    statusConfig,
                    couriers
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    /* =========================
       🔥 INIT
    ========================= */
    useEffect(() => {
        // 🔥 CACHE FIRST
        const cache = localStorage.getItem(SETTINGS_KEY);

        if (cache) {
            const parsed = JSON.parse(cache);
            setStatusConfig(parsed.statusConfig);
            setCouriers(parsed.couriers);
        }

        // 🔥 FETCH SOLO UNA VEZ
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchSettings();
        }
    }, [shop]);

    return {
        statusConfig,
        setStatusConfig,

        couriers,
        setCouriers,

        loadingSettings,
        hasLoadedSettings,

        loadSettings: fetchSettings,
        saveAllSettings: updateSettings
    };
};