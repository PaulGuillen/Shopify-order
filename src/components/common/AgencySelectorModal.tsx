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

  const filtered = agencies.filter((a) =>
    `${a.name} ${a.address}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal small" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h3>Seleccionar agencia destino</h3>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* SEARCH 🔥 */}
        <div className="modal-content">
          <input
            className="input-field"
            placeholder="Buscar agencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="agency-list">
            {filtered.map((agency, i) => (
              <div
                key={i}
                className="agency-item"
                onClick={() => onSelect(agency)}
              >
                <p className="agency-name">{agency.name}</p>
                <span className="agency-address">{agency.address}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
