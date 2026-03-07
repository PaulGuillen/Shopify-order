import { useState } from "react";
import Layout from "../layout/Layout";
import "../styles/pages/analyticsPage.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ============================
   DATA MOCK
============================ */

const salesData = [
  { date: "01 Oct", current: 2400, prev: 1800 },
  { date: "02 Oct", current: 2100, prev: 1500 },
  { date: "03 Oct", current: 3200, prev: 2000 },
  { date: "04 Oct", current: 2800, prev: 2100 },
  { date: "05 Oct", current: 3900, prev: 2700 },
  { date: "06 Oct", current: 3400, prev: 2600 },
  { date: "07 Oct", current: 4200, prev: 3100 },
];

const products = [
  {
    name: "Aura Compression Leggings",
    units: 42,
    price: "$2,430",
    img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=200",
  },
  {
    name: "Velocity Pro Jacket",
    units: 38,
    price: "$1,920",
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=200",
  },
  {
    name: "Core Performance Tee",
    units: 24,
    price: "$840",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  },
  {
    name: "Zen Yoga Mat Blue",
    units: 18,
    price: "$630",
    img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=200",
  },
];

/* ============================
   COMPONENT
============================ */

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("day");

  return (
    <Layout>
      <div className="analytics-container">
        {/* HEADER */}

        <div className="analytics-header">
          <div>
            <h1>Buenos días, Zenith Active</h1>
            <p>Aquí tienes un resumen del rendimiento de tu tienda hoy.</p>
          </div>

          <button className="date-btn">📅 Últimos 30 días</button>
        </div>

        {/* METRICS */}

        <div className="analytics-metrics">
          <div className="metric-card">
            <div className="metric-title">
              Ventas Totales
              <span className="badge-up">+12.5%</span>
            </div>

            <h2>$22,000</h2>
          </div>

          <div className="metric-card">
            <div className="metric-title">
              Visitas a la tienda
              <span className="badge-up">+5.2%</span>
            </div>

            <h2>81,400</h2>
          </div>

          <div className="metric-card">
            <div className="metric-title">
              Total de pedidos
              <span className="badge-down">-2.1%</span>
            </div>

            <h2>183</h2>
          </div>

          <div className="metric-card">
            <div className="metric-title">
              Tasa de conversión
              <span className="badge-up">+0.4%</span>
            </div>

            <h2>0.22%</h2>
          </div>
        </div>

        {/* CHART FULL WIDTH */}

        <div className="analytics-chart">
          <div className="chart-header">
            <div>
              <h3>Ventas en el tiempo</h3>
              <p>Comparado con el periodo anterior</p>
            </div>

            <div className="chart-tabs">
              <button
                className={period === "day" ? "active" : ""}
                onClick={() => setPeriod("day")}
              >
                Día
              </button>

              <button
                className={period === "week" ? "active" : ""}
                onClick={() => setPeriod("week")}
              >
                Semana
              </button>

              <button
                className={period === "month" ? "active" : ""}
                onClick={() => setPeriod("month")}
              >
                Mes
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={salesData}>
              <CartesianGrid stroke="#eef2f7" />

              <XAxis dataKey="date" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="prev"
                stroke="#cbd5e1"
                fill="#e2e8f0"
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="current"
                stroke="#4f46e5"
                fill="#6366f1"
                fillOpacity={0.35}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PRODUCTS FULL WIDTH */}

        <div className="products-card">
          <div className="products-header">
            <h3>Productos más vendidos</h3>
            <span>Ver todos</span>
          </div>

          <div className="products-grid">
            {products.map((p, i) => (
              <div key={i} className="product-card">
                <img src={p.img} />

                <div className="product-data">
                  <span>{p.name}</span>
                  <small>{p.units} unidades vendidas</small>
                </div>

                <div className="product-price">{p.price}</div>
              </div>
            ))}
          </div>

          {/* INVENTORY */}

          <div className="inventory">
            <span>Disponibilidad en inventario</span>

            <div className="inventory-bar">
              <div style={{ width: "92%" }}></div>
            </div>

            <strong>92%</strong>
          </div>
        </div>
      </div>
    </Layout>
  );
}
