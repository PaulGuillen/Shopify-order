import { useEffect, useMemo, useState } from "react";
import "../../styles/components/commons/AddProductModal.css";

type Props = {
  readonly onClose: () => void;
  readonly onSelect: (product: any) => void;
};

export default function AddProductModal({ onClose, onSelect }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [customTotal, setCustomTotal] = useState("");

  /* LOAD CACHE */
  useEffect(() => {
    const cache = localStorage.getItem("products_cache");
    if (cache) {
      setProducts(JSON.parse(cache));
    }
  }, []);

  /* FILTER */
  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  /* PRODUCT DATA */
  const basePrice = Number(selectedProduct?.price || 0);
  const suggestedTotal = quantity * basePrice;

  /* RESET */
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setCustomTotal(basePrice.toFixed(2));
    }
  }, [selectedProduct]);

  /* DIFERENCIA */
  const difference = Number(customTotal || 0) - suggestedTotal;

  return (
    <>
      {/* =========================
         OVERLAY PRINCIPAL
      ========================= */}
      <div className="add-product-overlay">
        <div
          className="add-product-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="add-product-header">
            <h3 className="add-product-title">Agregar producto</h3>
            <button className="add-product-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* SEARCH */}
          <div className="add-product-search">
            <input
              className="add-product-input"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIST */}
          <div className="add-product-list">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="add-product-item"
                onClick={() => setSelectedProduct(p)}
              >
                <img
                  src={p.image}
                  alt=""
                  className="add-product-img"
                />

                <div className="add-product-info">
                  <p className="add-product-name">{p.title}</p>
                  <span className="add-product-price">
                    PEN {p.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
         MODAL DETALLE PRODUCTO
      ========================= */}
      {selectedProduct && (
        <div className="add-product-detail-overlay">
          <div
            className="add-product-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="add-product-detail-header">
              <h3>Agregar producto</h3>

              <button
                className="add-product-close"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="add-product-detail-content">
              <img
                src={selectedProduct.image}
                alt=""
                className="add-product-detail-img"
              />

              <p className="add-product-detail-title">
                {selectedProduct.title}
              </p>

              {/* PRECIO */}
              <div className="add-product-price-box">
                <span>Precio tienda</span>
                <p>PEN {basePrice.toFixed(2)}</p>
              </div>

              {/* CANTIDAD */}
              <div className="add-product-quantity-box">
                <label>Cantidad</label>

                <div className="add-product-stepper">
                  <button
                    className="add-product-stepper-btn"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                  >
                    −
                  </button>

                  <span className="add-product-stepper-value">
                    {quantity}
                  </span>

                  <button
                    className="add-product-stepper-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL SUGERIDO */}
              <div className="add-product-price-box">
                <span>Total sugerido</span>
                <p>PEN {suggestedTotal.toFixed(2)}</p>
              </div>

              {/* TOTAL EDITABLE */}
              <div className="add-product-price-box">
                <label>Total a cobrar</label>

                <input
                  type="text"
                  className="add-product-price-input"
                  value={customTotal}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");

                    setCustomTotal(value);
                  }}
                />
              </div>

              {/* DIFERENCIA */}
              <p className="add-product-total-preview">
                {difference < 0
                  ? `Descuento: PEN ${Math.abs(difference).toFixed(2)}`
                  : difference > 0
                  ? `Extra: PEN ${difference.toFixed(2)}`
                  : "Sin diferencia"}
              </p>
            </div>

            {/* FOOTER */}
            <div className="add-product-detail-footer">
              <button
                className="add-product-btn-cancel"
                onClick={() => setSelectedProduct(null)}
              >
                Cancelar
              </button>

              <button
                className="add-product-btn-confirm"
                disabled={!customTotal || Number(customTotal) <= 0}
                onClick={() => {
                  onSelect({
                    ...selectedProduct,
                    quantity,
                    price: basePrice,
                    total: Number(customTotal),
                  });

                  setSelectedProduct(null);
                  onClose();
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}