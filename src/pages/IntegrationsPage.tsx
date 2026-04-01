import { useNavigate } from "react-router-dom";
import MaintenanceCard from "../components/common/MaintenanceCard";

export default function IntegrationsPage() {
  const navigate = useNavigate();

  return (
    <MaintenanceCard
      title="Integraciones en desarrollo"
      description="Conecta tu tienda con couriers, pagos y más en un solo lugar."
      subtitle="Estamos preparando integraciones para automatizar tu operación."
      buttonText="Volver al inicio"
      onBack={() => navigate("/home")}
    />
  );
}
