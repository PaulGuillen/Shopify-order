import { useEffect, useState } from "react";
import CredentialsModal from "../components/common/CredentialsModal";
import "../styles/pages/loginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlEmail = params.get("email");
    const urlPassword = params.get("password");
    const shop = params.get("shop");

    if (urlEmail) setEmail(urlEmail);
    if (urlPassword) setPassword(urlPassword);

    /* MOSTRAR MODAL SOLO SI VIENE DEL REDIRECT */

    if (shop || urlEmail || urlPassword) {
      setShowModal(true);
    }
  }, []);

  const handleModalLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setShowModal(false);
    navigate("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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

      <div className="login-header">
        <div className="logo-box">⌘</div>

        <h1>Panel Administrativo</h1>

        <p>Inicia sesión para administrar tu tienda</p>
      </div>

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

        <button className="login-button">Iniciar sesión →</button>

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
