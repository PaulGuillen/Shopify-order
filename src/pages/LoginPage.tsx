import { useState, useEffect } from "react";
import "./../styles/pages/loginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ==========================
     LEER PARAMETROS DE LA URL
  ========================== */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const emailParam = params.get("email");
    const passwordParam = params.get("password");

    if (emailParam && passwordParam) {
      setEmail(emailParam);
      setPassword(passwordParam);

      alert(
        `Cuenta creada correctamente\n\nUsuario: ${emailParam}\nContraseña: ${passwordParam}\n\nPor favor guarde estos datos.`,
      );

      /* limpiar la URL para que no quede visible la contraseña */
      window.history.replaceState({}, document.title, "/Shopify-order/");
    }
  }, []);

  /* ==========================
     LOGIN
  ========================== */

  const handleLogin = () => {
    console.log("Usuario:", email);
    console.log("Password:", password);

    navigate("/dashboard");
  };

  return (
    <div className="login-wrapper">
      {/* HEADER */}
        
      <div className="login-header">
        <div className="logo-box">⌘</div>

        <h1>Panel Administrativo</h1>

        <p>Inicia sesión para administrar tu tienda</p>
      </div>

      {/* CARD */}

      <div className="login-card">
        {/* EMAIL */}

        <div className="login-field">
          <label>Correo</label>

          <div className="input-group">
            <span className="input-icon">✉</span>

            <input
              type="email"
              placeholder="admin@tienda.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>
        </div>

        {/* BUTTON */}

        <button className="login-button" onClick={handleLogin}>
          Iniciar sesión →
        </button>

        {/* FOOTER */}

        <div className="login-footer">
          <a href="#">Política de Privacidad</a>

          <span>•</span>

          <a href="#">Términos</a>

          <span>•</span>

          <a href="#">Ayuda</a>
        </div>
      </div>
    </div>
  );
}
