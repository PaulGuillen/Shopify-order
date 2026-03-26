import "./../../styles/components/orders/ordersFilters.css";

interface Props {
  loadOrders: (status: string) => void;
  counts: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  activeCourier: string;
  setActiveCourier: (v: string) => void;

  activeRegion: string;
  setActiveRegion: (v: string) => void;

  orders: any[];
}

const statusMap: Record<string, string> = {
  "Todos": "all",
  "Sin Asignar": "unassigned",
  "Por Contactar": "to_contact",
  "Contactado": "contacted",
  "Confirmado": "confirmed",
  "Enviado": "shipped",
  "Entregado": "delivered",
  "Cancelado": "cancelled",
  "No entregado": "not_delivered",
};

export default function OrdersFilters({
  loadOrders,
  counts,
  activeTab,
  setActiveTab,
  activeCourier,
  setActiveCourier,
  activeRegion,
  setActiveRegion,
  orders,
}: Props) {

  const handleClick = (label: string) => {
    setActiveTab(label);

    const status = statusMap[label];
    loadOrders(status);
  };

  return (
    <div className="filters-container">

      {/* FILA 1 */}
      <div className="filters-row chips-scroll">
        {[
          { label: "Todos", count: counts?.todos ?? 0 },
          { label: "Sin Asignar", count: counts?.sinAsignar ?? 0 },
          { label: "Por Contactar", count: counts?.porContactar ?? 0 },
          { label: "Contactado", count: counts?.contactado ?? 0 },
          { label: "Confirmado", count: counts?.confirmado ?? 0 },
          { label: "Enviado", count: counts?.enviado ?? 0 },
          { label: "Entregado", count: counts?.entregado ?? 0 },
          { label: "Cancelado", count: counts?.cancelado ?? 0 },
          { label: "No entregado", count: counts?.noEntregado ?? 0 },
        ].map((item) => (
          <button
            key={item.label}
            className={`chip ${activeTab === item.label ? "active" : ""}`}
            onClick={() => handleClick(item.label)}
          >
            {item.label} <span>{item.count}</span>
          </button>
        ))}
      </div>

      {/* FILA 2 */}
      <div className="filters-row chips-scroll">
        {["Todos", "Shalom", "Olva", "Zeus", "Otros"].map((item) => (
          <button
            key={item}
            className={`chip ${activeCourier === item ? "active" : ""}`}
            onClick={() => setActiveCourier(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* FILA 3 */}
      <div className="filters-row chips-scroll">
        {[
          { label: "Todos", count: orders.length },
          {
            label: "Lima",
            count: orders.filter(o => o.customer?.region_type === "Lima").length,
          },
          {
            label: "Provincias",
            count: orders.filter(o => o.customer?.region_type === "Provincia").length,
          },
          {
            label: "Sin Departamento",
            count: orders.filter(o => !o.customer?.department).length,
          },
        ].map((item) => (
          <button
            key={item.label}
            className={`chip ${activeRegion === item.label ? "active" : ""}`}
            onClick={() => setActiveRegion(item.label)}
          >
            {item.label} <span>{item.count}</span>
          </button>
        ))}
      </div>

      {/* FILA 4 */}
      <div className="filters-row inputs-row">
        <input placeholder="Nombre, teléfono, # pedido..." />
        <select><option>Fecha de pedido</option></select>
        <input type="date" />
        <select><option>Todos los estados</option></select>
        <select><option>Todos los pagos</option></select>
        <select><option>Vendedor</option></select>
      </div>

      {/* FILA 5 */}
      <div className="filters-row inputs-row">
        <select><option>Todas las tiendas</option></select>
        <select><option>Courier</option></select>
        <select><option>Producto</option></select>
      </div>

    </div>
  );
}