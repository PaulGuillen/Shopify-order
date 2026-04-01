import { useNavigate } from "react-router-dom";
import MaintenanceCard from "../components/common/MaintenanceCard";

export default function CatalogPage() {
  const navigate = useNavigate();

  return (
    <MaintenanceCard
      title="Catálogo en desarrollo"
      description="Descubre proveedores y añade productos a tu tienda en segundos."
      subtitle="Estamos preparando un catálogo conectado para escalar tu negocio sin fricción."
      buttonText="Volver al inicio"
      onBack={() => navigate("/home")}
    />
  );
}
