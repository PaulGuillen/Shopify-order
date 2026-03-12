import Layout from "../layout/Layout";
import StatCard from "../components/ui/StateCard";
import "../styles/pages/homePage.css";

export default function Home() {
  return (
    <Layout>
      <div className="dashboard">

        {/* ENCABEZADO */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Buenos días, Zenith Active</h1>
            <p className="dash-subtitle">
              Aquí tienes un resumen del rendimiento de tu tienda hoy.
            </p>
          </div>

          <div className="date-pill">
            <button className="ghost-btn">‹</button>
            <span>📅 1 Oct, 2023 - 31 Oct, 2023</span>
            <button className="ghost-btn">›</button>
          </div>
        </div>

        {/* TARJETAS DE MÉTRICAS */}
        <div className="stats-grid">

          <StatCard
            title="VENTAS TOTALES"
            value="$12,450.00"
            change="+12.5%"
            changeType="up"
          />

          <StatCard
            title="VISITAS A LA TIENDA"
            value="45,231"
            change="+5.2%"
            changeType="up"
          />

          <StatCard
            title="TOTAL DE PEDIDOS"
            value="156"
            change="-2.1%"
            changeType="down"
            note="Menor que el mes pasado"
          />

          <StatCard
            title="TASA DE CONVERSIÓN"
            value="3.2%"
            change="+0.4%"
            changeType="up"
            note="Por encima del promedio del sector"
          />

        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid-2">

          {/* GRÁFICO */}
          <section className="card chart-card">

            <div className="chart-head">

              <div>
                <h3 className="section-title">Ventas en el tiempo</h3>
                <p className="section-subtitle">
                  Rendimiento de ventas brutas por día
                </p>
              </div>

              <div className="segmented">
                <button className="seg-btn">Día</button>
                <button className="seg-btn active">Semana</button>
                <button className="seg-btn">Mes</button>
              </div>

            </div>

            <div className="chart-area">

              {/* Placeholder gráfico */}
              <div className="chart-line" />

              <div className="chart-x">
                <span>01 Oct</span>
                <span>08 Oct</span>
                <span>15 Oct</span>
                <span>22 Oct</span>
                <span>29 Oct</span>
              </div>

            </div>

          </section>

          {/* PRODUCTOS MÁS VENDIDOS */}
          <section className="card">

            <div className="top-products-head">
              <h3 className="section-title">Productos más vendidos</h3>
              <button className="link-btn">Ver todos</button>
            </div>

            <div className="products-list">

              <div className="product-row">
                <div className="thumb">🖼️</div>

                <div className="product-info">
                  <div className="product-name">
                    Aura Compression Leggings
                  </div>
                  <div className="product-sub">
                    42 unidades vendidas
                  </div>
                </div>

                <div className="product-right">
                  <div className="product-price">$2,430</div>
                  <div className="tag">TENDENCIA</div>
                </div>
              </div>

              <div className="product-row">
                <div className="thumb">🖼️</div>

                <div className="product-info">
                  <div className="product-name">
                    Velocity Pro Jacket
                  </div>
                  <div className="product-sub">
                    38 unidades vendidas
                  </div>
                </div>

                <div className="product-right">
                  <div className="product-price">$1,920</div>
                </div>
              </div>

              <div className="product-row">
                <div className="thumb">🖼️</div>

                <div className="product-info">
                  <div className="product-name">
                    Core Performance Tee
                  </div>
                  <div className="product-sub">
                    24 unidades vendidas
                  </div>
                </div>

                <div className="product-right">
                  <div className="product-price">$840</div>
                </div>
              </div>

              <div className="product-row">
                <div className="thumb">🖼️</div>

                <div className="product-info">
                  <div className="product-name">
                    Zen Yoga Mat - Blue
                  </div>
                  <div className="product-sub">
                    18 unidades vendidas
                  </div>
                </div>

                <div className="product-right">
                  <div className="product-price">$630</div>
                </div>
              </div>

            </div>

            {/* STOCK */}
            <div className="stock">

              <div className="stock-head">
                <span>Disponibilidad en inventario</span>
                <strong>92%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: "92%" }}
                />
              </div>

            </div>

          </section>

        </div>

        {/* PROMOCIÓN */}
        <section className="promo">

          <div>
            <h3>
              Impulsa tu negocio con herramientas de marketing
            </h3>

            <p>
              Atrae más clientes y aumenta la tasa de conversión
              de tu tienda con herramientas integradas de nuestro
              marketplace.
            </p>
          </div>

          <button className="promo-btn">
            Explorar Marketplace
          </button>

        </section>

      </div>
    </Layout>
  );
}