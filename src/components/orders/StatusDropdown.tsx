import { useState, useRef, useEffect } from "react";
import { statusLabelMap } from "../../utils/statusUtil";
import "./../../styles/components/orders/statusDropdown.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="status-wrapper" ref={ref}>
      {/* SELECTED */}
      <div
        className={`status-selected ${value}`}
        onClick={() => setOpen(!open)}
      >
        <span>{statusLabelMap[value]}</span>
        <span className="arrow">▾</span>
      </div>

      {/* MENU */}
      {open && (
        <div className="status-menu">
          {Object.entries(statusLabelMap).map(([key, label]) => (
            <div
              key={key}
              className={`status-item ${key}`}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
            >
              <span>{label}</span>

              {value === key && <span className="check">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}