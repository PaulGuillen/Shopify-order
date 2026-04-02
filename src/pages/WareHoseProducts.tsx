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

  // 🔥 NUEVO
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  /* =============================
        NORMALIZAR DATA
  ============================= */
  const mappedProducts = useMemo(() => {
    return products.map((p: any) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      price: Number(p.price || 0),
      stock: Number(p.stock || 0),
      source: p.source || "shopify",
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

    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return data;
  }, [mappedProducts, tab, search]);

  /* =============================
        STOCK VISUAL
  ============================= */
  const getStockLabel = (stock: number) => {
    if (stock <= 0) return "SIN STOCK";
    if (stock < 5) return "STOCK BAJO";
    return "EN STOCK";
  };

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "red";
    if (stock < 5) return "orange";
    return "green";
  };

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-page__header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona tu catálogo</p>
        </div>

        <button
          className="products-page__btn-primary"
          onClick={() => {
            setSelectedProduct(null); // 🔥 modo crear
            setOpenPanel(true);
          }}
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

      {/* SEARCH */}
      <div className="products-page__filter">
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="products-page__table">
        <div className="products-page__table-header">
          <span>PRODUCTO</span>
          <span>ORIGEN</span>
          <span>PRECIO</span>
          <span>STOCK</span>
        </div>

        {loadingProducts ? (
          <p style={{ padding: 20 }}>Cargando...</p>
        ) : (
          filteredProducts.map((p) => (
            <div
              className="products-page__row"
              key={p.id}
              onClick={() => {
                setSelectedProduct(p); // 🔥 modo editar
                setOpenPanel(true);
              }}
            >
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

              <div
                className={`products-page__status ${getStockColor(p.stock)}`}
              >
                ● Cantidad : {p.stock}{" "}
                {p.stock <= 0 ? "(Sin stock)" : p.stock < 5 ? "(Bajo)" : ""}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PANEL */}
      <SidePanelProduct
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        shop={shop}
        onSuccess={() => loadProducts()}
        product={selectedProduct} // 🔥 CLAVE
      />
    </div>
  );
}
