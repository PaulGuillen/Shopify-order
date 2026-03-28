import { createHashRouter } from "react-router-dom";
import Layout from "../layout/Layout";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import OrdersPage from "../pages/OrdersPage";
import ProductsPage from "../pages/ProductsPage";
import CustomersPage from "../pages/CustomersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import AgencyPage from "../pages/AgencyPage";
import DraftOrdersPage from "../pages/DrafOrdersPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/draft-orders", element: <DraftOrdersPage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/agency", element: <AgencyPage /> },
    ],
  },
]);