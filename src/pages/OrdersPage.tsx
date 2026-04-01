import { useState, useMemo, useEffect, useRef } from "react";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilters from "../components/orders/OrdersFilters";
import OrdersTable from "../components/orders/OrdersTable";
import { useOrdersByFlow } from "../hooks/useOrders";
import OrdersPagination from "../components/orders/OrdersPagination";
import OrderSidePanel from "../components/orders/OrderSidePanel";
import { notify } from "../utils/notify";
import { useAdvisors, useAgencies, useProducts } from "../hooks/useHome";
import { useSettings } from "../hooks/useSettings";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedPayment, setSelectedPayment] = useState("Todos");
  const [selectedAdvisor, setSelectedAdvisor] = useState("Todos");
  const [selectedShop, setSelectedShop] = useState("Todas");
  const [selectedCourierSelect, setSelectedCourierSelect] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState("Todos");

  const [activeTab, setActiveTab] = useState("all");
  const [activeCourier, setActiveCourier] = useState("Todos");
  const [activeRegion, setActiveRegion] = useState("Todos");
  const [selectedAdelanto, setSelectedAdelanto] = useState("Todos");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;

  /* =========================
       HOOKS
    ========================= */

  const { agencies, loadingAgencies, hasLoaded } = useAgencies();

  const { products, loadingProducts, hasLoadedProducts } = useProducts(shop);

  const { advisors, loadingAdvisors, hasLoadedAdvisors } = useAdvisors(shop);

  const { statusConfig, couriers, loadingSettings, hasLoadedSettings } =
    useSettings(shop);

  const {
    orders = [],
    ordersBase = [],
    loadOrders,
    loading,
  } = useOrdersByFlow(shop);

  // 🔥 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const normalizedOrders = useMemo(() => {
    return orders.map((o) => {
      return {
        ...o,

        customer: {
          ...o.customer,
          name: o.dataUpdated?.cliente?.name || o.customer?.name,
          phone: o.dataUpdated?.cliente?.phoneWithPrefix || o.customer?.phone,
          region_type:
            o.dataUpdated?.cliente?.region || o.customer?.region_type,
          dni: o.dataUpdated?.cliente?.dni || o.customer?.dni,
        },

        courier: o.dataUpdated?.envio?.courier || o.courier || "Sin courier",

        agency: o.dataUpdated?.envio?.agency || o.agency,

        delivery_date:
          o.dataUpdated?.envio?.date || o.delivery_date || o.created_day,

        status: o.dataUpdated?.status || o.status,

        advisor: o.dataUpdated?.vendedor?.advisor || o.advisor,

        /* 💰 PAGO NORMALIZADO */
        total_price: o.dataUpdated?.pago?.totalOriginal || o.total_price, // 👉 TOTAL A COBRAR
        total_final: o.dataUpdated?.pago?.totalFinal, // 👉 SALDO
        adelanto: o.dataUpdated?.pago?.adelanto, // 👉 ADELANTO
        metodo: o.dataUpdated?.pago?.metodo, // 👉 MÉTODO
      };
    });
  }, [orders]);

  /* 🔥 DATA PAGINADA */
  const filteredOrders = useMemo(() => {
    return (
      normalizedOrders

        /* =========================
         COURIER (CHIPS)
      ========================= */
        .filter((o) => {
          if (activeCourier === "Todos") return true;

          const courier = o.courier;

          if (activeCourier === "Sin Asignar") {
            return !courier || !couriers.includes(courier);
          }

          return courier === activeCourier;
        })

        /* =========================
         REGION
      ========================= */
        .filter((o) => {
          if (activeRegion === "Todos") return true;

          if (activeRegion === "Provincias") {
            return o.customer?.region_type === "Provincia";
          }

          return o.customer?.region_type === activeRegion;
        })

        /* =========================
         🔍 SEARCH
      ========================= */
        .filter((o) => {
          if (!search) return true;

          const text = search.toLowerCase();

          return (
            o.customer?.name?.toLowerCase().includes(text) ||
            o.customer?.phone?.includes(text) ||
            String(o.order_number).includes(text)
          );
        })

        /* =========================
         📅 FECHA
      ========================= */
        .filter((o) => {
          if (!selectedDate) return true;

          return o.created_day === selectedDate;
        })

        /* =========================
         📊 STATUS
      ========================= */
        .filter((o) => {
          if (selectedStatus === "Todos") return true;

          return o.status === selectedStatus;
        })

        /* =========================
         💰 PAGO
      ========================= */
        .filter((o) => {
          if (selectedPayment === "Todos") return true;

          return o.dataUpdated?.pago?.metodo === selectedPayment;
        })

        /* =========================
         💰 Adelanto
      ========================= */
        .filter((o) => {
          if (selectedAdelanto === "Todos") return true;

          const adelanto = o.adelanto || 0;

          if (selectedAdelanto === "si") {
            return adelanto > 0;
          }

          if (selectedAdelanto === "no") {
            return adelanto === 0;
          }

          return true;
        })

        /* =========================
         👩‍💼 VENDEDOR
      ========================= */
        .filter((o) => {
          if (selectedAdvisor === "Todos") return true;

          if (selectedAdvisor === "Sin asignar") {
            return !o.advisor || o.advisor === "Sin asignar";
          }

          return o.advisor === selectedAdvisor;
        })

        /* =========================
         🏪 TIENDA (FILA 5)
      ========================= */
        .filter((o) => {
          if (selectedShop === "Todas") return true;

          return o.product?.vendor === selectedShop;
        })

        /* =========================
         🚚 COURIER SELECT (FILA 5)
      ========================= */
        .filter((o) => {
          if (selectedCourierSelect === "Todos") return true;

          const courier = o.courier;

          if (selectedCourierSelect === "Otros") {
            return !["Shalom", "Olva", "Zeus"].includes(courier);
          }

          return courier === selectedCourierSelect;
        })

        /* =========================
         📦 PRODUCTO (FILA 5)
      ========================= */
        .filter((o) => {
          if (selectedProduct === "Todos") return true;

          return o.product?.name === selectedProduct;
        })
    );
  }, [
    normalizedOrders,
    activeCourier,
    activeRegion,
    search,
    selectedDate,
    selectedStatus,
    selectedPayment,
    selectedAdvisor,
    selectedShop,
    selectedCourierSelect,
    selectedProduct,
    selectedAdelanto,
  ]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, rowsPerPage]);

  /* 🔥 TOTAL PÁGINAS */
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  /* 🔥 COUNTS */
  const counts = useMemo(
    () => ({
      todos: ordersBase.length,
      sinAsignar: ordersBase.filter((o) => o.status === "unassigned").length,
      porContactar: ordersBase.filter((o) => o.status === "to_contact").length,
      contactado: ordersBase.filter((o) => o.status === "contacted").length,
      confirmado: ordersBase.filter((o) => o.status === "confirmed").length,
      enviado: ordersBase.filter((o) => o.status === "shipped").length,
      entregado: ordersBase.filter((o) => o.status === "delivered").length,
      cancelado: ordersBase.filter((o) => o.status === "cancelled").length,
      noEntregado: ordersBase.filter((o) => o.status === "not_delivered")
        .length,
    }),
    [normalizedOrders],
  );

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  /* =========================
       TOAST CONTROL
    ========================= */

  const hasShownAgenciesToast = useRef(false);
  const hasShownProductsToast = useRef(false);
  const hasShownAdvisorsToast = useRef(false);
  const hasShownSettingsToast = useRef(false);

  // 🔥 AGENCIAS
  useEffect(() => {
    if (hasShownAgenciesToast.current) return;

    if (hasLoaded) {
      hasShownAgenciesToast.current = true;

      if (agencies.length > 0) {
        notify.success("Agencias cargadas correctamente 🚚");
      } else {
        notify.error("Error al cargar agencias ❌");
      }
    }
  }, [hasLoaded]);

  // 🔥 PRODUCTOS
  useEffect(() => {
    if (hasShownProductsToast.current) return;

    if (hasLoadedProducts) {
      hasShownProductsToast.current = true;

      if (products.length > 0) {
        notify.success("Productos cargados correctamente 🛍️");
      } else {
        notify.error("Error al cargar productos ❌");
      }
    }
  }, [hasLoadedProducts]);

  // 🔥 ASESORAS
  useEffect(() => {
    if (hasShownAdvisorsToast.current) return;

    if (hasLoadedAdvisors) {
      hasShownAdvisorsToast.current = true;

      if (advisors.length > 0) {
        notify.success("Asesoras cargadas correctamente 👩‍💼");
      } else {
        notify.error("Error al cargar asesoras ❌");
      }
    }
  }, [hasLoadedAdvisors]);

  // 🔥 SETTINGS
  useEffect(() => {
    if (hasShownSettingsToast.current) return;

    if (hasLoadedSettings) {
      hasShownSettingsToast.current = true;

      if (statusConfig && couriers) {
        notify.success("Configuraciones cargadas correctamente ⚙️");
      } else {
        notify.error("Error al cargar configuraciones ❌");
      }
    }
  }, [hasLoadedSettings]);

  return (
    <div className="orders-page">
      <OrdersHeader />

      <OrdersFilters
        loadOrders={loadOrders}
        counts={counts}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCourier={activeCourier}
        setActiveCourier={setActiveCourier}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        orders={normalizedOrders}
        search={search}
        setSearch={setSearch}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        selectedAdvisor={selectedAdvisor}
        setSelectedAdvisor={setSelectedAdvisor}
        selectedShop={selectedShop}
        setSelectedShop={setSelectedShop}
        selectedCourierSelect={selectedCourierSelect}
        setSelectedCourierSelect={setSelectedCourierSelect}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedAdelanto={selectedAdelanto}
        setSelectedAdelanto={setSelectedAdelanto}
        statusConfig={statusConfig}
        couriers={couriers}
      />

      <OrdersTable
        orders={paginatedOrders}
        loading={loading}
        onSelectOrder={(order) => setSelectedOrder(order)}
        statusConfig={statusConfig}
      />

      <OrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
      />

      {selectedOrder && (
        <OrderSidePanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => loadOrders()}
          statusConfig={statusConfig}
          couriers={couriers}
        />
      )}
    </div>
  );
}
