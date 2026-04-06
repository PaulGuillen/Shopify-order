import { useState, useEffect } from "react";
import "./../../styles/components/products/sidePanelProduct.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shop: string;
  product?: any; // 🔥 NUEVO
}

export default function SidePanelProduct({
  open,
  onClose,
  onSuccess,
  shop,
  product,
}: Props) {
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    title: "",
    image: "",
    price: "",
    stock: "",
  });

  /* =============================
        CARGAR DATA (EDIT)
  ============================= */
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        image: product.image || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
      });
    } else {
      setForm({
        title: "",
        image: "",
        price: "",
        stock: "",
      });
    }
  }, [product]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =============================
        SAVE (CREATE / UPDATE)
  ============================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        title: form.title,
        image: form.image,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (product) {
        // 🔥 UPDATE
        await fetch(
          `${API}/products/firebase/${shop}/${product.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        // 🔥 CREATE
        await fetch(`${API}/products/firebase/${shop}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      onSuccess();
      onClose();
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
          <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="products-panel__body">
          <input
            name="title"
            placeholder="Nombre del producto"
            value={form.title}
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="URL de imagen"
            value={form.image}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Precio"
            type="number"
            value={form.price}
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {/* FOOTER */}
        <div className="products-panel__footer">
          <button className="products-panel__btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="products-panel__btn-primary" onClick={handleSave}>
            {loading ? "Guardando..." : product ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
