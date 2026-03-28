import { useState } from "react";
import "./../../styles/components/products/sidePanelProduct.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shop: string;
}

export default function SidePanelProduct({
  open,
  onClose,
  onSuccess,
  shop,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    image: "",
    price: "",
    stock: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await fetch(`http://localhost:8080/products/firebase/${shop}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          image: form.image,
          price: Number(form.price),
          stock: Number(form.stock),
          status: "active",
        }),
      });

      onSuccess(); // 🔥 refresca
      onClose(); // 🔥 cierra
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="products-panel__overlay">
      <div className="products-panel">
        {/* HEADER */}
        <div className="products-panel__header">
          <h2>Nuevo producto</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="products-panel__body">
          <input
            name="title"
            placeholder="Nombre del producto"
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="URL de imagen"
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Precio"
            type="number"
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            type="number"
            onChange={handleChange}
          />
        </div>

        {/* FOOTER */}
        <div className="products-panel__footer">
          <button className="products-panel__btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="products-panel__btn-primary" onClick={handleSave}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
