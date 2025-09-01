import { Outlet } from "react-router";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <section className="dashboard-layout">
      <nav>nav</nav>
      <main>
        main
        <Outlet />
      </main>
    </section>
  );
};

export default DashboardLayout;
