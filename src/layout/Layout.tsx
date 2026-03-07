import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/pages/dashboardPage.css";

type Props = {
  readonly children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
