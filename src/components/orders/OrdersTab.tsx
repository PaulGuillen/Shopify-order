import "./../../styles/components/orders/ordersTab.css";

type Props = {
  readonly activeTab: string;
  readonly setActiveTab: (tab: string) => void;
};

export default function OrdersTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="orders-tabs">
      {/* TODOS */}

      <button
        className={activeTab === "todos" ? "active" : ""}
        onClick={() => setActiveTab("todos")}
      >
        Todos
      </button>

      {/* MIS PEDIDOS */}

      <button
        className={activeTab === "mis_pedidos" ? "active" : ""}
        onClick={() => setActiveTab("mis_pedidos")}
      >
        Mis pedidos
      </button>

      {/* POR CONFIRMAR */}

      <button
        className={activeTab === "confirmar" ? "active" : ""}
        onClick={() => setActiveTab("confirmar")}
      >
        Por confirmar
      </button>

      {/* ENTREGADO */}

      <button
        className={activeTab === "entregado" ? "active" : ""}
        onClick={() => setActiveTab("entregado")}
      >
        Entregado
      </button>

      {/* PAGADO */}

      <button
        className={activeTab === "pagado" ? "active" : ""}
        onClick={() => setActiveTab("pagado")}
      >
        Pagado
      </button>

      {/* PENDIENTE */}

      <button
        className={activeTab === "pendiente" ? "active" : ""}
        onClick={() => setActiveTab("pendiente")}
      >
        Pendiente
      </button>
    </div>
  );
}
