import "./../../styles/components/orders/ordersPagination.css";

type Props = {
  readonly currentPage: number;
  readonly setCurrentPage: (page: number) => void;
  readonly rowsPerPage: number;
  readonly setRowsPerPage: (rows: number) => void;
  readonly totalPages: number;
  readonly totalItems: number;
};

export default function OrdersPagination({
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
  totalItems,
}: Props) {
  return (
    <div className="orders-pagination">
      <div className="rows-selector">
        <span>Filas:</span>

        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <p>
        Mostrando {(currentPage - 1) * rowsPerPage + 1} a{" "}
        {Math.min(currentPage * rowsPerPage, totalItems)} de {totalItems}{" "}
        pedidos
      </p>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </button>

        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
