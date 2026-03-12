import { useEffect, useState } from "react";
import CredentialsModal from "../components/common/CredentialsModal";
import "../styles/pages/loginPage.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

/* =====================================
   EXTRAER SHOP DESDE EMAIL
===================================== */

const extractShopFromEmail = (email: string) => {
  const parts = email.split("@");
  return parts.length > 1 ? parts[1] : null;
};

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

    console.log("URL Params:", { urlEmail, urlPassword });

    if (urlEmail) {
      setEmail(urlEmail);

      const shopFromEmail = extractShopFromEmail(urlEmail);
      setShop(shopFromEmail);
    }

    if (urlPassword) {
      setPassword(urlPassword);
    }

    /* MOSTRAR MODAL SI VIENE DESDE SHOPIFY */

    if (urlEmail || urlPassword) {
      setShowModal(true);
    }
  }, []);

  /* ===============================
     LOGIN DESDE MODAL
  =============================== */

  const handleModalLogin = async (email: string, password: string) => {
    const shopFromEmail = extractShopFromEmail(email);

    setEmail(email);
    setPassword(password);
    setShop(shopFromEmail);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shop: shopFromEmail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        setShowModal(false);

        navigate("/home");
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

    const shopFromEmail = extractShopFromEmail(email);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          shop: shopFromEmail,
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

        navigate("/home");
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

      <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
        {/* EMAIL */}

        <div className="login-field">
          <label>Correo</label>

          <div className="input-group">
            <span className="input-icon">📧</span>

            <input
              type="email"
              placeholder="correo@empresa.com"
              value={email}
              autoComplete="off"
              onChange={(e) => {
                const value = e.target.value;

                setEmail(value);

                const shopFromEmail = extractShopFromEmail(value);
                setShop(shopFromEmail);
              }}
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
              autoComplete="new-password"
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
