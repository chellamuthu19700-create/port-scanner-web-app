import { useEffect, useState } from "react";
import { getScan } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function ScanDetails() {
  const { scanId } = useParams();
  const navigate = useNavigate();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadScan();
  }, [scanId]);

  async function loadScan() {
    try {
      const data = await getScan(scanId);
      setScan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadPDF() {
    window.open(
      `${API_URL}/api/reports/${scanId}/pdf`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <div className="scan-details-page">
        <div className="scan-details-loader">
          <div className="details-spinner"></div>
          <p>Loading scan results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scan-details-page">
        <div className="details-error">
          <span>⚠</span>
          <div>
            <strong>Unable to load scan</strong>
            <p>{error}</p>
          </div>
        </div>

        <button
          className="details-back-button"
          onClick={() => navigate("/history")}
        >
          ← Back to History
        </button>
      </div>
    );
  }

  const results = scan.results || [];

  const portsScanned =
    Number(scan.end_port) - Number(scan.start_port) + 1;

  const openResults = results.filter(
    (result) =>
      !result.state ||
      result.state.toUpperCase() === "OPEN"
  );

  const openPorts = openResults.length;

  const closedPorts = Math.max(
    portsScanned - openPorts,
    0
  );

  let riskLevel = "LOW";
  let riskClass = "low";
  let riskIcon = "✓";
  let riskTitle = "No exposed services detected.";
  let riskDescription =
    "The scan did not identify any open ports in the selected range.";

  if (openPorts > 0) {
    riskLevel = "MEDIUM";
    riskClass = "medium";
    riskIcon = "!";
    riskTitle = `${openPorts} open service${
      openPorts > 1 ? "s" : ""
    } detected.`;
    riskDescription =
      "Review the exposed services and make sure they are required and properly secured.";
  }

  const dangerousPorts = openResults.filter((result) =>
    [21, 23, 445, 3389].includes(Number(result.port))
  );

  if (dangerousPorts.length > 0) {
    riskLevel = "HIGH";
    riskClass = "high";
    riskIcon = "!";
    riskTitle = "Potentially risky services detected.";
    riskDescription =
      "One or more commonly targeted services are exposed. Review these ports immediately.";
  }

  return (
    <div className="scan-details-page">

      {/* HEADER */}
      <div className="scan-details-header">

        <div className="scan-details-header-left">

          <button
            className="scan-back-button"
            onClick={() => navigate("/history")}
          >
            ← Back
          </button>

          <div>
            <div className="scan-title-row">

              <h1>Scan #{scan.id}</h1>

              <span className="scan-completed-badge">
                <span className="completed-dot"></span>
                {scan.status || "COMPLETED"}
              </span>

            </div>

            <p className="scan-target">
              Target: <strong>{scan.target}</strong>
            </p>
          </div>

        </div>

        <button
          className="scan-download-button"
          onClick={downloadPDF}
        >
          📄 Download PDF
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <div className="scan-summary-grid">

        <div className="scan-summary-card">

          <div className="summary-icon blue">
            🔍
          </div>

          <div>
            <span>Ports Scanned</span>
            <strong>{portsScanned}</strong>
          </div>

        </div>


        <div className="scan-summary-card">

          <div className="summary-icon green">
            ●
          </div>

          <div>
            <span>Open Ports</span>
            <strong className="green-text">
              {openPorts}
            </strong>
          </div>

        </div>


        <div className="scan-summary-card">

          <div className="summary-icon red">
            ●
          </div>

          <div>
            <span>Closed / Filtered</span>
            <strong className="red-text">
              {closedPorts}
            </strong>
          </div>

        </div>


        <div className="scan-summary-card">

          <div className="summary-icon purple">
            ⏱
          </div>

          <div>
            <span>Scan Duration</span>
            <strong>
              {scan.duration
                ? `${scan.duration}s`
                : "—"}
            </strong>
          </div>

        </div>

      </div>


      {/* OPEN PORT RESULTS */}
      <div className="scan-result-section">

        <div className="section-heading">

          <div>
            <h2>Open Port Results</h2>

            <p>
              Services discovered during the scan
            </p>
          </div>

          <span className="result-count">
            {openPorts} detected
          </span>

        </div>


        {openPorts === 0 ? (

          <div className="scan-empty-state">

            <div className="empty-shield">
              ✓
            </div>

            <h3>No open ports detected</h3>

            <p>
              No exposed services were found in the
              selected port range.
            </p>

            <span className="empty-success">
              Scan result looks clean
            </span>

          </div>

        ) : (

          <div className="scan-results-table-wrapper">

            <table className="scan-results-table">

              <thead>
                <tr>
                  <th>PORT</th>
                  <th>PROTOCOL</th>
                  <th>STATE</th>
                  <th>SERVICE</th>
                  <th>VERSION</th>
                </tr>
              </thead>

              <tbody>

                {openResults.map((result, index) => (

                  <tr
                    key={`${result.port}-${index}`}
                  >

                    <td>
                      <span className="port-number">
                        {result.port}
                      </span>
                    </td>

                    <td>
                      <span className="protocol-badge">
                        {result.protocol || "TCP"}
                      </span>
                    </td>

                    <td>
                      <span className="open-state">
                        <span className="state-dot"></span>
                        {result.state || "OPEN"}
                      </span>
                    </td>

                    <td className="service-name">
                      {result.service || "Unknown"}
                    </td>

                    <td className="version-name">
                      {result.version || "Not detected"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* SECURITY ANALYSIS */}
      <div className="scan-result-section">

        <div className="section-heading">

          <div>
            <h2>Security Analysis</h2>

            <p>
              Automated assessment of discovered services
            </p>
          </div>

        </div>


        <div className={`risk-card ${riskClass}`}>

          <div className="risk-icon">
            {riskIcon}
          </div>

          <div className="risk-content">

            <span className="risk-label">
              {riskLevel} RISK
            </span>

            <h3>{riskTitle}</h3>

            <p>{riskDescription}</p>

          </div>

        </div>

      </div>


      {/* SECURITY RECOMMENDATIONS */}
      {scan.recommendations &&
        scan.recommendations.length > 0 && (

        <div className="scan-result-section">

          <div className="section-heading">

            <div>
              <h2>Security Recommendations</h2>

              <p>
                Recommended actions based on the scan
              </p>
            </div>

          </div>


          <div className="recommendations-list">

            {scan.recommendations.map(
              (recommendation, index) => (

              <div
                className="recommendation-item"
                key={index}
              >

                <span className="recommendation-number">
                  {index + 1}
                </span>

                <p>{recommendation}</p>

              </div>

            ))}

          </div>

        </div>

      )}


      {/* SCAN INFORMATION */}
      <div className="scan-result-section">

        <div className="section-heading">

          <div>
            <h2>Scan Information</h2>

            <p>
              Configuration and execution details
            </p>
          </div>

        </div>


        <div className="scan-information-grid">

          <div className="information-item">
            <span>Target</span>
            <strong>{scan.target}</strong>
          </div>

          <div className="information-item">
            <span>Port Range</span>
            <strong>
              {scan.start_port} — {scan.end_port}
            </strong>
          </div>

          <div className="information-item">
            <span>Scan Type</span>
            <strong>
              {(scan.scan_type || "TCP").toUpperCase()}
            </strong>
          </div>

          <div className="information-item">
            <span>Status</span>
            <strong className="information-status">
              {scan.status || "COMPLETED"}
            </strong>
          </div>

          <div className="information-item">
            <span>Start Time</span>
            <strong>
              {scan.created_at
                ? new Date(
                    scan.created_at
                  ).toLocaleString()
                : "—"}
            </strong>
          </div>

          <div className="information-item">
            <span>Scan ID</span>
            <strong>#{scan.id}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ScanDetails;