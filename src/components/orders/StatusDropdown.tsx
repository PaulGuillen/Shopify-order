import { useState, useRef, useEffect } from "react";
import { statusConfig } from "../../utils/statusUtil";
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="status-wrapper" ref={ref}>
      {/* SELECTED */}
      <div
        className={`status-selected ${value}`}
        onClick={() => setOpen(!open)}
      >
        {(() => {
          const config = statusConfig[value] || statusConfig["unassigned"];

          return (
            <>
              <span
                className="status-dot"
                style={{ backgroundColor: config.color }}
              />
              <span>{config.label}</span>
            </>
          );
        })()}
        <span className="arrow">▾</span>
      </div>

      {/* MENU */}
      {open && (
        <div className="status-menu">
          {Object.entries(statusConfig).map(([key, label]) => (
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
                  style={{ backgroundColor: label.color }}
                />
                <span>{label.label}</span>
              </div>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
