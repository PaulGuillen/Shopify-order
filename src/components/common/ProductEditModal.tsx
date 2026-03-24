import { useState, useMemo } from "react";
import "../../styles/components/commons/productEditModal.css";

type Props = {
  product: any;
  onClose: () => void;
  onConfirm: (data: { quantity: number; total: number }) => void;
};

export default function ProductEditModal({
  product,
  onClose,
  onConfirm,
}: Props) {
  const basePrice = product.originalPrice || product.price;

  console.log("Product", product)

  const [quantity, setQuantity] = useState(product.quantity || 1);

  const calculatedTotal = useMemo(() => {
    return quantity * basePrice;
  }, [quantity, basePrice]);

  const [customTotal, setCustomTotal] = useState(
    (product.total || calculatedTotal).toFixed(2),
  );

  const difference = useMemo(() => {
    return Number(customTotal) - calculatedTotal;
  }, [customTotal, calculatedTotal]);

  const isDiscount = difference < 0;

  return (
    <div className="product-edit-overlay" onClick={onClose}>
      <div className="product-edit-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="product-edit-header">
          <h3>Editar producto</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="product-edit-content">
          {/* PRODUCTO */}
          <div className="product-info-box">
            <p className="product-title">{product.name}</p>
          </div>

          {/* CANTIDAD */}
          <div className="field">
            <label>Cantidad</label>

            <div className="quantity-control">
              <button
                onClick={() => {
                  if (quantity > 1) {
                    const newQty = quantity - 1;
                    setQuantity(newQty);
                    setCustomTotal((newQty * basePrice).toFixed(2));
                  }
                }}
              >
                −
              </button>

              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => {
                  const newQty = Math.max(1, Number(e.target.value));
                  setQuantity(newQty);
                  setCustomTotal((newQty * basePrice).toFixed(2));
                }}
              />

              <button
                onClick={() => {
                  const newQty = quantity + 1;
                  setQuantity(newQty);
                  setCustomTotal((newQty * basePrice).toFixed(2));
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* RESUMEN */}
          <div className="summary-box">
            <div className="summary-row">
              <span>Total sugerido</span>
              <strong>PEN {calculatedTotal.toFixed(2)}</strong>
            </div>

            <div className="field">
              <label>Total a cobrar</label>
              <input
                type="text"
                className="total-input"
                value={customTotal}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");

                  setCustomTotal(value);
                }}
              />
            </div>

            {Number(customTotal) > 0 && (
              <div
                className={`difference ${isDiscount ? "discount" : "extra"}`}
              >
                {isDiscount ? "Descuento" : "Extra"}: PEN{" "}
                {Math.abs(difference).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="product-edit-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn-confirm"
            disabled={!customTotal || Number(customTotal) <= 0}
            onClick={() =>
              onConfirm({
                quantity,
                total: Number(customTotal),
              })
            }
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
