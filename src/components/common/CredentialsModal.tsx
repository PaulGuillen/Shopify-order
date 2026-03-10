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

        {/* FORM SIN AUTOCOMPLETE */}
        <form autoComplete="off">

          {/* INPUTS FALSOS PARA ENGAÑAR A CHROME */}
          <input
            type="text"
            name="fake-user"
            autoComplete="username"
            style={{ display: "none" }}
          />

          <input
            type="password"
            name="fake-pass"
            autoComplete="current-password"
            style={{ display: "none" }}
          />

          <div className="modal-icon">🔒</div>

          <h2>Credenciales de Acceso</h2>

          <p className="modal-subtitle">
            Utiliza estas credenciales para acceder al entorno de pruebas.
          </p>

          {/* EMAIL */}
          <label>USUARIO</label>

          <div className="input-copy">
            <input
              name="modal-user"
              type="text"
              value={email}
              readOnly
              autoComplete="off"
            />

            <button
              type="button"
              onClick={() => copy(email)}
            >
              📋
            </button>
          </div>

          {/* PASSWORD */}
          <label>CONTRASEÑA</label>

          <div className="input-copy">
            <input
              name="modal-pass"
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>

            <button
              type="button"
              onClick={() => copy(password)}
            >
              📋
            </button>
          </div>

          <div className="modal-buttons">

            <button
              className="btn-close"
              type="button"
              onClick={onClose}
            >
              Cerrar
            </button>

            <button
              className="btn-login"
              type="button"
              onClick={() => onLogin(email, password)}
            >
              Iniciar Sesión
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}