import { createHashRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import CustomersPage from "../pages/CustomersPage";
import OrdersPage from "../pages/OrdersPage";
import ProductsPage from "../pages/ProductsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import Home from "../pages/HomePage";
import AgencyPage from "../pages/AgencyPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <Home />,
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
  {
    path: "/agency",
    element: <AgencyPage />,
  },
]);
