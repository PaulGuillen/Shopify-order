import "./../../styles/components/orders/ordersSearch.css";

type Props = {
  readonly search: string;
  readonly setSearch: (value: string) => void;
};

export default function OrdersSearch({ search, setSearch }: Props) {
  return (
    <div className="orders-filter">
      <input
        placeholder="Buscar cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
