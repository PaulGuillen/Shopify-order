import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: any) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}