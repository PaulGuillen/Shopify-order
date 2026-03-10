import { useState } from "react";
import "../../styles/components/credentialsModal.css";

interface Props {
  email: string;
  password: string;
  onLogin: (email: string, password: string) => void;
  onClose: () => void;
}

export default function CredentialsModal({
  email,
  password,
  onLogin,
  onClose,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon">🔒</div>

        <h2>Credenciales de Acceso</h2>

        <p className="modal-subtitle">
          Utiliza estas credenciales para acceder al entorno de pruebas.
        </p>

        {/* EMAIL */}
        <label>USUARIO</label>

        <div className="input-copy">
          <input value={email} readOnly />

          <button onClick={() => copy(email)}>📋</button>
        </div>

        {/* PASSWORD */}

        <label>CONTRASEÑA</label>

        <div className="input-copy">
          <input value={showPassword ? password : "••••••••••"} readOnly />

          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </button>

          <button onClick={() => copy(password)}>📋</button>
        </div>

        <div className="modal-buttons">
          <button className="btn-close" onClick={onClose}>
            Cerrar
          </button>

          <button
            className="btn-login"
            onClick={() => onLogin(email, password)}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}