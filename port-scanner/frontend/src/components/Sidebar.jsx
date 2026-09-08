
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        🛡️
        <span>Port Scanner</span>
      </div>

      <nav>

        <NavLink to="/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/scan">
          🔍 New Scan
        </NavLink>

        <NavLink to="/history">
          📋 Scan History
        </NavLink>

        <NavLink to="/reports">
          📊 Reports
        </NavLink>

        <NavLink to="/settings">
          ⚙️ Settings
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;
