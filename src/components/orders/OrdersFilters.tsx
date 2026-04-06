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

  selectedShop: string;
  setSelectedShop: (v: string) => void;

  selectedCourierSelect: string;
  setSelectedCourierSelect: (v: string) => void;

  selectedProduct: string;
  setSelectedProduct: (v: string) => void;

  /* 🔥 NUEVO */
  statusConfig: any;
  couriers: string[];
}

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
  statusConfig,
  couriers,
}: Props) {
  /* =========================
     🔥 STATUS DINÁMICO
  ========================= */
  const statusEntries = [
    { key: "all", label: "Todos" },
    {
      key: "unassigned",
      label: statusConfig?.unassigned?.label || "Sin Asignar",
    },
    {
      key: "to_contact",
      label: statusConfig?.to_contact?.label || "Por Contactar",
    },
    { key: "contacted", label: statusConfig?.contacted?.label || "Contactado" },
    { key: "confirmed", label: statusConfig?.confirmed?.label || "Confirmado" },
    { key: "shipped", label: statusConfig?.shipped?.label || "Enviado" },
    { key: "delivered", label: statusConfig?.delivered?.label || "Entregado" },
    { key: "cancelled", label: statusConfig?.cancelled?.label || "Cancelado" },
    {
      key: "not_delivered",
      label: statusConfig?.not_delivered?.label || "No entregado",
    },
  ];

  /* =========================
     🔥 COUNTS
  ========================= */
  const getCount = (key: string) => {
    switch (key) {
      case "all":
        return counts?.todos ?? 0;
      case "unassigned":
        return counts?.sinAsignar ?? 0;
      case "to_contact":
        return counts?.porContactar ?? 0;
      case "contacted":
        return counts?.contactado ?? 0;
      case "confirmed":
        return counts?.confirmado ?? 0;
      case "shipped":
        return counts?.enviado ?? 0;
      case "delivered":
        return counts?.entregado ?? 0;
      case "cancelled":
        return counts?.cancelado ?? 0;
      case "not_delivered":
        return counts?.noEntregado ?? 0;
      default:
        return 0;
    }
  };

  /* =========================
     🔥 CLICK STATUS
  ========================= */
  const handleClick = (item: any) => {
    setActiveTab(item.key);
    loadOrders(item.key);
  };
  const normalize = (v: string) => (v || "").trim().toLowerCase();

  const advisors = JSON.parse(localStorage.getItem("advisors_cache") || "[]");

  return (
    <div className="filters-container">
      {/* =========================
         🔥 FILA 1 STATUS
      ========================= */}
      <div className="filters-row chips-scroll">
        {statusEntries.map((item) => (
          <button
            key={item.key}
            className={`chip ${activeTab === item.key ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            {item.label} <span>{getCount(item.key)}</span>
          </button>
        ))}
      </div>

      {/* =========================
         🔥 FILA 2 COURIERS
      ========================= */}
      <div className="filters-row chips-scroll">
        {[
          { label: "Todos", count: orders.length },

          // 🔥 SIN ASIGNAR (después de Todos)
          {
            label: "Sin Asignar",
            count: orders.filter(
              (o) =>
                !o.courier ||
                !couriers.map(normalize).includes(normalize(o.courier)),
            ).length,
          },

          // 🔥 COURiers DINÁMICOS
          ...couriers.map((c) => ({
            label: c,
            count: orders.filter((o) => normalize(o.courier) === normalize(c))
              .length,
          })),
        ].map((item) => (
          <button
            key={item.label}
            className={`chip ${normalize(activeCourier) === normalize(item.label) ? "active" : ""}`}
            onClick={() => setActiveCourier(item.label)}
          >
            {item.label} <span>{item.count}</span>
          </button>
        ))}
      </div>

      {/* =========================
         🔥 FILA 3 REGIÓN
      ========================= */}
      <div className="filters-row chips-scroll">
        {[
          { label: "Todos", count: orders.length },
          {
            label: "Lima",
            count: orders.filter(
              (o) => normalize(o.customer?.region_type) === "lima",
            ).length,
          },
          {
            label: "Provincias",
            count: orders.filter(
              (o) => normalize(o.customer?.region_type) === "provincia",
            ).length,
          },
          {
            label: "Sin Departamento",
            count: orders.filter(
              (o) =>
                !o.customer?.department || o.customer?.department.trim() === "",
            ).length,
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

      {/* =========================
         🔥 FILA 4 INPUTS
      ========================= */}
      <div className="filters-row inputs-row">
        <input
          placeholder="Nombre, teléfono, # pedido..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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

          {statusEntries
            .filter((s) => s.key !== "all")
            .map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
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

        {/* ADELANTO */}
        <select
          value={selectedAdelanto}
          onChange={(e) => setSelectedAdelanto(e.target.value)}
        >
          <option value="Todos">Adelanto</option>
          <option value="por_cobrar">Por cobrar (activo)</option>
          <option value="adelanto_activo">Adelanto (activo)</option>
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

      {/* =========================
         🔥 FILA 5
      ========================= */}
      <div className="filters-row inputs-row">
        {/* TIENDA */}
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="Todas">Todas las tiendas</option>

          {[
            ...new Set(
              orders
                .map((o) => o.product?.vendor)
                .filter((v) => v && v.trim() !== ""), // 🔥 LIMPIEZA
            ),
          ].map((shop: any) => (
            <option key={shop} value={shop}>
              {shop}
            </option>
          ))}
        </select>

        {/* COURIER */}
        <select
          value={selectedCourierSelect}
          onChange={(e) => setSelectedCourierSelect(e.target.value)}
        >
          <option value="Todos">Courier</option>

          <option value="Otros">Sin Asignar</option>
          {couriers.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* PRODUCTO */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="Todos">Producto</option>

          {[
            ...new Set(
              orders
                .flatMap((o) => {
                  const base = o.dataUpdated?.productos?.base;
                  const upsells = o.dataUpdated?.productos?.upsells || [];

                  return [
                    o.product?.name,
                    base?.name,
                    ...upsells.map((u: any) => u.title || u.name),
                  ];
                })
                .filter((p) => p && p.trim() !== ""),
            ),
          ].map((p: any) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
