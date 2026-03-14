import "./../../styles/components/orders/ordersTab.css";

type Props = {
  readonly activeTab: string;
  readonly setActiveTab: (tab: string) => void;
};

export default function OrdersTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="orders-tabs">
      <button
        className={activeTab === "todos" ? "active" : ""}
        onClick={() => setActiveTab("todos")}
      >
        Todos
      </button>

      <button
        className={activeTab === "confirmar" ? "active" : ""}
        onClick={() => setActiveTab("confirmar")}
      >
        Por confirmar
      </button>

      <button
        className={activeTab === "entregado" ? "active" : ""}
        onClick={() => setActiveTab("entregado")}
      >
        Entregado
      </button>

      <button
        className={activeTab === "pagado" ? "active" : ""}
        onClick={() => setActiveTab("pagado")}
      >
        Pagado
      </button>

      <button
        className={activeTab === "pendiente" ? "active" : ""}
        onClick={() => setActiveTab("pendiente")}
      >
        Pendiente
      </button>
    </div>
  );
}
