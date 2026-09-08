import { useEffect, useState } from "react";
import { checkHealth } from "../services/api";

function Settings() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    checkHealth()
      .then(() => setStatus("Connected"))
      .catch(() => setStatus("Disconnected"));
  }, []);

  return (
    <div className="settings-page">

      <div className="settings-header">
        <h1>Settings</h1>
        <p>
          Manage application and scanner configuration.
        </p>
      </div>

      {/* BACKEND */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            ⚡
          </div>

          <div>
            <h2>Backend Connection</h2>
            <p>
              Current connection status of the Port Scanner API.
            </p>
          </div>
        </div>

        <div className="settings-table">

          <div className="settings-table-row">
            <div>
              <strong>API Status</strong>
              <span>Backend server availability</span>
            </div>

            <span
              className={
                status === "Connected"
                  ? "connection-connected"
                  : status === "Disconnected"
                  ? "connection-disconnected"
                  : "connection-checking"
              }
            >
              <span className="connection-dot"></span>
              {status}
            </span>
          </div>

          <div className="settings-table-row">
            <div>
              <strong>API Endpoint</strong>
              <span>Port Scanner backend address</span>
            </div>

            <code>
              http://127.0.0.1:8000
            </code>
          </div>

          <div className="settings-table-row">
            <div>
              <strong>Scanner Engine</strong>
              <span>Network scanning engine</span>
            </div>

            <strong className="setting-value">
              Nmap
            </strong>
          </div>

          <div className="settings-table-row">
            <div>
              <strong>Default Scan</strong>
              <span>Default scanning protocol</span>
            </div>

            <strong className="setting-value">
              TCP
            </strong>
          </div>

        </div>

      </div>

      {/* SECURITY */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            🛡️
          </div>

          <div>
            <h2>Security</h2>
            <p>
              Security configuration and protection status.
            </p>
          </div>
        </div>

        <div className="settings-table">

          <div className="settings-table-row">
            <div>
              <strong>Authentication</strong>
              <span>User authentication system</span>
            </div>

            <span className="security-enabled">
              Enabled
            </span>
          </div>

          <div className="settings-table-row">
            <div>
              <strong>Password Protection</strong>
              <span>Passwords stored using hashing</span>
            </div>

            <span className="security-enabled">
              Enabled
            </span>
          </div>

          <div className="settings-table-row">
            <div>
              <strong>Authorized Scanning</strong>
              <span>Scanning should only target authorized systems</span>
            </div>

            <span className="security-enabled">
              Required
            </span>
          </div>

        </div>

      </div>

      {/* SYSTEM INFORMATION */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-section-icon">
            ℹ
          </div>

          <div>
            <h2>System Information</h2>
            <p>
              Application and technology information.
            </p>
          </div>
        </div>

        <div className="system-info-grid">

          <div className="system-info-item">
            <span>Application</span>
            <strong>Port Scanner</strong>
          </div>

          <div className="system-info-item">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

          <div className="system-info-item">
            <span>Frontend</span>
            <strong>React + Vite</strong>
          </div>

          <div className="system-info-item">
            <span>Backend</span>
            <strong>FastAPI</strong>
          </div>

          <div className="system-info-item">
            <span>Scanner</span>
            <strong>Nmap</strong>
          </div>

          <div className="system-info-item">
            <span>Database</span>
            <strong>Supabase PostgreSQL</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;