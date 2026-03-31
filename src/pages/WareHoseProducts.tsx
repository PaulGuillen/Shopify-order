import { useState, useMemo } from "react";
import "../styles/pages/productsPage.css";
import { useProducts } from "../hooks/useHome";
import SidePanelProduct from "../components/products/SidePanelProduct";

export default function WareHoseProducts() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const shop = user.shop;

  const { products, loadingProducts, loadProducts } = useProducts(shop);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("todos");

  const [openPanel, setOpenPanel] = useState(false);

  /* =============================
        NORMALIZAR DATA 🔥
  ============================= */

  const mappedProducts = useMemo(() => {
    return products.map((p: any) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      price: Number(p.price || 0),
      stock: Number(p.stock || 0),
      status: p.status || "active",
      source: p.source || "shopify", // 🔥 FIX REAL
    }));
  }, [products]);

  /* =============================
        FILTROS
  ============================= */
  const filteredProducts = useMemo(() => {
    let data = [...mappedProducts];

    if (tab === "shopify") {
      data = data.filter((p) => p.source === "shopify");
    }

    if (tab === "mios") {
      data = data.filter((p) => p.source === "mios");
    }

    return data;
  }, [mappedProducts, tab]);

  /* =============================
        ESTADOS VISUALES
  ============================= */

  const getStatus = (p: any) => {
    if (p.stock <= 0) return "sin_stock";
    if (p.stock < 5) return "bajo_stock";
    return "activo";
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "activo":
        return "ACTIVO";
      case "bajo_stock":
        return "STOCK BAJO";
      case "sin_stock":
        return "SIN STOCK";
      default:
        return "ACTIVO";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "green";
      case "bajo_stock":
        return "orange";
      case "sin_stock":
        return "red";
      default:
        return "green";
    }
  };

  /* =============================
        RENDER
  ============================= */

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-page__header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona tu catálogo desde Shopify y productos propios.</p>
        </div>

        <button
          className="products-page__btn-primary"
          onClick={() => setOpenPanel(true)}
        >
          + Agregar producto
        </button>
      </div>

      {/* TABS */}
      <div className="products-page__tabs">
        <button
          className={
            tab === "todos" ? "products-page__tab active" : "products-page__tab"
          }
          onClick={() => setTab("todos")}
        >
          Todos
        </button>

        <button
          className={
            tab === "shopify"
              ? "products-page__tab active"
              : "products-page__tab"
          }
          onClick={() => setTab("shopify")}
        >
          Shopify
        </button>

        <button
          className={
            tab === "mios" ? "products-page__tab active" : "products-page__tab"
          }
          onClick={() => setTab("mios")}
        >
          Propios
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="products-page__filter">
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="products-page__table">
        <div className="products-page__table-header">
          <span>DETALLE DEL PRODUCTO</span>
          <span>ORIGEN</span>
          <span>PRECIO</span>
          <span>ESTADO</span>
        </div>

        {loadingProducts ? (
          <p style={{ padding: 20 }}>Cargando...</p>
        ) : (
          filteredProducts.map((p) => {
            const status = getStatus(p);

            return (
              <div className="products-page__row" key={p.id}>
                <div className="products-page__product">
                  <img src={p.image} alt="" />

                  <div>
                    <p>{p.title}</p>
                    <span>ID: {p.id}</span>
                  </div>
                </div>

                <div>
                  <span className={`products-page__badge ${p.source}`}>
                    {p.source === "mios" ? "PROPIO" : "SHOPIFY"}
                  </span>
                </div>

                <div>
                  <strong>S/ {p.price.toFixed(2)}</strong>
                </div>

                <div className={`products-page__status ${statusColor(status)}`}>
                  ● {statusLabel(status)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <SidePanelProduct
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        shop={shop}
        onSuccess={() => loadProducts()}
      />
    </div>
  );
}
