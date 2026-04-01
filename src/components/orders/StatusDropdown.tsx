import { useState, useRef, useEffect } from "react";
import "./../../styles/components/orders/statusDropdown.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  statusConfig: any; // 🔥 nuevo
}

export default function StatusDropdown({
  value,
  onChange,
  statusConfig,
}: Props) {
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

  const current = statusConfig?.[value] || statusConfig?.["unassigned"];

  return (
    <div className="status-wrapper" ref={ref}>
      {/* SELECTED */}
      <div
        className={`status-selected ${value}`}
        onClick={() => setOpen(!open)}
      >
        <span
          className="status-dot"
          style={{ backgroundColor: current?.color }}
        />
        <span>{current?.label}</span>

        <span className="arrow">▾</span>
      </div>

      {/* MENU */}
      {open && (
        <div className="status-menu">
          {Object.entries(statusConfig || {}).map(([key, val]: any) => (
            <div
              key={key}
              className={`status-item ${key}`}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
            >
              <div className="status-item-content">
                <span
                  className="status-dot"
                  style={{ backgroundColor: val.color }}
                />
                <span>{val.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}