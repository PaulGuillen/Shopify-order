import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  readonly children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
