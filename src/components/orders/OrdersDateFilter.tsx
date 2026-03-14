import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/components/orders/ordersDateFilter.css";

type OrdersDateFilterProps = {
  setDateRange: (start: Date | null, end: Date | null) => void;
};

export default function OrdersDateFilter({
  setDateRange,
}: OrdersDateFilterProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);

    setDateRange(start, end);
  };

  return (
    <div className="orders-date-filter">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
        placeholderText="Seleccionar fechas"
        className="date-input"
        dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
      />
    </div>
  );
}
