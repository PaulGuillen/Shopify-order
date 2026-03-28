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

  /* 🔥 NUEVOS */
  search: string;
  setSearch: (v: string) => void;

  selectedDate: string;
  setSelectedDate: (v: string) => void;

  selectedStatus: string;
  setSelectedStatus: (v: string) => void;

  selectedPayment: string;
  setSelectedPayment: (v: string) => void;

  selectedAdvisor: string;
  setSelectedAdvisor: (v: string) => void;

  selectedAdelanto: string;
  setSelectedAdelanto: (v: string) => void;

  /* FILA 5 */
  selectedShop: string;
  setSelectedShop: (v: string) => void;
  selectedCourierSelect: string;
  setSelectedCourierSelect: (v: string) => void;
  selectedProduct: string;
  setSelectedProduct: (v: string) => void;
}

const statusMap: Record<string, string> = {
  Todos: "all",
  "Sin Asignar": "unassigned",
  "Por Contactar": "to_contact",
  Contactado: "contacted",
  Confirmado: "confirmed",
  Enviado: "shipped",
  Entregado: "delivered",
  Cancelado: "cancelled",
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
  search,
  setSearch,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  selectedPayment,
  setSelectedPayment,
  selectedAdvisor,
  setSelectedAdvisor,
  selectedShop,
  setSelectedShop,
  selectedCourierSelect,
  setSelectedCourierSelect,
  selectedProduct,
  setSelectedProduct,
  selectedAdelanto,
  setSelectedAdelanto,

}: Props) {
  const handleClick = (label: string) => {
    setActiveTab(label);
    const status = statusMap[label];
    loadOrders(status);
  };

  const advisors = JSON.parse(localStorage.getItem("advisors_cache") || "[]");

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
        {[
          {
            label: "Todos",
            count: orders.length,
          },
          {
            label: "Shalom",
            count: orders.filter((o) => o.courier === "Shalom").length,
          },
          {
            label: "Olva",
            count: orders.filter((o) => o.courier === "Olva").length,
          },
          {
            label: "Zeus",
            count: orders.filter((o) => o.courier === "Zeus").length,
          },
          {
            label: "Otros",
            count: orders.filter(
              (o) => !["Shalom", "Olva", "Zeus"].includes(o.courier),
            ).length,
          },
        ].map((item) => (
          <button
            key={item.label}
            className={`chip ${activeCourier === item.label ? "active" : ""}`}
            onClick={() => setActiveCourier(item.label)}
          >
            {item.label} <span>{item.count}</span>
          </button>
        ))}
      </div>

      {/* FILA 3 */}
      <div className="filters-row chips-scroll">
        {[
          { label: "Todos", count: orders.length },
          {
            label: "Lima",
            count: orders.filter((o) => o.customer?.region_type === "Lima")
              .length,
          },
          {
            label: "Provincias",
            count: orders.filter((o) => o.customer?.region_type === "Provincia")
              .length,
          },
          {
            label: "Sin Departamento",
            count: orders.filter((o) => !o.customer?.department).length,
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

      {/* 🔥 FILA 4 FUNCIONAL */}
      <div className="filters-row inputs-row">
        {/* SEARCH */}
        <input
          placeholder="Nombre, teléfono, # pedido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FECHA */}

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* STATUS */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="unassigned">Sin Asignar</option>
          <option value="to_contact">Por Contactar</option>
          <option value="contacted">Contactado</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
          <option value="not_delivered">No entregado</option>
        </select>
        {/* PAGO */}
        <select
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
        >
          <option value="Todos">Todos los pagos</option>
          <option value="yape">Yape</option>
          <option value="plin">Plin</option>
          <option value="transferencia">Transferencia</option>
        </select>

        <select
          value={selectedAdelanto}
          onChange={(e) => setSelectedAdelanto(e.target.value)}
        >
          <option value="Todos">Adelanto</option>
          <option value="si">Con adelanto</option>
          <option value="no">Sin adelanto</option>
        </select>
        {/* VENDEDOR */}
        <select
          value={selectedAdvisor}
          onChange={(e) => setSelectedAdvisor(e.target.value)}
        >
          <option value="Todos">Vendedor</option>
          <option value="Sin asignar">Sin asignar</option>

          {advisors.map((a: any) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 FILA 5 FUNCIONAL */}
      <div className="filters-row inputs-row">
        {/* TIENDA */}
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="Todas">Todas las tiendas</option>

          {[...new Set(orders.map((o) => o.product?.vendor))].map(
            (shop: any) => (
              <option key={shop} value={shop}>
                {shop}
              </option>
            ),
          )}
        </select>

        {/* COURIER */}
        <select
          value={selectedCourierSelect}
          onChange={(e) => setSelectedCourierSelect(e.target.value)}
        >
          <option value="Todos">Courier</option>
          <option value="Shalom">Shalom</option>
          <option value="Olva">Olva</option>
          <option value="Zeus">Zeus</option>
          <option value="Otros">Otros</option>
        </select>

        {/* PRODUCTO */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="Todos">Producto</option>

          {[...new Set(orders.map((o) => o.product?.name))].map((p: any) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
