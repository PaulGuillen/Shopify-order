import "./../../styles/components/commons/maintenanceCard.css";

type Props = {
  title?: string;
  description?: string;
  subtitle?: string;
  buttonText?: string;
  onBack?: () => void;
};

export default function MaintenanceCard({
  title = "Estamos trabajando en esta sección",
  description = "Muy pronto podrás gestionar esta funcionalidad desde aquí.",
  subtitle = "Nuestro equipo está desarrollando esta experiencia para mejorar tu flujo.",
  buttonText = "Volver al inicio",
  onBack,
}: Props) {
  return (
    <div className="maintenance-container">
      <div className="maintenance-card">
        {/* BADGE */}
        <div className="maintenance-badge">
          <span className="dot" />
          En desarrollo
        </div>

        {/* ICON */}
        <div className="maintenance-icon">
          <div className="icon-circle">📦</div>
        </div>

        {/* CONTENT */}
        <h2>{title}</h2>
        <p className="desc">{description}</p>
        <p className="sub">{subtitle}</p>

        {/* STEPS */}
        <div className="steps">
          <span />
          <span className="active" />
          <span />
          <span />
        </div>

        {/* BUTTON */}
        {onBack && (
          <button className="btn-back" onClick={onBack}>
            ← {buttonText}
          </button>
        )}

        <span className="footer-text">Gracias por tu paciencia</span>
      </div>
    </div>
  );
}
