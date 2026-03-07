import { useState, useMemo } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/productsPage.css";

interface Product {
  id: number;
  nombre: string;
  estado: "activo" | "borrador" | "archivado";
  inventario: number;
  categoria: string;
  tipo: string;
  proveedor: string;
}

const productsData: Product[] = [
  {
    id: 1,
    nombre: "Leggings Compresión Aura",
    estado: "activo",
    inventario: 42,
    categoria: "Ropa",
    tipo: "Leggings",
    proveedor: "Aura Sports",
  },
  {
    id: 2,
    nombre: "Chaqueta Velocity Pro",
    estado: "borrador",
    inventario: 0,
    categoria: "Ropa",
    tipo: "Abrigo",
    proveedor: "Velocity",
  },
  {
    id: 3,
    nombre: "Smartwatch Lunar v2",
    estado: "activo",
    inventario: 124,
    categoria: "Electrónicos",
    tipo: "Wearables",
    proveedor: "LunarTech",
  },
  {
    id: 4,
    nombre: "Audífonos Zen Wireless",
    estado: "archivado",
    inventario: 12,
    categoria: "Electrónicos",
    tipo: "Audio",
    proveedor: "Zen Labs",
  },
  {
    id: 5,
    nombre: "Bolso Titan Gym",
    estado: "activo",
    inventario: 0,
    categoria: "Accesorios",
    tipo: "Bolsos",
    proveedor: "Titan Gear",
  },
  {
    id: 6,
    nombre: "Zapatillas Run Pro",
    estado: "activo",
    inventario: 10,
    categoria: "Calzado",
    tipo: "Running",
    proveedor: "Nike",
  },
  {
    id: 7,
    nombre: "Casaca Winter Max",
    estado: "borrador",
    inventario: 5,
    categoria: "Ropa",
    tipo: "Abrigo",
    proveedor: "North Face",
  },
  {
    id: 8,
    nombre: "Tablet TechPad",
    estado: "activo",
    inventario: 50,
    categoria: "Electrónicos",
    tipo: "Tablet",
    proveedor: "TechPad",
  },
  {
    id: 9,
    nombre: "Mouse Gamer RGB",
    estado: "activo",
    inventario: 70,
    categoria: "Electrónicos",
    tipo: "Gaming",
    proveedor: "Logitech",
  },
  {
    id: 10,
    nombre: "Bolso Urbano",
    estado: "archivado",
    inventario: 3,
    categoria: "Accesorios",
    tipo: "Bolsos",
    proveedor: "Urban Co",
  },
  {
    id: 11,
    nombre: "Polo Training",
    estado: "activo",
    inventario: 22,
    categoria: "Ropa",
    tipo: "Polo",
    proveedor: "Adidas",
  },
];

const ITEMS_PER_PAGE = 5;

export default function ProductsPage() {
  const [products] = useState(productsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("nombre");
  const [currentPage, setCurrentPage] = useState(1);

  /* =============================
        FILTRADO
  ============================= */

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (statusFilter !== "todos") {
      data = data.filter((p) => p.estado === statusFilter);
    }

    if (search) {
      data = data.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return data;
  }, [products, search, statusFilter]);

  /* =============================
        ORDENAMIENTO
  ============================= */

  const sortedProducts = useMemo(() => {
    let data = [...filteredProducts];

    switch (sortBy) {
      case "nombre":
        data.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;

      case "inventario":
        data.sort((a, b) => b.inventario - a.inventario);
        break;

      case "categoria":
        data.sort((a, b) => a.categoria.localeCompare(b.categoria));
        break;
    }

    return data;
  }, [filteredProducts, sortBy]);

  /* =============================
        PAGINACIÓN
  ============================= */

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* =============================
        ESTADO VISUAL
  ============================= */

  const estadoClass = (estado: string) => {
    switch (estado) {
      case "activo":
        return "estado-activo";
      case "borrador":
        return "estado-borrador";
      case "archivado":
        return "estado-archivado";
      default:
        return "";
    }
  };

  const zeroStock = products.filter((p) => p.inventario === 0).length;

  return (
    <Layout>
      <div className="products-container">
        {/* HEADER */}

        <div className="products-header">
          <h1>Productos</h1>

          <div className="products-actions">
            <button className="btn">Exportar</button>
            <button className="btn">Importar</button>
            <button className="btn-primary">+ Agregar producto</button>
          </div>
        </div>

        {/* TABS */}

        <div className="products-tabs">
          <button
            className={statusFilter === "todos" ? "tab active" : "tab"}
            onClick={() => setStatusFilter("todos")}
          >
            Todos
          </button>

          <button
            className={statusFilter === "activo" ? "tab active" : "tab"}
            onClick={() => setStatusFilter("activo")}
          >
            Activos
          </button>

          <button
            className={statusFilter === "borrador" ? "tab active" : "tab"}
            onClick={() => setStatusFilter("borrador")}
          >
            Borradores
          </button>

          <button
            className={statusFilter === "archivado" ? "tab active" : "tab"}
            onClick={() => setStatusFilter("archivado")}
          >
            Archivados
          </button>
        </div>

        {/* FILTROS */}

        <div className="products-filter">
          <input
            className="search-input"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="select-filter"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="inventario">Ordenar por inventario</option>
            <option value="categoria">Ordenar por categoría</option>
          </select>
        </div>

        {/* TABLA */}

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Estado</th>
                <th>Inventario</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Proveedor</th>
              </tr>
            </thead>

            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input type="checkbox" />
                  </td>

                  <td className="product-name">
                    <div className="product-avatar"></div>
                    {product.nombre}
                  </td>

                  <td>
                    <span className={`estado ${estadoClass(product.estado)}`}>
                      {product.estado}
                    </span>
                  </td>

                  <td>
                    {product.inventario === 0 ? (
                      <span className="sin-stock">⚠ 0 en stock</span>
                    ) : (
                      `${product.inventario} en stock`
                    )}
                  </td>

                  <td>{product.categoria}</td>
                  <td>{product.tipo}</td>
                  <td>{product.proveedor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINACION */}

          <div className="products-pagination">
            <span>
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedProducts.length)} de{" "}
              {sortedProducts.length} productos
            </span>

            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {"<"}
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        {/* ALERTA */}

        {zeroStock > 0 && (
          <div className="inventory-warning">
            ⚠ Tienes {zeroStock} productos sin inventario. Considera reabastecer
            pronto.
            <span> Administrar inventario</span>
          </div>
        )}
      </div>
    </Layout>
  );
}
