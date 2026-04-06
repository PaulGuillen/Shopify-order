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
  const normalize = (v: string) => (v || "").trim().toLowerCase();

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
          department:
            o.dataUpdated?.cliente?.department || o.customer?.department,

          district: o.dataUpdated?.cliente?.district || o.customer?.district,
        },

        courier: o.dataUpdated?.envio?.courier || o.courier || null,

        agency: o.dataUpdated?.envio?.agency || o.agency,

        delivery_date:
          o.dataUpdated?.envio?.date || o.delivery_date || o.created_day,

        status: o.dataUpdated?.status || o.status,

        advisor: o.dataUpdated?.vendedor?.advisor || o.advisor,

        /* 💰 PAGO NORMALIZADO */
        total_price: o.dataUpdated?.pago?.totalOriginal || o.total_price,
        total_final: o.dataUpdated?.pago?.totalFinal,
        adelanto: o.dataUpdated?.pago?.adelanto,
        metodo: o.dataUpdated?.pago?.metodo,

        /* 🔥 NUEVO */
        observacion: o.dataUpdated?.observacion || "",
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

          const courier = normalize(o.courier);
          const selected = normalize(activeCourier);

          if (selected === "sin asignar") {
            return !courier || !couriers.map(normalize).includes(courier);
          }

          return courier === selected;
        })

        /* =========================
         REGION
      ========================= */
        .filter((o) => {
          if (activeRegion === "Todos") return true;

          const region = normalize(o.customer?.region_type);

          if (activeRegion === "Provincias") {
            return region === "provincia";
          }

          return region === normalize(activeRegion);
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

          const created = o.created_day;

          const updatedRaw = o?.dataUpdated?.meta?.updatedAtFormatted;

          let updated = null;

          if (updatedRaw) {
            const date = new Date(updatedRaw);
            if (!isNaN(date.getTime())) {
              updated = date.toISOString().slice(0, 10);
            }
          }

          return [created, updated].includes(selectedDate);
        })

        /* =========================
            📊 STATUS
          ========================= */
        .filter((o) => {
          if (selectedStatus === "Todos") return true;

          return normalize(o.status) === normalize(selectedStatus);
        })

        /* =========================
            💰 PAGO
          ========================= */
        .filter((o) => {
          if (selectedPayment === "Todos") return true;

          const method = normalize(
            o.dataUpdated?.pago?.metodo || o.payment_gateway,
          );

          if (Array.isArray(selectedPayment)) {
            return selectedPayment.map(normalize).includes(method);
          }

          return method === normalize(selectedPayment);
        })

        /* =========================
            💰 Adelanto
          ========================= */
        .filter((o) => {
          if (selectedAdelanto === "Todos") return true;

          const pago = o.dataUpdated?.pago;

          const adelanto = pago?.adelanto || 0;
          const totalFinal = pago?.totalFinal;

          const estadosActivos = ["confirmed", "shipped", "delivered"];
          const status = (o.status || "").toLowerCase();

          /* =========================
              💰 CON ADELANTO
            ========================= */
          if (selectedAdelanto === "si") {
            return adelanto > 0;
          }

          /* =========================
              💰 SIN ADELANTO
            ========================= */
          if (selectedAdelanto === "no") {
            return adelanto === 0;
          }

          /* =========================
              🔥 POR COBRAR (CORRECTO)
            ========================= */
          if (selectedAdelanto === "por_cobrar") {
            return (
              estadosActivos.includes(status) &&
              totalFinal != null && // 🔥 existe
              totalFinal > 0 // 🔥 hay deuda
            );
          }

          if (selectedAdelanto === "adelanto_activo") {
            return (
              adelanto > 0 && estadosActivos.includes(status) // 🔥 solo en estos estados
            );
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
          if (activeCourier !== "Todos") return true;
          if (selectedCourierSelect === "Todos") return true;

          const courier = o.courier;

          if (selectedCourierSelect === "Otros") {
            return !couriers.map(normalize).includes(normalize(courier));
          }

          return normalize(courier) === normalize(selectedCourierSelect);
        })

        /* =========================
            📦 PRODUCTO (FILA 5)
          ========================= */
        .filter((o) => {
          if (selectedProduct === "Todos") return true;

          const base = o.dataUpdated?.productos?.base;
          const upsells = o.dataUpdated?.productos?.upsells || [];

          const allProducts = [
            o.product?.name,
            base?.name,
            ...upsells.map((u: any) => u.title || u.name),
          ];

          return allProducts.some(
            (p) => normalize(p) === normalize(selectedProduct),
          );
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

  useEffect(() => {
    if (!orders?.length) return; // 🔥 CLAVE
    
    const applyFiltersFromDashboard = () => {
      const raw = localStorage.getItem("orders_filters");
      if (!raw) return;

      const filters = JSON.parse(raw);

      console.log("🔥 APPLY FILTERS FROM DASHBOARD:", filters);

      // 🔥 ADELANTO
      if (filters.adelanto) {
        setSelectedAdelanto(filters.adelanto);
      }

      // 🔥 PAYMENT (puede ser array)
      if (filters.payment) {
        if (Array.isArray(filters.payment)) {
          // 🔥 caso múltiples → puedes manejar "multi" o default
          setSelectedPayment("Todos"); // opcional
        } else {
          setSelectedPayment(filters.payment);
        }
      }

      // 🔥 limpiar después de usar
      localStorage.removeItem("orders_filters");
    };

    // 🔥 ejecutar al entrar
    applyFiltersFromDashboard();

    // 🔥 escuchar cambios
    window.addEventListener("orders-filters-update", applyFiltersFromDashboard);

    return () => {
      window.removeEventListener(
        "orders-filters-update",
        applyFiltersFromDashboard,
      );
    };
  }, []);

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

  const resetFilters = () => {
    setActiveTab("all");
    setActiveCourier("Todos");
    setActiveRegion("Todos");

    setSearch("");
    setSelectedDate("");
    setSelectedStatus("Todos");
    setSelectedPayment("Todos");
    setSelectedAdvisor("Todos");
    setSelectedShop("Todas");
    setSelectedCourierSelect("Todos");
    setSelectedProduct("Todos");
    setSelectedAdelanto("Todos");

    setCurrentPage(1);
  };

  const handleSuccess = () => {
    resetFilters();
    loadOrders("all");
    setSelectedOrder(null);
  };

  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleCreateOrder = () => {
    const lastOrder = normalizedOrders[0]; // ya vienen ordenados DESC

    const lastNumber = lastOrder?.order_number || 0;

    let newOrderNumber = lastNumber + 1;

    // 🔥 si supera cierto rango → random
    if (newOrderNumber > 9999) {
      newOrderNumber = generateOrderNumber();
    }

    const newOrder = {
      id: `temp-${Date.now()}`,
      order_number: newOrderNumber,

      created_day: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),

      status: "unassigned",

      total_price: 0,

      customer: {
        name: "",
        phone: "",
        city: "",
        department: "",
        region_type: "lima",
      },

      product: {
        name: "",
        quantity: 1,
        price: 0,
      },

      advisor: "Sin asignar",

      dataUpdated: {
        cliente: {},
        vendedor: {},
        observacion: "",
        status: "unassigned",
        envio: {},
        productos: {
          base: {},
          upsells: [],
        },
        pago: {},
        meta: {},
      },
    };

    setSelectedOrder(newOrder);
  };

  return (
    <div className="orders-page">
      <OrdersHeader onCreate={handleCreateOrder} />

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
          onSuccess={handleSuccess}
          statusConfig={statusConfig}
          couriers={couriers}
        />
      )}
    </div>
  );
}
