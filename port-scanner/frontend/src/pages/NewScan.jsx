
import { useState } from "react";
import { startScan } from "../services/api";

function NewScan() {
  const [target, setTarget] = useState("");
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(100);
  const [scanType, setScanType] = useState("tcp");

  const [results, setResults] = useState([]);
  const [scanInfo, setScanInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scanTypes = [
    {
      value: "tcp",
      name: "TCP Scan",
      description: "Fast TCP port discovery",
    },
    {
      value: "udp",
      name: "UDP Scan",
      description: "Discover UDP services",
    },
    {
      value: "full",
      name: "Full Scan",
      description: "Scan ports 1 - 65535",
    },
    {
      value: "aggressive",
      name: "Aggressive",
      description: "Detailed service detection",
    },
  ];

  async function handleScan(event) {
    event.preventDefault();

    setError("");

    if (!target.trim()) {
      setError("Please enter a target IP address or hostname.");
      return;
    }

    if (
      Number(startPort) < 1 ||
      Number(startPort) > 65535 ||
      Number(endPort) < 1 ||
      Number(endPort) > 65535
    ) {
      setError("Port numbers must be between 1 and 65535.");
      return;
    }

    if (
      scanType !== "full" &&
      Number(startPort) > Number(endPort)
    ) {
      setError(
        "Start port must be less than or equal to end port."
      );
      return;
    }

    setLoading(true);
    setResults([]);
    setScanInfo(null);

    try {
      const data = await startScan(
        target,
        scanType === "full" ? 1 : startPort,
        scanType === "full" ? 65535 : endPort,
        scanType
      );

      setScanInfo(data);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getScanTypeName(type) {
    const selected = scanTypes.find(
      (item) => item.value === type
    );

    return selected ? selected.name : type;
  }

  return (
    <div className="new-scan-page">

      {/* PAGE HEADER */}

      <div className="new-scan-header">
        <div>
          <h1>New Scan</h1>
          <p>
            Configure and launch an authorized network security scan.
          </p>
        </div>

        <div className="scan-status">
          <span className="status-dot"></span>
          Scanner Ready
        </div>
      </div>


      {/* CONFIGURATION CARD */}

      <div className="scan-config-card">

        <div className="card-title">
          <h2>Scan Configuration</h2>
          <p>
            Enter the target and select the scanning options.
          </p>
        </div>


        <form onSubmit={handleScan}>

          {/* TARGET */}

          <div className="form-group">

            <label>Target Host</label>

            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Example: 192.168.1.1"
              className="scan-input"
            />

            <small>
              Enter an IP address or authorized hostname.
            </small>

          </div>


          {/* SCAN TYPE */}

          <div className="form-group">

            <label>Scan Type</label>

            <div className="scan-type-grid">

              {scanTypes.map((type) => (

                <button
                  key={type.value}
                  type="button"
                  className={`scan-type ${
                    scanType === type.value
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setScanType(type.value)
                  }
                >

                  <span className="scan-type-name">
                    {type.name}
                  </span>

                  <span className="scan-type-description">
                    {type.description}
                  </span>

                </button>

              ))}

            </div>

          </div>


          {/* PORT RANGE */}

          <div className="form-group">

            <label>Port Range</label>

            <div className="port-inputs">

              <div>
                <span>Start Port</span>

                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={startPort}
                  disabled={scanType === "full"}
                  onChange={(e) =>
                    setStartPort(e.target.value)
                  }
                  className="scan-input"
                />
              </div>

              <div className="port-separator">
                —
              </div>

              <div>
                <span>End Port</span>

                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={endPort}
                  disabled={scanType === "full"}
                  onChange={(e) =>
                    setEndPort(e.target.value)
                  }
                  className="scan-input"
                />
              </div>

            </div>

            {scanType === "full" && (
              <small>
                Full Scan automatically scans ports 1 through
                65,535.
              </small>
            )}

          </div>


          {/* ERROR */}

          {error && (
            <div className="scan-error">
              ⚠ {error}
            </div>
          )}


          {/* ACTION */}

          <div className="scan-action">

            <button
              type="submit"
              className="start-scan-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="scan-spinner"></span>
                  Scanning...
                </>
              ) : (
                <>
                  Start Security Scan
                  <span>→</span>
                </>
              )}

            </button>

          </div>

        </form>

      </div>


      {/* RESULTS */}

      {scanInfo && (

        <div className="scan-results-card">

          <div className="results-header">

            <div>
              <h2>Scan Results</h2>

              <p>
                Target:{" "}
                <strong>{scanInfo.target}</strong>
              </p>

              <p>
                Scan Type:{" "}
                <strong>
                  {getScanTypeName(scanInfo.scan_type)}
                </strong>
              </p>
            </div>

            <span className="completed-badge">
              {scanInfo.status}
            </span>

          </div>


          {/* RESULT STATS */}

          <div className="result-stats">

            <div className="result-stat">
              <span>Ports Scanned</span>

              <strong>
                {scanInfo.scan_type === "full"
                  ? "65,535"
                  : Number(scanInfo.end_port) -
                    Number(scanInfo.start_port) +
                    1}
              </strong>
            </div>

            <div className="result-stat">
              <span>Open Ports</span>

              <strong>{results.length}</strong>
            </div>

            <div className="result-stat">
              <span>Duration</span>

              <strong>
                {scanInfo.duration} sec
              </strong>
            </div>

          </div>


          {/* OPEN PORTS */}

          {results.length > 0 ? (

            <div className="results-table-container">

              <table>

                <thead>
                  <tr>
                    <th>Port</th>
                    <th>State</th>
                    <th>Service</th>
                    <th>Version</th>
                  </tr>
                </thead>

                <tbody>

                  {results.map((result) => (

                    <tr
                      key={`${result.port}-${result.service}`}
                    >

                      <td className="port-number">
                        {result.port}
                      </td>

                      <td>
                        <span className="open-badge">
                          {result.state}
                        </span>
                      </td>

                      <td>
                        {result.service || "Unknown"}
                      </td>

                      <td>
                        {result.version || "Not detected"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="no-open-ports">
              No open ports found.
            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default NewScan;

