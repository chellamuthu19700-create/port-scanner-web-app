import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import NewScan from "./pages/NewScan";
import ScanHistory from "./pages/ScanHistory";
import ScanDetails from "./pages/ScanDetails";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";


function AppLayout() {

  const location = useLocation();

  // Hide sidebar on Login and Register pages
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="layout">

      {!isAuthPage && <Sidebar />}

      <main className="main-content">
        <Routes>

          {/* Login */}
          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          {/* Register */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* New Scan */}
          <Route
            path="/scan"
            element={<NewScan />}
          />

          {/* Scan Details */}
          <Route
            path="/scan/:scanId"
            element={<ScanDetails />}
          />

          {/* Scan History */}
          <Route
            path="/history"
            element={<ScanHistory />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>
      </main>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}


export default App;