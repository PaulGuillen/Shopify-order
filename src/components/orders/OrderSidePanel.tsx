import { useState, useEffect } from "react";
import "./../../styles/components/orders/orderSidePanel.css";
import StatusDropdown from "./StatusDropdown";
import AgencySelectorModal from "../common/AgencySelectorModal";
import CourierSelector from "../common/CourierSelector";
import AddProductModal from "../common/AddProductModal";
import { useCreateOrder, useUpdateOrder } from "../../hooks/useOrders";
import { generatePDF } from "../../utils/generateDocument";
import { buildMessage, copyMessage } from "../../utils/messageUtil";
import ProductEditModal from "../common/ProductEditModal";
import { getPeruDateTime } from "../../utils/formatDate";

export default function OrderSidePanel({
  order,
  onSuccess,
  onClose,
  statusConfig,
  couriers,
}: any) {
  const [documentType, setDocumentType] = useState<"boleta" | "factura" | null>(
    null,
  );

  const [showEditProduct, setShowEditProduct] = useState(false);

  const [baseProduct, setBaseProduct] = useState(() => ({
    id: order.product?.id,
    name: order.product?.name,
    quantity: order.product?.quantity || 1,
    price: Number(order.total_price) / (order.product?.quantity || 1),
    total: Number(order.total_price),
  }));

  const isNewOrder = order.id?.startsWith("temp");

  const advisors = JSON.parse(localStorage.getItem("advisors_cache") || "[]");
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);

  const { updateOrder, loading } = useUpdateOrder();

  const { createOrder, loading: loadingCreate } = useCreateOrder();

  const [status, setStatus] = useState(order.status);

  // 🔥 COURIER
  const [courier, setCourier] = useState(order.courier || "Shalom");
  const [customCourier, setCustomCourier] = useState("");
  const [customAddress, setCustomAddress] = useState("");

  const [observacion, setObservacion] = useState("");

  // 🔥 AGENCIA
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  // 🔥 AGENCIAS CACHE
  const [agencies] = useState<any[]>(() => {
    const cache = localStorage.getItem("agencies_cache");
    if (!cache) return [];
    try {
      return JSON.parse(cache);
    } catch {
      return [];
    }
  });

  const [deliveryDate, setDeliveryDate] = useState(
    order.delivery_date || order.created_day,
  );

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [extraProducts, setExtraProducts] = useState<any[]>([]);

  useEffect(() => {
    if (order?.agency) {
      setSelectedAgency(order.agency);
    }
  }, [order]);

  const handleOpenAgency = () => {
    if (courier === "Shalom") {
      setShowAgencyModal(true);
    }
  };

  const baseTotal = Number(baseProduct.total || 0);

  const extraTotal = extraProducts.reduce(
    (acc, p) => acc + Number(p.total || 0),
    0,
  );

  const finalTotal = baseTotal + extraTotal;

  const [adelanto, setAdelanto] = useState("");
  const [dni, setDni] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("yape"); // default

  const [editableTotal, setEditableTotal] = useState("");

  const [customerName, setCustomerName] = useState(order.customer?.name || "");
  const [department, setDepartment] = useState(
    order.customer?.department || "",
  );

  const [district, setDistrict] = useState(order.customer?.district || "");

  const adelantoNumber = Number(adelanto || 0);
  const totalEditableNumber = Number(editableTotal || 0);
  const totalFinalConAdelanto = Math.max(
    totalEditableNumber - adelantoNumber,
    0,
  );

  const [phone, setPhone] = useState(() => {
    const raw = order.customer?.phone || "";
    return raw.replace(/^(\+51|51)/, "").slice(0, 9);
  });

  const [regionType, setRegionType] = useState(
    order.customer?.region_type || "lima",
  );

  useEffect(() => {
    setEditableTotal(finalTotal.toFixed(2));
  }, [finalTotal]);

  const handleUpdateClick = async () => {
    const payload = handleUpdate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const success = await updateOrder(user.shop, order.id, payload);

    if (success) {
      onSuccess(); // 🔥 refresca lista
      onClose(); // 🔥 cierra panel
      alert("✅ Orden actualizada");
    }
  };

  useEffect(() => {
    if (!order?.dataUpdated) return;

    const data = order.dataUpdated;

    console.log("🔥 APPLY dataUpdated", data);

    /* CLIENTE */
    if (data.cliente) {
      setPhone((data.cliente.phone || "").replace(/^(\+51|51)/, ""));
      setRegionType((data.cliente.region || "lima").toLowerCase());
      setDni(data.cliente.dni || "");

      // 🔥 FIX PRO
      setDepartment(
        data.cliente.department || order.customer?.department || "",
      );

      setDistrict(data.cliente.district || order.customer?.district || "");
    }

    /* VENDEDOR */
    if (data.vendedor?.advisor && data.vendedor.advisor !== "Sin asignar") {
      const advisor = advisors.find(
        (a: any) => a.name === data.vendedor.advisor,
      );
      if (advisor) setSelectedAdvisor(advisor);
    }

    /* STATUS */
    if (data.status) {
      setStatus(data.status);
    }

    /* ENVÍO */
    if (data.envio) {
      setCourier(data.envio.courier || "Shalom");
      setSelectedAgency(data.envio.agency || null);
      setDeliveryDate(data.envio.date || order.created_day);
      setCustomAddress(data.envio.customAddress || "");
    }

    /* UPSSELLS */
    if (data.productos?.upsells) {
      setExtraProducts(data.productos.upsells || []);
    }

    /* PAGO */
    if (data.pago) {
      setPaymentMethod(data.pago.metodo || "yape");
      setAdelanto(String(data.pago.adelanto || ""));
      setEditableTotal(String(data.pago.totalOriginal || ""));
    }

    /* UPSSELLS */
    if (data.productos?.upsells) {
      setExtraProducts(data.productos.upsells || []);
    }

    /* 🔥 BASE PRODUCT (ESTO TE FALTABA) */
    if (data.productos?.base) {
      const base = data.productos.base;

      // 🔥 defensivo
      if (base.total != null) {
        const quantity = base.quantity || 1;
        const total = Number(base.total);
        const price = total / quantity;

        setBaseProduct({
          id: base.id || order.product?.id,
          name: base.name || order.product?.name,
          quantity,
          total,
          price,
        });
      }
    }

    if (data.observacion) {
      setObservacion(data.observacion);
    }

    if (data.cliente?.name) {
      setCustomerName(data.cliente.name);
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;

    setCourier(order.courier || "Shalom");
    setDeliveryDate(order.delivery_date || order.created_day);
  }, [order]);

  useEffect(() => {
    if (!order) return;

    // 🔥 SOLO si no hay dataUpdated
    if (!order.dataUpdated?.cliente) {
      setDepartment(order.customer?.department || "");
      setDistrict(order.customer?.district || "");
    }
  }, [order]);

  const handleUpdate = () => {
    const payload = {
      /* =========================
       CLIENTE
    ========================= */
      cliente: {
        name: customerName,
        phone: phone,
        phoneWithPrefix: `+51${phone}`,
        region: regionType,
        dni: dni || "",
        department: department,
        district: district,
      },

      /* =========================
       VENDEDOR
    ========================= */
      vendedor: {
        advisor: selectedAdvisor?.name || "Sin asignar",
      },

      /* =========================
       OBSERVACION
    ========================= */
      observacion: observacion,

      /* =========================
       STATUS
    ========================= */
      status: status,

      /* =========================
       ENVÍO
    ========================= */
      envio: {
        courier: courier === "Otros" ? customCourier : courier,
        agency: selectedAgency || null,
        customAddress: customAddress || null,
        date: deliveryDate,
      },

      /* =========================
       PRODUCTOS
    ========================= */
      productos: {
        base: {
          id: baseProduct.id,
          name: baseProduct.name,
          quantity: baseProduct.quantity,
          total: baseProduct.total,
        },

        upsells: extraProducts,
      },

      /* =========================
       PAGO
    ========================= */
      pago: {
        metodo: paymentMethod,
        adelanto: Number(adelanto || 0),
        totalOriginal: finalTotal,
        totalFinal: totalFinalConAdelanto,
      },

      /* =========================
       META
    ========================= */
      meta: {
        shop: order.shop,
        orderId: order.id,
        updatedAt: getPeruDateTime(),
      },
    };

    /* =========================
     🔥 LOG PRO
  ========================= */

    console.log("========================================");
    console.log("🚀 UPDATE ORDER PAYLOAD");
    console.log(JSON.stringify(payload, null, 2));
    console.log("========================================");

    return payload;
  };

  const handleCopyMessage = (type: "lima" | "provincia") => {
    const message = buildMessage(
      {
        order,
        dni,
        phone,
        extraProducts,
        total: totalFinalConAdelanto,
      },
      type,
    );

    copyMessage(message);

    alert(
      type === "lima"
        ? "📋 Mensaje Lima copiado"
        : "📋 Mensaje Provincia copiado",
    );
  };

  const handleCreateClick = async () => {
    if (!baseProduct?.id) {
      alert("⚠️ Debes seleccionar un producto base");
      return;
    }

    const payload = handleUpdate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const response = await createOrder(user.shop, order, payload);

    if (response?.success) {
      order.id = response.id;

      onSuccess();
      onClose();
      alert("✅ Orden creada");
    }
  };

  const hasBaseProduct = !!baseProduct?.id;

  return (
    <>
      <div className="sidepanel-overlay">
        <div className="sidepanel" onClick={(e) => e.stopPropagation()}>
          {/* HEADER */}
          <div className="sidepanel-header">
            <div className="header-close">
              <button className="close-btn" onClick={onClose}>
                ✕
              </button>
            </div>

            <div className="header-row">
              <h2 className="order-id"># {order.order_number}</h2>

              <StatusDropdown
                value={status}
                onChange={(val) => setStatus(val)}
                statusConfig={statusConfig}
              />
            </div>
          </div>

          {/* =========================
            💬 MENSAJES
          ========================= */}
          <div className="sidepanel-body">
            <div className="messages-card">
              <div className="messages-header">
                <span>💬 Mensajes rápidos</span>

                <div className="messages-actions">
                  <button
                    className="chip-btn"
                    onClick={() => handleCopyMessage("lima")}
                  >
                    📍 Lima
                  </button>

                  <button
                    className="chip-btn"
                    onClick={() => handleCopyMessage("provincia")}
                  >
                    🚚 Provincia
                  </button>
                </div>
              </div>
            </div>

            {/* =========================
            🧾 DODCUMENTOS
          ========================= */}
            <div className="doc-row-modern">
              <span className="doc-label">Comprobante:</span>

              <div className="doc-actions">
                <button
                  className={`chip-btn ${documentType === "boleta" ? "active" : ""}`}
                  onClick={() => {
                    setDocumentType("boleta");

                    const payload = handleUpdate();
                    generatePDF("boleta", order, payload);
                  }}
                >
                  🧾 Boleta
                </button>

                <button
                  className={`chip-btn ${documentType === "factura" ? "active" : ""}`}
                  onClick={() => {
                    setDocumentType("factura");

                    const payload = handleUpdate();
                    generatePDF("factura", order, payload);
                  }}
                >
                  🧾 Factura
                </button>
              </div>
            </div>

            {/* VENDEDOR */}
            <div className="seller-row">
              <span>Vendedor:</span>

              {/* 🔥 SI YA TIENE ASESORA */}
              {order.advisor && order.advisor !== "Sin asignar" ? (
                <div className="select-like">{order.advisor}</div>
              ) : (
                /* 🔥 SI NO TIENE → DROPDOWN */
                <select
                  className="advisor-select"
                  value={selectedAdvisor?.id || ""}
                  onChange={(e) => {
                    const advisor = advisors.find(
                      (a: any) => a.id === e.target.value,
                    );
                    setSelectedAdvisor(advisor);
                  }}
                >
                  <option value="">Seleccionar asesora</option>

                  {advisors
                    .filter((a: any) => a.status === "activo") // 🔥 opcional
                    .map((a: any) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* 🔥 OBSERVACION */}
            <div className="card">
              <div className="card-header">
                <span>📝 Observación</span>
              </div>

              <textarea
                className="observacion-input"
                placeholder="Ej: Falta cobrar, falta llamar, cliente ocupado..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </div>

            {/* BODY */}

            {/* CLIENTE */}
            <div className="card">
              <div className="card-header">
                <span>👤 Cliente</span>
              </div>

              {/* =========================
                    CHIPS REGION
                ========================= */}
              <div className="region-chips">
                {["lima", "provincia"].map((region) => (
                  <button
                    key={region}
                    className={`region-chip ${
                      regionType === region ? "active" : ""
                    }`}
                    onClick={() => setRegionType(region)}
                  >
                    {region === "lima" ? "Lima" : "Provincia"}
                  </button>
                ))}
              </div>

              {/* =========================
                  INFO CLIENTE
              ========================= */}
              <div className="cliente-box">
                <input
                  type="text"
                  className="cliente-name-input"
                  placeholder="Nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <input
                  type="text"
                  className="dni-input"
                  placeholder="Ingresar DNI"
                  value={dni}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");

                    setDni(value);
                  }}
                />

                <div className="phone-container">
                  <span className="phone-prefix">+51</span>

                  <input
                    type="text"
                    className="phone-input"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 9);

                      setPhone(value);
                    }}
                    placeholder="987654321"
                  />

                  <button
                    className="phone-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(phone);
                    }}
                  >
                    📋
                  </button>
                </div>

                <input
                  type="text"
                  className="address-input"
                  placeholder="Departamento (ej: Lima)"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />

                <input
                  type="text"
                  className="address-input"
                  placeholder="Distrito (ej: Miraflores)"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            {/* ENVÍO */}
            <div className="card">
              <div className="card-header">
                <span>📦 Envío</span>
              </div>

              {/* COURIER */}
              <div>
                <CourierSelector
                  value={courier}
                  onChange={(val) => {
                    setCourier(val);
                    setSelectedAgency(null);
                  }}
                  onAddressChange={(val) => setCustomAddress(val)}
                  couriers={couriers}
                  address={customAddress} // 🔥 CLAVE
                />
              </div>

              {/* AGENCY BOX 🔥 */}
              <div
                className={`agency-box ${selectedAgency ? "selected" : ""}`}
                onClick={handleOpenAgency}
              >
                {courier === "Shalom" && selectedAgency && (
                  <>
                    <div className="agency-header-row">
                      <span>📍 Agencia destino</span>
                      <span className="agency-badge">✔ Seleccionado</span>
                    </div>

                    <p className="agency-name">{selectedAgency.name}</p>
                    <span className="agency-address">
                      {selectedAgency.address}
                    </span>
                  </>
                )}

                {courier === "Shalom" && !selectedAgency && (
                  <span className="agency-placeholder">
                    Seleccionar agencia destino
                  </span>
                )}

                {courier !== "Shalom" && courier !== "Otros" && (
                  <span className="agency-placeholder">
                    Envío por {courier}
                  </span>
                )}

                {courier === "Otros" && customCourier && (
                  <span className="agency-placeholder">{customCourier}</span>
                )}

                {courier === "Otros" && !customCourier && (
                  <span className="agency-placeholder">Escribe un courier</span>
                )}
              </div>

              {/* FECHA */}
              <div className="delivery-box mt">
                <div className="delivery-header">
                  <span>📅 Programada / Reserva</span>
                </div>

                <input
                  type="date"
                  className="delivery-input"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
            </div>

            {/* PRODUCTOS */}
            <div className="card">
              <div className="card-header">
                <span>📦 Productos ({1 + extraProducts.length})</span>
              </div>

              {/* PRODUCTO BASE */}
              <div className="product-item">
                <div className="product-left">
                  <p className="product-title">
                    {baseProduct.name || "Seleccionar producto"}
                  </p>

                  <span className="product-meta">
                    {baseProduct.quantity} x S/ {baseProduct.price.toFixed(2)}
                  </span>
                </div>

                <div className="product-right">
                  <span className="product-price">
                    S/ {baseProduct.total.toFixed(2)}
                  </span>

                  {/* 🔥 NUEVO BOTÓN */}
                  <button
                    className="modify-text"
                    onClick={() => {
                      if (isNewOrder && !hasBaseProduct) {
                        setShowAddProduct(true); // 🔥 abrir selector
                      } else {
                        setShowEditProduct(true);
                      }
                    }}
                  >
                    ✏️{" "}
                    {isNewOrder && !hasBaseProduct
                      ? "Seleccionar"
                      : "Modificar"}
                  </button>
                </div>
              </div>

              {/* UPSSELLS */}
              {extraProducts.map((p, i) => (
                <div key={i} className="product-item upsell">
                  <div className="product-left">
                    <p className="product-title">{p.title}</p>

                    <span className="product-meta">
                      {p.quantity} x S/ {p.price}
                    </span>
                  </div>

                  <div className="product-right">
                    <span className="product-price">S/ {p.total}</span>

                    <button
                      className="delete-text"
                      onClick={() =>
                        setExtraProducts((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {/* =========================
                  BOTÓN AGREGAR
                ========================= */}
              <button
                className="upsell-btn"
                onClick={() => setShowAddProduct(true)}
              >
                <span className="upsell-icon">＋</span>
                <span>Agregar Producto</span>
              </button>

              <div className="divider" />

              {/* =========================
              TOTAL (AÚN ORIGINAL)
              👉 luego lo mejoramos
            ========================= */}
              <div className="row-between total">
                <span>Total a Cobrar</span>
                <input
                  type="text"
                  className="total-input"
                  value={editableTotal}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setEditableTotal(value);
                  }}
                />
              </div>

              <span className="hint">
                Click en el total para aplicar descuento manual
              </span>
            </div>

            <div className="card">
              <div className="card-header">
                <span>💰 Adelanto</span>
              </div>

              {/* =========================
                MÉTODOS DE PAGO (CHIPS)
            ========================= */}
              <div className="payment-methods">
                {["yape", "plin", "transferencia"].map((method) => (
                  <button
                    key={method}
                    className={`payment-chip ${
                      paymentMethod === method ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method === "yape" && "Yape"}
                    {method === "plin" && "Plin"}
                    {method === "transferencia" && "Transferencia"}
                  </button>
                ))}
              </div>

              {/* =========================
                  INPUT ADELANTO
              ========================= */}
              <div className="adelanto-box">
                <input
                  type="text"
                  className="adelanto-input"
                  placeholder="Ingresar adelanto"
                  value={adelanto}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*)\./g, "$1");

                    setAdelanto(value);
                  }}
                />
              </div>

              <div className="divider" />

              {/* =========================
                  TOTAL FINAL
              ========================= */}
              <div className="row-between total">
                <span>Total Final</span>
                <span>S/ {totalFinalConAdelanto.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sidepanel-footer">
            <button
              className="update-btn"
              onClick={isNewOrder ? handleCreateClick : handleUpdateClick}
              disabled={loading}
            >
              {loading ? (
                <span className="loader" />
              ) : (
                <>
                  <span className="update-icon">✓</span>
                  <span>
                    {isNewOrder ? "Crear Pedido" : "Actualizar Pedido"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
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

      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSelect={(product) => {
            if (isNewOrder && !hasBaseProduct) {
              // 🔥 ESTE ES EL BASE PRODUCT
              setBaseProduct({
                id: product.id,
                name: product.title,
                quantity: product.quantity,
                price: product.price,
                total: product.total,
              });

              setShowAddProduct(false);
              return;
            }

            // 🔥 SI YA HAY BASE → ES UPSELL
            setExtraProducts((prev) => {
              const exist = prev.find((p) => p.id === product.id);

              if (exist) {
                return prev.map((p) =>
                  p.id === product.id
                    ? {
                        ...p,
                        quantity: p.quantity + product.quantity,
                        total: p.total + product.total,
                      }
                    : p,
                );
              }

              return [...prev, product];
            });

            setShowAddProduct(false);
          }}
        />
      )}

      {showEditProduct && (
        <ProductEditModal
          product={{
            name: baseProduct.name,
            quantity: baseProduct.quantity,
            price: baseProduct.price,
            total: baseProduct.total,
            originalPrice: baseProduct.price,
          }}
          onClose={() => setShowEditProduct(false)}
          onConfirm={({ quantity, total }) => {
            const priceUnit = total / quantity;

            setBaseProduct({
              ...baseProduct,
              quantity,
              total,
              price: priceUnit,
            });

            setShowEditProduct(false);
          }}
        />
      )}
    </>
  );
}
