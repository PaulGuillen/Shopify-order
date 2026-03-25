import { useEffect, useMemo, useState } from "react";
import "../../styles/components/commons/AddProductModal.css";

type Props = {
  onClose: () => void;
  onSelect: (product: any) => void;
};

export default function AddProductModal({ onClose, onSelect }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // 🔥 estados nuevos
  const [quantity, setQuantity] = useState(1);
  const [customTotal, setCustomTotal] = useState("");

  /* =============================
     LOAD CACHE
  ============================== */
  useEffect(() => {
    const cache = localStorage.getItem("products_cache");
    if (cache) {
      setProducts(JSON.parse(cache));
    }
  }, []);

  /* =============================
     FILTER
  ============================== */
  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  /* =============================
     PRODUCT DATA
  ============================== */
  const basePrice = Number(selectedProduct?.price || 0);
  const suggestedTotal = quantity * basePrice;

  /* =============================
     RESET CUANDO ABRE MODAL
  ============================== */
  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);
      setCustomTotal(basePrice.toFixed(2));
    }
  }, [selectedProduct]);

  /* =============================
     DIFERENCIA
  ============================== */
  const difference = Number(customTotal || 0) - suggestedTotal;

  return (
    <div className="add-product-overlay" onClick={onClose}>
      <div className="add-product-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h3>Agregar producto</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <input
          className="search-input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LIST */}
        <div className="product-list">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="product-item"
              onClick={() => {
                setSelectedProduct(p);
              }}
            >
              <img src={p.image} alt="" />
              <div>
                <p>{p.title}</p>
                <span>PEN {p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
         MINI MODAL PRODUCTO
      ========================== */}
      {selectedProduct && (
        <div className="product-detail-overlay">
          <div
            className="product-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="product-detail-header">
              <h3>Agregar producto</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="product-detail-content">
              <img src={selectedProduct.image} alt="" />

              <p className="product-title">{selectedProduct.title}</p>

              {/* PRECIO TIENDA */}
              <div className="product-price-box">
                <span>Precio tienda</span>
                <p>PEN {basePrice.toFixed(2)}</p>
              </div>

              {/* =============================
                 CANTIDAD
              ============================== */}
              <div className="quantity-box">
                <label>Cantidad</label>

                <div className="stepper">
                  <button
                    className="stepper-btn"
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                  >
                    −
                  </button>

                  <span className="stepper-value">{quantity}</span>

                  <button
                    className="stepper-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL SUGERIDO */}
              <div className="price-box">
                <span>Total sugerido</span>
                <p>PEN {suggestedTotal.toFixed(2)}</p>
              </div>

              {/* 🔥 TOTAL EDITABLE */}
              <div className="price-box">
                <label>Total a cobrar</label>

                <input
                  type="text"
                  className="price-input"
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
              <p className="product-total-preview">
                {difference < 0
                  ? `Descuento: PEN ${Math.abs(difference).toFixed(2)}`
                  : difference > 0
                  ? `Extra: PEN ${difference.toFixed(2)}`
                  : "Sin diferencia"}
              </p>
            </div>

            {/* FOOTER */}
            <div className="product-detail-footer">
              <button
                className="btn-cancel"
                onClick={() => setSelectedProduct(null)}
              >
                Cancelar
              </button>

              <button
                className="btn-confirm"
                disabled={!customTotal || Number(customTotal) <= 0}
                onClick={() => {
                  onSelect({
                    ...selectedProduct,
                    quantity,
                    price: basePrice, // referencia
                    total: Number(customTotal), // 🔥 real
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
    </div>
  );
}