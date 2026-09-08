const API_URL = "http://127.0.0.1:8000";


export async function startScan(
  target,
  startPort,
  endPort,
  scanType
) {

  const response = await fetch(
    `${API_URL}/api/scans/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        target,
        start_port: Number(startPort),
        end_port: Number(endPort),
        scan_type: scanType,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Scan failed"
    );

  }

  return data;
}


export async function getAllScans() {

  const response = await fetch(
    `${API_URL}/api/scans/`
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Unable to get scans"
    );

  }

  return data;
}


export async function getScan(scanId) {

  const response = await fetch(
    `${API_URL}/api/scans/${scanId}`
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Unable to get scan"
    );

  }

  return data;
}


export async function deleteScan(scanId) {

  const response = await fetch(
    `${API_URL}/api/scans/${scanId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Unable to delete scan"
    );

  }

  return data;
}


export async function getReports() {

  const response = await fetch(
    `${API_URL}/api/reports/`
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Unable to get reports"
    );

  }

  return data;
}


export async function checkHealth() {

  const response = await fetch(
    `${API_URL}/health`
  );


  if (!response.ok) {

    throw new Error(
      "Backend is not available"
    );

  }

  return response.json();
}
export async function registerUser(username, email, password) {
  const response = await fetch(
    `${API_URL}/api/auth/register?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}


export async function loginUser(username, password) {
  const response = await fetch(
    `${API_URL}/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}