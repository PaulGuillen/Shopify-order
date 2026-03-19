import { useEffect, useState, useRef } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/homePage.css";
import { useAgencies } from "../hooks/useHome";
import toast from "react-hot-toast";
import { notify } from "../utils/notify";

export default function Home() {
  const { agencies, loadingAgencies, hasLoaded } = useAgencies();

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    if (hasLoaded) {
      hasShownToast.current = true;

      if (agencies.length > 0) {
        notify.success("Agencias cargadas correctamente 🚚");
      } else {
        notify.error("Error al cargar agencias ❌");
      }
    }
  }, [hasLoaded]);

  /* =========================
     BANNERS
  ========================= */

  const banners = [
    {
      image: "/banners/banner1.jpeg",
      tag: "Experiencia",
      title: "Vuelve Conecta",
      text: "Un espacio para conectar con la comunidad, resolver dudas y descubrir nuevas oportunidades.",
      button: "REGÍSTRATE AQUÍ",
    },
    {
      image: "/banners/banner2.jpg",
      tag: "Evento",
      title: "Capacitación de vendedores",
      text: "Aprende cómo mejorar tus ventas y optimizar tu catálogo de productos.",
      button: "VER EVENTO",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     UI
  ========================= */

  return (
    <Layout>
      <div className="home-wrapper">
        <div className="home-grid">
          {/* =========================
              BANNER
          ========================= */}

          <div className="promo-banner">
            <img src={banners[index].image} className="promo-image" />

            <div className="promo-overlay">
              <span className="promo-tag">{banners[index].tag}</span>

              <h2>{banners[index].title}</h2>

              <p>{banners[index].text}</p>

              <button className="promo-btn">{banners[index].button}</button>
            </div>
          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="right-column">
            {/* INFO BOX */}

            <div className="info-card">
              <div className="info-icon">📣</div>

              <p>
                ¿Necesitas la factura de los fletes a nombre de tu empresa? Si
                ya estás formalizado completa los datos de tu empresa para
                emitirla correctamente.
              </p>

              <button className="info-btn">INGRESA AQUÍ</button>
            </div>

            <div className="right-grid">
              {/* =========================
                  NOVEDADES
              ========================= */}

              <div className="news-section">
                <div className="section-header">
                  <h3>Novedades para tu Operación</h3>
                  <span>Ver todas</span>
                </div>

                <div className="news-card">
                  <div className="news-image"></div>

                  <div className="news-body">
                    <span className="news-date">Publicado hoy</span>

                    <p>
                      Mantente al día con las novedades más importantes que
                      impactan tu operación.
                    </p>

                    <button>Ir al sitio</button>
                  </div>
                </div>
              </div>

              {/* =========================
                  PROVEEDORES
              ========================= */}

              <div className="providers-section">
                <div className="section-header">
                  <h3>Proveedores destacados</h3>
                  <span>Ver todos</span>
                </div>

                {/* LOADING */}
                {loadingAgencies && agencies.length === 0 && (
                  <p>Cargando agencias...</p>
                )}

                {/* DATA */}
                {agencies.slice(0, 4).map((agency) => (
                  <div key={agency.id} className="provider-item">
                    <div className="provider-left">
                      <div className="provider-icon">📦</div>
                      {agency.name}
                    </div>

                    <button
                      onClick={() => {
                        console.log("AGENCIA:", agency);

                        toast.success(`Seleccionaste ${agency.name} 📍`);
                      }}
                    >
                      Ver
                    </button>
                  </div>
                ))}

                {/* EMPTY STATE */}
                {!loadingAgencies && agencies.length === 0 && (
                  <p>No hay agencias disponibles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
