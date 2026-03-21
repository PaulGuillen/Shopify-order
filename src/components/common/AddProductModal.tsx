import { useEffect, useMemo, useState } from "react";
import "../../styles/components/addProductModal.css";

type Props = {
  onClose: () => void;
  onSelect: (product: any) => void;
};

export default function AddProductModal({ onClose, onSelect }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cache = localStorage.getItem("products_cache");
    if (cache) {
      setProducts(JSON.parse(cache));
    }
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <div className="add-product-overlay" onClick={onClose}>
      <div className="add-product-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h3>Agregar producto</h3>
          <button onClick={onClose}>✕</button>
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
                onSelect(p);
                onClose();
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
    </div>
  );
}
