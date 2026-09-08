import { useEffect, useState } from "react";
import { getAllScans } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [scans, setScans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadScans();
  }, []);

  async function loadScans() {
    try {
      const data = await getAllScans();
      setScans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const totalScans = scans.length;

  const completedScans = scans.filter(
    (scan) => scan.status === "completed"
  ).length;

  const failedScans = scans.filter(
    (scan) => scan.status === "failed"
  ).length;

  const uniqueTargets = new Set(
    scans.map((scan) => scan.target)
  ).size;

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Monitor your network security scanning activity.
          </p>
        </div>

        <button
          className="dashboard-scan-button"
          onClick={() => navigate("/scan")}
        >
          + New Scan
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          ⚠ {error}
        </div>
      )}

      {/* STATISTICS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon">◉</div>

          <div>
            <span>Total Scans</span>
            <strong>{totalScans}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">✓</div>

          <div>
            <span>Completed</span>
            <strong>{completedScans}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">◈</div>

          <div>
            <span>Unique Targets</span>
            <strong>{uniqueTargets}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">!</div>

          <div>
            <span>Failed Scans</span>
            <strong>{failedScans}</strong>
          </div>
        </div>

      </div>

      {/* RECENT SCANS */}

      <div className="dashboard-card">

        <div className="dashboard-card-header">

          <div>
            <h2>Recent Scans</h2>
            <p>Latest network security scans.</p>
          </div>

          <button
            className="history-button"
            onClick={() => navigate("/history")}
          >
            View All
          </button>

        </div>

        {loading ? (

          <div className="dashboard-empty">
            <div className="dashboard-loader"></div>
            <p>Loading scan history...</p>
          </div>

        ) : scans.length === 0 ? (

          <div className="dashboard-empty">

            <div className="empty-icon">◌</div>

            <h3>No scans yet</h3>

            <p>
              Start your first security scan to see results here.
            </p>

            <button
              className="empty-scan-button"
              onClick={() => navigate("/scan")}
            >
              Start Your First Scan
            </button>

          </div>

        ) : (

          <div className="dashboard-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Target</th>
                  <th>Port Range</th>
                  <th>Scan Type</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {scans.slice(0, 8).map((scan) => (

                  <tr key={scan.id}>

                    <td className="dashboard-id">
                      #{scan.id}
                    </td>

                    <td className="dashboard-target">
                      {scan.target}
                    </td>

                    <td>
                      {scan.start_port} - {scan.end_port}
                    </td>

                    <td className="scan-type-cell">
                      {scan.scan_type || "TCP"}
                    </td>

                    <td>

                      <span
                        className={`dashboard-status ${
                          scan.status === "completed"
                            ? "completed"
                            : scan.status === "failed"
                            ? "failed"
                            : "running"
                        }`}
                      >
                        {scan.status}
                      </span>

                    </td>

                    <td>
                      {scan.duration !== null &&
                      scan.duration !== undefined
                        ? `${scan.duration}s`
                        : "-"}
                    </td>

                    <td>
                      {new Date(
                        scan.created_at
                      ).toLocaleString()}
                    </td>

                    <td>

                      <button
                        className="dashboard-view-button"
                        onClick={() =>
                          navigate(`/scan/${scan.id}`)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">

        <div>
          <h2>Quick Actions</h2>
          <p>Common security operations.</p>
        </div>

        <div className="quick-action-buttons">

          <button onClick={() => navigate("/scan")}>
            🔍 New Security Scan
          </button>

          <button onClick={() => navigate("/history")}>
            📋 Scan History
          </button>

          <button onClick={() => navigate("/reports")}>
            📊 View Reports
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;