import { useState } from "react";
import "../../styles/components/advanceModal.css";

type Props = {
  order: any;
  onClose: () => void;
  onConfirm: (amount: number, extra?: any) => void;
};

export default function AdvanceModal({ order, onClose, onConfirm }: Props) {
  const [amount, setAmount] = useState("");
  const [dni, setDni] = useState("");

  const total = Number(order.total_price);
  const numericAmount = Number(amount);
  const pending = Math.max(0, total - numericAmount);

  const isProvince = order.customer?.region_type?.toLowerCase() === "provincia";

  /* =============================
     VALIDACIÓN
  ============================== */

  const isValidAmount = numericAmount > 0 && numericAmount <= total;

  const isValidDni = !isProvince || dni.length === 8;

  const isValid = isValidAmount && isValidDni;

  return (
    <div className="advance-overlay" onClick={onClose}>
      <div className="advance-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="advance-header">
          <h3>Registrar Adelanto</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="advance-content">
          <div className="advance-summary">
            <p>Total pedido</p>
            <h2>S/ {total}</h2>
          </div>

          {/* MONTO */}
          <div className="advance-field">
            <label>Monto de adelanto</label>
            <input
              type="number"
              placeholder="Ej: 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* 🔥 DNI SOLO PROVINCIA */}
          {isProvince && (
            <div className="advance-field">
              <label>DNI cliente *</label>
              <input
                type="text"
                placeholder="Ingrese DNI (8 dígitos)"
                value={dni}
                maxLength={8}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setDni(value);
                }}
              />

              {dni && dni.length !== 8 && (
                <span className="error-text">El DNI debe tener 8 dígitos</span>
              )}
            </div>
          )}

          {/* RESULTADO */}
          {amount && (
            <div className="advance-result">
              <div>
                <span>Adelanto</span>
                <b>S/ {numericAmount}</b>
              </div>

              <div>
                <span>Restante</span>
                <b className={pending === 0 ? "amount-paid" : "amount-pending"}>
                  S/ {pending}
                </b>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="advance-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn-confirm"
            disabled={!isValid}
            onClick={() =>
              onConfirm(numericAmount, {
                dni: isProvince ? dni : null,
              })
            }
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
}
