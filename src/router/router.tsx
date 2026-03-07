import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import CustomersPage from "../pages/CustomersPage";
import OrdersPage from "../pages/OrdersPage";
import ProductsPage from "../pages/ProductsPage";
import AnalyticsPage from "../pages/AnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/customers",
    element: <CustomersPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/analytics",
    element: <AnalyticsPage />,
  },
]);
