import { useState } from "react";
import "./../styles/pages/loginpage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="login-wrapper">
      {/* HEADER */}

      <div className="login-header">
        <div className="logo-box">⌘</div>

        <h1>Admin Panel</h1>

        <p>Sign in to manage your store</p>
      </div>

      {/* CARD */}

      <div className="login-card">
        {/* EMAIL */}

        <div className="login-field">
          <label>Email</label>

          <div className="input-group">
            <span className="input-icon">✉</span>

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div className="login-field">
          <div className="password-header">
            <label>Password</label>

            <a href="#">Forgot password?</a>
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
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>
        </div>

        {/* BUTTON */}

        <button className="login-button" onClick={handleLogin}>
          Sign in →
        </button>

        {/* FOOTER */}

        <div className="login-footer">
          <a href="#">Privacy Policy</a>

          <span>•</span>

          <a href="#">Terms</a>

          <span>•</span>

          <a href="#">Help</a>
        </div>
      </div>
    </div>
  );
}
