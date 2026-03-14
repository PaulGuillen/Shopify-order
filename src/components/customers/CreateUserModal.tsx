import { useState } from "react";
import "./../../styles/components/customers/createUserModal.css";

interface Props {
  shop: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateUserModal({ shop, onClose, onCreated }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createUser = async () => {
    try {
      const email = `${username}@${shop}`;

      const response = await fetch("http://localhost:4000/users/create-user", {
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

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error);
        return;
      }

      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <div className="user-modal-header">
          <h2>Crear usuario</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="input-domain">
          <input
            type="text"
            autoComplete="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <span>@{shop}</span>
        </div>

        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-primary" onClick={createUser}>
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
