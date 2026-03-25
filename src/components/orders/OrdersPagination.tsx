import { useRef } from "react";
import "./../../styles/components/orders/ordersPagination.css";

interface Props {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  setCurrentPage: (n: number) => void;
  setRowsPerPage: (n: number) => void;
}

export default function OrdersPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
}: Props) {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="pagination-container">
      {/* 🔥 FILAS */}
      <div className="rows-selector">
        <span className="rows-label">Filas por página</span>

        <div
          className="rows-dropdown"
          onClick={() => selectRef.current?.click()}
        >
          {/* 🔥 ESTE ES EL VALOR VISIBLE */}
          <span className="rows-value">{rowsPerPage}</span>

          <select
            ref={selectRef}
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>

          <span className="dropdown-icon">▾</span>
        </div>
      </div>

      {/* PAGINACIÓN */}
      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ←
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
}
