import { useEffect, useState } from "react";
import "./../../styles/components/orders/contactOrderModal.css";
import { formatShopifyDate } from "../../utils/ordersUtil";
import StatusSelectorModal from "../common/StatusSelectorModal";
import AddProductModal from "../common/AddProductModal";
import AgencySelectorModal from "../common/AgencySelectorModal";
import AdvanceModal from "../common/AdvanceModal";
import ProductEditModal from "../common/ProductEditModal";
import { FiCopy } from "react-icons/fi";
import { notify } from "../../utils/notify";

type Props = {
  order: any;
  onClose: () => void;
};

export default function ContactOrderModal({ order, onClose }: Readonly<Props>) {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customTotalMain, setCustomTotalMain] = useState<number | null>(null);
  const [orderData, setOrderData] = useState(order);

  useEffect(() => {
    const cache = localStorage.getItem("agencies_cache");
    if (cache) setAgencies(JSON.parse(cache));
  }, []);

  if (!order) return null;

  /* =============================
     BASE DATA
  ============================== */

  const originalQty = order.product?.quantity || 1;
  const realPrice = Number(order.product?.price || 0);
  const originalTotal = Number(order.total_price || 0);

  const [qty, setQty] = useState(originalQty);

  /* =============================
     EXTRA PRODUCTS 🔥
  ============================== */

  const [extraProducts, setExtraProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const basePrice = Number(order.product?.price || 0);
  const initialQty = order.product?.quantity || 1;

  // 🔥 detectar cambios reales
  const hasChanges =
    extraProducts.length > 0 || qty !== initialQty || !!customTotalMain;

  // 🔥 total principal
  const mainTotal =
    customTotalMain ?? (qty === initialQty ? originalTotal : qty * basePrice);

  // 🔥 extras
  const extraTotal = extraProducts.reduce(
    (acc, item) => acc + (item.total ?? item.price * item.quantity),
    0,
  );

  const calculatedTotal = mainTotal + extraTotal;

  // 🔥 total final inteligente
  const finalTotal = hasChanges
    ? mainTotal + extraTotal
    : Number(order.total_price);

  const adelanto = Number(orderData.advance_payment || 0);
  const totalACobrar = Math.max(0, finalTotal - adelanto);

  useEffect(() => {
    if (advanceAmount === 0) return;

    setStatuses((prev) => ({
      ...prev,
      adelanto: advanceAmount >= calculatedTotal ? "Pagado total" : "Parcial",
    }));
  }, [calculatedTotal]); // 🔥 clave

  const removeProduct = (index: number) => {
    setExtraProducts((prev) => prev.filter((_, i) => i !== index));
  };
  /* =============================
     CLIENT DATA
  ============================== */

  const [dni, setDni] = useState(order.customer?.dni || "");
  const [address, setAddress] = useState(order.customer?.address || "");

  /* =============================
     STATUS CONFIG
  ============================== */

  const STATUS_CONFIG = {
    contactado : [
      { label: "Sí", color: "green" },
      { label: "No", color: "red" },
    ],
    llamada: [
      { label: "No contesta", color: "red" },
      { label: "Agendado", color: "yellow" },
      { label: "Corta llamada", color: "orange" },
    ],
    confirmacion: [
      { label: "Pendiente", color: "yellow" },
      { label: "Confirmado", color: "green" },
      { label: "No desea", color: "red" },
      { label: "Cancelado", color: "darkred" },
      { label: "Duplicado", color: "gray" },
    ],
    adelanto: [
      { label: "Parcial", color: "green" },
      { label: "Pagado total", color: "darkgreen" },
      { label: "No aplica", color: "gray" },
    ],
  };

  const [statuses, setStatuses] = useState({
    contactado: "",
    llamada: "",
    confirmacion: "",
    adelanto: "",
  });

  const [activeSelector, setActiveSelector] = useState<string | null>(null);

  const handleSelect = (key: string, value: string) => {
    setStatuses((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getColorClass = (value: string, key: string) => {
    const found = STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].find(
      (s) => s.label === value,
    );
    return found?.color || "gray";
  };

  /* =============================
     ACTION
  ============================== */

  const update = async () => {
    const region = order.customer?.region_type?.toLowerCase();
    const isProvince = region === "provincia";
    const isLima = region === "lima";
    const isContactado = statuses.contactado === "Sí";

    if (!statuses.llamada || statuses.llamada === "") {
      alert("⚠️ Debe seleccionar Llamada en Estados del Pedido");
      return;
    }

    /* =============================
     VALIDACIONES 🔥
  ============================== */

    if (isContactado && isLima) {
      if (!address || address == "") {
        alert("⚠️ Debe ingresar una direccion");
        return;
      }
    }

    if (isContactado && isProvince) {
      // Adelanto obligatorio en provincia
      if (!statuses.adelanto || statuses.adelanto === "") {
        alert("⚠️ Debe registrar el adelanto antes de continuar");
        return;
      }

      // Agencia obligatoria en provincia
      if (!selectedAgency) {
        alert("⚠️ Debe seleccionar una agencia de destino");
        return;
      }

      // DNI obligatorio en provincia
      if (dni.length !== 8) {
        alert("⚠️ DNI obligatorio para envíos a provincia (8 dígitos)");
        return;
      }
    }

    /* =============================
     CONTINÚA NORMAL
  ============================== */
    const adelantoAnterior = Number(order.advance_payment || 0);
    const totalPagado = adelantoAnterior + advanceAmount;

    const newData = {
      customer: {
        dni,
        address,
      },
      order: {
        total: finalTotal,
        advance: advanceAmount,
        pending: Math.max(0, finalTotal - totalPagado),
      },
      products: [
        {
          ...order.product,
          quantity: qty,
          total: mainTotal,
        },
        ...extraProducts,
      ],
      shipping: {
        agency: selectedAgency,
      },
      tracking: {
        contactado: statuses.contactado,
        llamada: statuses.llamada,
        confirmacion: statuses.confirmacion,
        adelanto: statuses.adelanto,
      },
    };

    console.log("Request", newData);
  };

  const handleReset = () => {
    // producto original
    setQty(originalQty);

    // extras
    setExtraProducts([]);

    // adelanto
    setAdvanceAmount(0);

    setCustomTotalMain(null);

    // estados
    setStatuses({
      contactado: "",
      llamada: "",
      confirmacion: "",
      adelanto: "",
    });

    // agencia
    setSelectedAgency(null);

    // cliente
    setDni("");
    setAddress("");

    // modales
    setActiveSelector(null);
    setShowAddProduct(false);
    setShowAgencyModal(false);
    setShowAdvanceModal(false);
    setOrderData(order);
  };
  /* =============================
     RENDER
  ============================== */

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          {/* IZQUIERDA */}
          <div className="header-left">
            <button className="btn-reset-primary" onClick={handleReset}>
              Limpiar
            </button>
          </div>

          {/* CENTRO */}
          <div>
            <div className="header-center">
              <h2>Pedido #{order.order_number}</h2>
              <p className="modal-subtitle">
                Gestión de contacto con el cliente
              </p>
            </div>
          </div>

          {/* DERECHA */}
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-divider" />

        {/* BODY */}
        <div className="modal-content">
          {/* ESTADOS */}
          <div className="order-modal-section">
            <h3>Estados del pedido</h3>

            <div className="status-grid">
              {[
                { label: "Contactado", key: "contactado" as const },
                { label: "Llamada", key: "llamada" as const },
                { label: "Confirmación", key: "confirmacion" as const },
                { label: "Adelanto", key: "adelanto" as const },
              ].map((item) => (
                <button
                  key={item.key}
                  className="dropdown-card"
                  onClick={() => {
                    if (item.key === "adelanto") {
                      setShowAdvanceModal(true);
                      return;
                    }
                    setActiveSelector(item.key);
                  }}
                >
                  <span>{item.label}</span>

                  <span
                    className={`chip ${getColorClass(
                      statuses[item.key],
                      item.key,
                    )}`}
                  >
                    {statuses[item.key] || "Seleccionar"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="modal-divider" />

          {/* CLIENTE */}
          <div className="order-modal-section">
            <h3>Información del cliente</h3>

            <div className="customer-card">
              <div className="customer-row">
                <span>Nombre</span>
                <p>{order.customer?.name}</p>
              </div>

              <div className="customer-row">
                <div className="phone-field">
                  <label>TELÉFONO</label>

                  <div className="phone-input-container">
                    <span className="phone-prefix">+51</span>

                    <input
                      type="text"
                      value={order.customer?.phone?.replace("+51", "")}
                      readOnly
                    />

                    <button
                      className="copy-btn-icon"
                      onClick={() => {
                        const onlyPhone = order.customer?.phone
                          ?.replace("+51", "")
                          ?.trim();

                        navigator.clipboard.writeText(onlyPhone || "");
                        notify.info("Núnmero copiado");
                      }}
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="customer-row">
                <span>Región</span>
                <p>{order.customer?.region_type}</p>
              </div>

              <div className="customer-row">
                <span>Ubicación</span>
                <p>
                  {order.customer?.district} - {order.customer?.department}
                </p>
              </div>

              <div className="customer-row">
                <span>DNI</span>
                <input
                  className={`input-field ${dni.length === 8 ? "valid" : ""}`}
                  value={dni}
                  maxLength={8}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setDni(value);
                  }}
                />
              </div>

              <div className="customer-row full">
                <span>Dirección</span>
                <input
                  className="input-field"
                  value={address || ""}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* PEDIDO */}
          <div className="order-modal-section">
            <h3>Información del pedido</h3>

            <div className="order-grid improved">
              <div>
                <span>Fecha</span>
                <p>{formatShopifyDate(order.created_at)}</p>
              </div>

              <div>
                <span>Total original</span>
                <p>
                  {order.currency} {originalTotal}
                </p>
              </div>

              {/* 🔥 AGENCY ocupa toda la fila */}
              <div className="full-width">
                <div
                  className={`agency-card ${selectedAgency ? "active" : ""}`}
                  onClick={() => setShowAgencyModal(true)}
                >
                  <span className="agency-label">Agencia destino</span>

                  <div className="agency-content">
                    <p className="agency-name">
                      {selectedAgency?.name || "Seleccionar agencia"}
                    </p>

                    {selectedAgency && (
                      <>
                        <span className="agency-address">
                          {selectedAgency.address}
                        </span>

                        <span className="agency-city">
                          {selectedAgency.city}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-divider" />

          {/* PRODUCTOS */}
          <div className="order-modal-section">
            <div className="section-header">
              <h3>Producto</h3>

              <button
                className="btn-add-product"
                onClick={() => setShowAddProduct(true)}
              >
                + Agregar producto
              </button>
            </div>

            <div className="products-scroll">
              {/* ORIGINAL */}
              <div className="product-card improved">
                {/* LEFT */}
                <div className="product-left">
                  <p className="product-name">{order.product?.name}</p>

                  <span>Cantidad inicial: {originalQty}</span>
                  <span>Vendedor: {order.product.vendor}</span>
                  <span className="product-price">
                    Precio: {order.currency} {realPrice.toFixed(2)}
                  </span>

                  {/* 🔥 PROMO */}
                  {order.total_discount > 0 && (
                    <span className="product-discount">
                      🔥 Descuento aplicado: -{order.currency}{" "}
                      {Number(order.total_discount).toFixed(2)}
                    </span>
                  )}

                  {(customTotalMain || qty !== originalQty) && (
                    <span className="product-total-new">
                      Total Producto: {order.currency} {mainTotal.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* RIGHT */}
                <div className="product-right">
                  <div className="product-stepper">
                    <button
                      onClick={() => {
                        setEditingProduct({
                          ...order.product,
                          quantity: qty,
                          originalPrice: realPrice,
                        });
                        setEditingIndex(-1); // 🔥 producto principal
                      }}
                    >
                      −
                    </button>

                    <span>{qty}</span>

                    <button
                      onClick={() => {
                        setEditingProduct({
                          ...order.product,
                          quantity: qty,
                          originalPrice: realPrice,
                        });
                        setEditingIndex(-1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* EXTRA */}
              {extraProducts.map((p, i) => (
                <div key={i} className="product-card extra improved">
                  {/* LEFT */}
                  <div className="product-left">
                    <p className="product-name">{p.title}</p>
                    <span className="product-price">PEN {p.price}</span>
                    <span className="product-total-new">
                      Total Producto: PEN{" "}
                      {(p.total ?? p.price * p.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="product-right">
                    <div className="product-stepper">
                      <button
                        onClick={() => {
                          setEditingProduct({
                            ...p,
                            originalPrice: p.price,
                          });
                          setEditingIndex(i);
                        }}
                      >
                        −
                      </button>
                      <span>{p.quantity}</span>
                      <button
                        onClick={() => {
                          setEditingProduct({
                            ...p,
                            originalPrice: p.price,
                          });
                          setEditingIndex(i);
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn-remove icon"
                      onClick={() => removeProduct(i)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="product-total clean">
              <div className="product-line">
                <span>Monto total</span>
                <p>
                  {order.currency} {finalTotal.toFixed(2)}
                </p>
              </div>

              {advanceAmount > 0 && (
                <div className="product-line advance">
                  <span>Adelanto</span>
                  <p>
                    - {order.currency} {adelanto.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="product-line total">
                <span>Total a cobrar</span>
                <p>
                  {order.currency} {totalACobrar.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="modal-divider" />
        </div>

        {/* FOOTER */}
        <div className="modal-footer contact-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-success" onClick={update}>
            ✔ Actualizar
          </button>
        </div>
      </div>

      {/* MODALS */}
      {activeSelector && (
        <StatusSelectorModal
          title={`Seleccionar ${activeSelector}`}
          options={STATUS_CONFIG[activeSelector as keyof typeof STATUS_CONFIG]}
          onClose={() => setActiveSelector(null)}
          onSelect={(value) => {
            handleSelect(activeSelector, value);
            setActiveSelector(null);
          }}
        />
      )}

      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSelect={(product) => {
            setExtraProducts((prev) => {
              const exist = prev.find((p) => p.id === product.id);

              if (exist) {
                return prev.map((p) =>
                  p.id === product.id
                    ? {
                        ...p,
                        quantity: p.quantity + product.quantity,
                        total:
                          (p.total ?? p.price * p.quantity) +
                          (product.total ?? product.price * product.quantity),
                      }
                    : p,
                );
              }

              return [
                ...prev,
                {
                  ...product,
                  quantity: product.quantity,
                  total: product.total ?? product.price * product.quantity,
                },
              ];
            });
          }}
        />
      )}

      {showAgencyModal && (
        <AgencySelectorModal
          agencies={agencies}
          onClose={() => setShowAgencyModal(false)}
          onSelect={(agency) => {
            setSelectedAgency(agency);
            setShowAgencyModal(false);
          }}
        />
      )}

      {showAdvanceModal && (
        <AdvanceModal
          order={{
            ...order,
            total_price: totalACobrar,
          }}
          onClose={() => setShowAdvanceModal(false)}
          onConfirm={(amount, extra) => {
            setAdvanceAmount(amount);
            setOrderData((prev: { advance_payment: any }) => ({
              ...prev,
              advance_payment: (prev.advance_payment || 0) + amount,
            }));

            if (extra?.dni) {
              setDni(extra.dni);
            }

            setStatuses((prev) => ({
              ...prev,
              adelanto: amount === calculatedTotal ? "Pagado total" : "Parcial",
            }));

            setShowAdvanceModal(false);
          }}
        />
      )}

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onConfirm={({ quantity, total }) => {
            if (editingIndex === -1) {
              setQty(quantity);
              setCustomTotalMain(total); // 🔥 ESTE ES EL FIX
            } else {
              setExtraProducts((prev) =>
                prev.map((item, index) =>
                  index === editingIndex
                    ? {
                        ...item,
                        quantity,
                        total, // 🔥 IMPORTANTE
                      }
                    : item,
                ),
              );
            }

            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
