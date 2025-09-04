import { Link, Outlet } from "react-router";
import "./DashboardLayout.css";
import Button from "../../components/Button/Button";
import {
  AiOutlineDashboard,
  AiOutlineDoubleLeft,
  AiOutlineLogout,
  AiOutlineRobot,
  AiOutlineSetting,
} from "react-icons/ai";
import { useState } from "react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className={`dashboard-layout ${collapsed ? "collapsed" : ""}`}>
      <nav className="side-nav glass-bg">
        <Link to="/" className="title-link">
          <h1>Mcp</h1>
        </Link>

        <ul>
          <li>
            <Button href="/admin/">
              <AiOutlineDashboard />
              <span>Dashboard</span>
            </Button>
          </li>
          <li>
            <Button href="/admin/agents">
              <AiOutlineRobot />
              <span>Agents</span>
            </Button>
          </li>
          <li>
            <Button href="/admin/settings">
              <AiOutlineSetting />
              <span>Settings</span>
            </Button>
          </li>
        </ul>

        <ul>
          <li>
            <Button theme="danger">
              <AiOutlineLogout />
              <span>Logout</span>
            </Button>
          </li>
        </ul>
      </nav>
      <main className="glass-bg">
        <header className="glass-bg">
          <Button onClick={() => setCollapsed(!collapsed)}>
            <AiOutlineDoubleLeft />
          </Button>
        </header>
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
