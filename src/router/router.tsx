import { createHashRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import OrdersPage from "../pages/OrdersPage";
import WareHoseProducts from "../pages/WareHoseProducts";
import CustomersPage from "../pages/CustomersPage";
import DashboardPage from "../pages/DashboardPage";
import ShipmentsPage from "../pages/AgencyShipmentsPage";
import DraftOrdersPage from "../pages/DrafOrdersPage";
import SettingsPage from "../pages/SettingsPage";
import CatalogPage from "../pages/CatalogPage";
import IntegrationsPage from "../pages/IntegrationsPage";
import PrivateRoute from "../layout/PrivateRoute";

export const router = createHashRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/analytics", element: <DashboardPage /> },
      { path: "/products", element: <WareHoseProducts /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/draft-orders", element: <DraftOrdersPage /> },
      { path: "/agency", element: <ShipmentsPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/integrations", element: <IntegrationsPage /> },
    ],
  },
]);
