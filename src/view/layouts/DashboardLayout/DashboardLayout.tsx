import { Link, Outlet } from "react-router";
import "./DashboardLayout.css";
import Button from "../../components/Button/Button";
import {
  AiOutlineArrowLeft,
  AiOutlineDashboard,
  AiOutlineRobot,
  AiOutlineSetting,
} from "react-icons/ai";

const DashboardLayout = () => {
  return (
    <section className="dashboard-layout">
      <nav className="side-nav glass-bg">
        <Link to="/">
          <h1>Mcp-ChatBot</h1>
        </Link>

        <ul>
          <li>
            <Button href="/">
              <AiOutlineDashboard />
              Dashboard
            </Button>
          </li>
          <li>
            <Button href="/agents">
              <AiOutlineRobot />
              Agents
            </Button>
          </li>
          <li>
            <Button href="/settings">
              <AiOutlineSetting />
              Settings
            </Button>
          </li>
          <li>
            <Button href="/logout" theme="danger">
              Logout
            </Button>
          </li>
        </ul>
      </nav>
      <main className="glass-bg">
        <header className="glass-bg">
          <Button>
            <AiOutlineArrowLeft />
          </Button>
        </header>
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
