import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(
        username,
        password
      );

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "username",
        data.username
      );

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      {/* Animated background */}
      <div className="cyber-grid"></div>

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-visual">

          <div className="security-glow"></div>

          <div className="shield-wrapper">

            <div className="shield">
              <span>🛡</span>
            </div>

            <div className="scan-ring ring-one"></div>
            <div className="scan-ring ring-two"></div>

          </div>

          <h2>
            PORT<span>SCANNER</span>
          </h2>

          <p className="visual-description">
            Advanced Network Security
            <br />
            & Port Intelligence Platform
          </p>

          <div className="security-status">

            <span className="status-dot"></span>

            <span>
              SYSTEM SECURE
            </span>

          </div>

          <div className="port-lines">

            <div>
              <span>PORT 22</span>
              <span className="open">OPEN</span>
            </div>

            <div>
              <span>PORT 80</span>
              <span className="open">OPEN</span>
            </div>

            <div>
              <span>PORT 443</span>
              <span className="open">OPEN</span>
            </div>

            <div>
              <span>PORT 8080</span>
              <span className="closed">CLOSED</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="auth-form-section">

          <div className="auth-card">

            <div className="auth-header">

              <div className="mobile-logo">
                🛡️
              </div>

              <h1>
                Welcome Back
              </h1>

              <p>
                Sign in to your security dashboard
              </p>

            </div>


            <form onSubmit={handleLogin}>

              <div className="auth-input-group">

                <label>
                  Username
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ◉
                  </span>

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              <div className="auth-input-group">

                <label>
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ◆
                  </span>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                </div>

              </div>


              {error && (
                <div className="auth-error">
                  <span>⚠</span>
                  {error}
                </div>
              )}


              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <span className="button-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>


            <div className="auth-divider">
              <span></span>
              <p>SECURE ACCESS</p>
              <span></span>
            </div>


            <p className="register-text">

              Don't have an account?

              <button
                type="button"
                className="register-link"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>

            </p>


            <div className="security-note">

              <span>🔒</span>

              <p>
                Your credentials are protected
                using secure password hashing.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;