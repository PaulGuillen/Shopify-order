import { useMemo, useState } from "react";
import { useOrdersByFlow } from "../hooks/useOrders";
import "../styles/pages/shipmentsPage.css";

const VALID_STATUSES = ["confirmed", "shipped", "delivered"];

const REGION_FILTERS = [
  { key: "Lima", label: "Lima" },
  { key: "Provincias", label: "Provincias" },
];

const normalize = (value: string) => (value || "").trim().toLowerCase();

const getDisplayValue = (
  value: any,
  fallback: string,
  preferredKeys: string[] = [],
) => {
  if (value == null || value === "") return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    for (const key of preferredKeys) {
      const candidate = value?.[key];

      if (typeof candidate === "string" && candidate.trim()) {
        return candidate;
      }
    }

    if (
      typeof value?.name === "string" &&
      value.name.trim() &&
      typeof value?.address === "string" &&
      value.address.trim()
    ) {
      return `${value.name} - ${value.address}`;
    }

    if (typeof value?.name === "string" && value.name.trim()) {
      return value.name;
    }

    if (typeof value?.provider === "string" && value.provider.trim()) {
      return value.provider;
    }
  }

  return fallback;
};

const getRegionType = (order: any) =>
  normalize(
    order?.dataUpdated?.cliente?.region || order?.customer?.region_type || "",
  );

const getCustomerName = (order: any) =>
  getDisplayValue(
    order?.dataUpdated?.cliente?.name || order?.customer?.name,
    "-",
  );

const getCustomerPhone = (order: any) =>
  getDisplayValue(
    order?.dataUpdated?.cliente?.phoneWithPrefix ||
      order?.dataUpdated?.cliente?.phone ||
      order?.customer?.phone,
    "-",
  );

const getAgency = (order: any) =>
  getDisplayValue(
    order?.dataUpdated?.envio?.agency || order?.agency,
    "Sin agencia",
    ["name", "address", "city", "provider"],
  );

const getCourier = (order: any) =>
  getDisplayValue(
    order?.dataUpdated?.envio?.courier || order?.courier,
    "Sin courier",
    ["provider", "name"],
  );

const getDeliveryDate = (order: any) =>
  getDisplayValue(
    order?.dataUpdated?.envio?.date || order?.delivery_date || order?.created_day,
    "-",
  );

const formatStatus = (status: string) => {
  const labels: Record<string, string> = {
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregado",
  };

  return labels[status] || status;
};

export default function AgencyShipmentsPage() {
  const [activeRegion, setActiveRegion] = useState("Lima");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;
  const { orders = [], loading } = useOrdersByFlow(shop);

  const shipmentOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = normalize(order?.dataUpdated?.status || order?.status);

      if (!VALID_STATUSES.includes(status)) return false;

      const region = getRegionType(order);

      if (activeRegion === "Lima") {
        return region === "lima";
      }

      return region === "provincia" || region === "provincias";
    });
  }, [activeRegion, orders]);

  const counters = useMemo(() => {
    const base = orders.filter((order) => {
      const status = normalize(order?.dataUpdated?.status || order?.status);
      return VALID_STATUSES.includes(status);
    });

    return {
      Lima: base.filter((order) => getRegionType(order) === "lima").length,
      Provincias: base.filter((order) => {
        const region = getRegionType(order);
        return region === "provincia" || region === "provincias";
      }).length,
    };
  }, [orders]);

  return (
    <div className="shipments-page">
      <div className="shipments-header">
        <div>
          <h1>Agencias</h1>
          <p>
            Pedidos confirmados, enviados y entregados listos para revisar por
            zona.
          </p>
        </div>
      </div>

      <div className="shipments-filters">
        <div className="shipments-chips">
          {REGION_FILTERS.map((region) => (
            <button
              key={region.key}
              className={`shipments-chip ${
                activeRegion === region.key ? "active" : ""
              }`}
              onClick={() => setActiveRegion(region.key)}
            >
              {region.label}
              <span>{counters[region.key as keyof typeof counters] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="shipments-table">
        <div className="shipments-table-header">
          <div>Pedido</div>
          <div>Cliente</div>
          <div>Contacto</div>
          <div>Courier</div>
          <div>Agencia</div>
          <div>Fecha</div>
          <div>Estado</div>
        </div>

        {loading ? (
          <div className="shipments-empty">Cargando pedidos...</div>
        ) : shipmentOrders.length === 0 ? (
          <div className="shipments-empty">
            No hay pedidos para {activeRegion.toLowerCase()} en esos estados.
          </div>
        ) : (
          shipmentOrders.map((order) => {
            const status = normalize(order?.dataUpdated?.status || order?.status);

            return (
              <div key={order.id} className="shipments-row">
                <div className="shipments-order">
                  <strong>#{order.order_number}</strong>
                </div>

                <div>{getCustomerName(order)}</div>
                <div>{getCustomerPhone(order)}</div>
                <div>{getCourier(order)}</div>
                <div>{getAgency(order)}</div>
                <div>{getDeliveryDate(order)}</div>
                <div>
                  <span className={`shipments-status ${status}`}>
                    {formatStatus(status)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
