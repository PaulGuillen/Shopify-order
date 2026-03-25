import { useState } from "react";
import "./../../styles/components/commons/courierSelector.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onCustomChange?: (value: string) => void;
};

const options = ["Shalom", "Olva", "Zeus", "Otros"];

export default function CourierSelector({
  value,
  onChange,
  onCustomChange,
}: Props) {
  const [custom, setCustom] = useState("");

  return (
    <div className="courier-box">
      <div className="courier-options">
        {options.map((opt) => (
          <div
            key={opt}
            className={`courier-pill ${value === opt ? "active" : ""}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </div>
        ))}
      </div>

      {/* OTROS */}
      {value === "Otros" && (
        <input
          className="courier-input"
          placeholder="Escribir courier..."
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value);
            onCustomChange?.(e.target.value);
          }}
        />
      )}
    </div>
  );
}
