import { useEffect, useState } from "react";
import CredentialsModal from "../components/common/CredentialsModal";
import "../styles/pages/loginPage.css";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* DETECTAR REDIRECT */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("demo") === "true") {
      setShowModal(true);
    }
  }, []);

  /* LOGIN DESDE MODAL */

  const handleModalLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);

    setShowModal(false);
  };

  /* LOGIN NORMAL */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login:", email, password);
  };

  return (
    <div className="login-wrapper">
      {showModal && (
        <CredentialsModal
          onLogin={handleModalLogin}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* HEADER */}

      <div className="login-header">
        <div className="logo-box">⌘</div>

        <h1>Panel Administrativo</h1>

        <p>Inicia sesión para administrar tu tienda</p>
      </div>

      {/* CARD */}

      <form className="login-card" onSubmit={handleSubmit}>
        {/* EMAIL */}

        <div className="login-field">
          <label>Correo</label>

          <div className="input-group">
            <span className="input-icon">📧</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div className="login-field">
          <div className="password-header">
            <label>Contraseña</label>

            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* BUTTON */}

        <button className="login-button">Iniciar sesión →</button>

        {/* FOOTER */}

        <div className="login-footer">
          <a href="#">Política de Privacidad</a>

          <span>•</span>

          <a href="#">Términos</a>

          <span>•</span>

          <a href="#">Ayuda</a>
        </div>
      </form>
    </div>
  );
}
