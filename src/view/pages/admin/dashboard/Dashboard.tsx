import {
  AiOutlineDashboard,
  AiOutlineRobot,
  AiOutlineSetting,
} from "react-icons/ai";
import Button from "../../../components/Button/Button";
import "./Dashboard.css";
import { PiToolboxLight } from "react-icons/pi";

const Dashboard = () => {
  return (
    <>
      <div className="select-dashboard-area text-center">
        <div className="dashboard-welcome ">
          <h1>Admin Dashboard</h1>
          <p>Manage your MCP-chatbot system</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card glass-bg">
            <div className="card-icon">
              <AiOutlineRobot size={32} />
            </div>
            <h3>Agents</h3>
            <p>Manage and configure system Agents configurations</p>
            <Button href="/admin/agents" theme="primary">
              View Agents
            </Button>
          </div>

          <div className="dashboard-card glass-bg">
            <div className="card-icon">
              <PiToolboxLight size={32} />
            </div>
            <h3>MCPs</h3>
            <p>Manage and configure system MCP Tools</p>
            <Button href="/admin/mcps" theme="primary">
              View MCPs
            </Button>
          </div>

          <div className="dashboard-card glass-bg">
            <div className="card-icon">
              <AiOutlineDashboard size={32} />
            </div>
            <h3>Analytics</h3>
            <p>View system analytics and usage stats</p>
            <Button href="/admin/analytics" theme="primary">
              View Analytics
            </Button>
          </div>

          <div className="dashboard-card glass-bg">
            <div className="card-icon">
              <AiOutlineSetting size={32} />
            </div>
            <h3>Settings</h3>
            <p>Configure system settings and preferences</p>
            <Button href="/admin/settings" theme="primary">
              System Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
