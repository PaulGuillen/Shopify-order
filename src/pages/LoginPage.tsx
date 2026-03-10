import { useState } from "react";
import CredentialsModal from "../components/common/CredentialsModal";
import "../styles/pages/loginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);

    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login:", email, password);
  };

  return (
    <div className="login-page">
      {showModal && (
        <CredentialsModal
          onLogin={handleLogin}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="login-container">
        <div className="login-icon">⌘</div>

        <h1>Panel Administrativo</h1>

        <p>Inicia sesión para administrar tu tienda</p>

        <form onSubmit={handleSubmit}>
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn">Iniciar sesión →</button>
        </form>
      </div>
    </div>
  );
}
