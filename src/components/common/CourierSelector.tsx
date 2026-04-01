import { useState, useEffect } from "react";
import "./../../styles/components/commons/courierSelector.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onAddressChange?: (value: string) => void;
  couriers: string[];
  address?: string; // 🔥 nuevo
};

export default function CourierSelector({
  value,
  onChange,
  onAddressChange,
  couriers,
  address,
}: Props) {
  const [localAddress, setLocalAddress] = useState(address || "");

  /* 🔥 sync desde padre */
  useEffect(() => {
    setLocalAddress(address || "");
  }, [address]);

  const isCustomCourier = (courier: string) => {
    return !["Shalom", "Olva"].includes(courier);
  };

  return (
    <div className="courier-box">
      <div className="courier-options">
        {couriers.map((opt) => (
          <div
            key={opt}
            className={`courier-pill ${value === opt ? "active" : ""}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </div>
        ))}
      </div>

      {value && isCustomCourier(value) && (
        <input
          className="courier-input"
          placeholder={`Envío por ${value}`}
          value={localAddress}
          onChange={(e) => {
            setLocalAddress(e.target.value);
            onAddressChange?.(e.target.value);
          }}
        />
      )}
    </div>
  );
}