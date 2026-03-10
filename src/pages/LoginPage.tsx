import { useEffect, useState } from "react";
import CredentialsModal from "../components/common/CredentialsModal";
import "../styles/pages/loginPage.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shop, setShop] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ===============================
     LEER PARAMS DESDE SHOPIFY
  =============================== */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlEmail = params.get("email");
    const urlPassword = params.get("password");
    const urlShop = params.get("shop");

    console.log("URL Params:", { urlEmail, urlPassword, urlShop });

    if (urlEmail) setEmail(urlEmail);
    if (urlPassword) setPassword(urlPassword);
    if (urlShop) setShop(urlShop);

    /* MOSTRAR MODAL SI VIENE DESDE SHOPIFY */

    if (urlEmail || urlPassword || urlShop) {
      setShowModal(true);
    }
  }, []);

  /* ===============================
     LOGIN DESDE MODAL
  =============================== */

  const handleModalLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shop,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        setShowModal(false);

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  /* ===============================
     LOGIN NORMAL FORM
  =============================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shop,
        }),
      });
     const text = await res.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  console.error("Respuesta no es JSON:", text);
  return;
}

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  return (
    <div className="login-wrapper">
      {/* MODAL CREDENCIALES */}

      {showModal && (
        <CredentialsModal
          email={email}
          password={password}
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

      {/* LOGIN FORM */}

      <form className="login-card" onSubmit={handleSubmit}>
        {/* EMAIL */}

        <div className="login-field">
          <label>Correo</label>

          <div className="input-group">
            <span className="input-icon">📧</span>

            <input
              type="email"
              placeholder="correo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        {/* LOGIN BUTTON */}

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
