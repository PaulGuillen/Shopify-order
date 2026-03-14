import { useState } from "react";
import "./../../styles/components/orders/ordersQuickDate.css";

type Props = {
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
};

export default function OrdersQuickDates({ setDateRange }: Readonly<Props>) {
  const [selected, setSelected] = useState("todos");

  const today = new Date();

  const handleChange = (value: string) => {
    setSelected(value);

    if (value === "todos") {
      setDateRange({ start: null, end: null });
    }

    if (value === "hoy") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      setDateRange({
        start,
        end,
      });
    }

    if (value === "7dias") {
      const start = new Date();
      start.setDate(today.getDate() - 7);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      setDateRange({
        start,
        end,
      });
    }

    if (value === "15dias") {
      const start = new Date();
      start.setDate(today.getDate() - 15);
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      setDateRange({
        start,
        end,
      });
    }
  };

  return (
    <select
      className="orders-quick-dropdown"
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="todos">Todos</option>
      <option value="hoy">Hoy</option>
      <option value="7dias">Últimos 7 días</option>
      <option value="15dias">Últimos 15 días</option>
    </select>
  );
}
