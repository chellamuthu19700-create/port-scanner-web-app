import { useEffect, useState } from "react";
import {
  getAllScans,
  deleteScan
} from "../services/api";
import { useNavigate } from "react-router-dom";

function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  async function handleDelete(scanId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this scan?"
    );

    if (!confirmed) return;

    try {
      await deleteScan(scanId);

      setScans((previous) =>
        previous.filter((scan) => scan.id !== scanId)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Scan History</h1>
        <p>View and manage previous port scans.</p>
      </div>

      <div className="content-card">
        {loading && <p>Loading scan history...</p>}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          scans.length === 0 && (
            <p>No scans have been performed yet.</p>
          )}

        {!loading &&
          !error &&
          scans.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Target</th>
                  <th>Port Range</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {scans.map((scan) => (
                  <tr key={scan.id}>
                    <td>#{scan.id}</td>
                    <td>{scan.target}</td>

                    <td>
                      {scan.start_port} - {scan.end_port}
                    </td>

                    <td>
                      <span className="status">
                        {scan.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        scan.created_at
                      ).toLocaleString()}
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() =>
                          navigate(`/scan/${scan.id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(scan.id)
                        }
                      >
                        Delete
                      </button>
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

export default ScanHistory;