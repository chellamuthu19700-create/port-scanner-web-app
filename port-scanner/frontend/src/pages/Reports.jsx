
import { useEffect, useState } from "react";
import { getReports } from "../services/api";

const API_URL = "http://127.0.0.1:8000";

function Reports() {
  const [reports, setReports] = useState([]);
  const [storedReports, setStoredReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
    loadStoredReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadStoredReports() {
    try {
      const response = await fetch(
        `${API_URL}/api/reports/repository`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load stored reports"
        );
      }

      setStoredReports(data.reports || []);
    } catch (err) {
      setError(err.message);
    }
  }

  // DELETE PDF REPORT
  async function deleteReport(filename) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reports/file/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to delete report"
        );
      }

      // Remove deleted report from UI
      setStoredReports((currentReports) =>
        currentReports.filter(
          (report) => report.filename !== filename
        )
      );

      setError("");

      alert("Report deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const completed = reports.filter(
    (report) => report.status === "completed"
  ).length;

  const failed = reports.filter(
    (report) => report.status === "failed"
  ).length;

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} Bytes`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>
          View and download your generated security reports.
        </p>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Report Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Scans</span>
          <strong>{reports.length}</strong>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

        <div className="stat-card">
          <span>Failed</span>
          <strong>{failed}</strong>
        </div>

        <div className="stat-card">
          <span>Stored PDFs</span>
          <strong>{storedReports.length}</strong>
        </div>
      </div>

      {/* Stored PDF Repository */}
      <div className="content-card">
        <h2>📁 Report Repository</h2>

        <p>
          Generated PDF reports stored in the report repository.
        </p>

        {storedReports.length === 0 ? (
          <p>No PDF reports stored yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {storedReports.map((report) => (
                <tr key={report.filename}>
                  <td>{report.filename}</td>

                  <td>
                    {formatFileSize(report.size)}
                  </td>

                  <td>
                    <a
                      href={`${API_URL}${report.download_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="view-button">
                        📥 Download
                      </button>
                    </a>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteReport(report.filename)
                      }
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Scan Reports */}
      <div className="content-card">
        <h2>Scan Reports</h2>

        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Target</th>
                <th>Range</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>#{report.id}</td>

                  <td>{report.target}</td>

                  <td>
                    {report.start_port} - {report.end_port}
                  </td>

                  <td>{report.status}</td>

                  <td>
                    {new Date(
                      report.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reports;
