import { useState } from "react";
import "./../../styles/components/agencySelectorModal.css";

type Props = {
  agencies: any[];
  onClose: () => void;
  onSelect: (agency: any) => void;
};

export default function AgencySelectorModal({
  agencies,
  onClose,
  onSelect,
}: Readonly<Props>) {
  const [search, setSearch] = useState("");

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const filtered = agencies.filter((a) => {
    const searchNormalized = normalize(search);
    const agencyText = normalize(`${a.name} ${a.address}`);
    return agencyText.includes(searchNormalized);
  });

  return (
    <div className="agency-overlay" onClick={onClose}>
      <div
        className="agency-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="agency-header">
          <h3>Seleccionar agencia destino</h3>
          <button className="agency-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="agency-content">
          {/* SEARCH */}
          <div className="agency-search">
            <input
              className="agency-input"
              placeholder="Buscar agencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIST */}
          <div className="agency-list">
            {filtered.length > 0 ? (
              filtered.map((agency, i) => (
                <div
                  key={i}
                  className="agency-item"
                  onClick={() => onSelect(agency)}
                >
                  <p className="agency-name">{agency.name}</p>
                  <span className="agency-address">
                    {agency.address}
                  </span>
                </div>
              ))
            ) : (
              <p className="agency-empty">Sin resultados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}