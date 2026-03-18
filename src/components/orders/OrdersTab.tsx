import "./../../styles/components/orders/ordersTab.css";

type Props = {
  readonly activeTab: string;
  readonly setActiveTab: (tab: string) => void;
};

export default function OrdersTabs({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: "todos", label: "Todos" },
    { id: "mis_pedidos", label: "Mis pedidos" },
    { id: "contactado", label: "Contactado" },
    { id: "adelanto", label: "Adelanto" },
    { id: "confirmo", label: "Confirmó" },
    { id: "cancelo", label: "Canceló" },
  ];

  return (
    <div className="orders-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}