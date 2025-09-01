import { Outlet, useSearchParams } from "react-router";
import "./TeamLayout.css";
import bot from "../../../assets/images/bot.png";
import Button from "../../components/Button/Button";
import TeamsSideBar from "../../components/TeamsSideBar/TeamsSideBar";

const TeamLayout = () => {
  return (
    <section className="team-layout">
      <TeamsSideBar />

      <div>
        <Outlet />
      </div>
    </section>
  );
};

export const SelectTeam = () => {
  const [, setSearchParams] = useSearchParams();
  return (
    <>
      <div className="select-team-area">
        <img src={bot} alt="bot" />
        <h1>MCP Chatbot</h1>
        <p>Select a team to work with</p>
        <Button
          theme="primary"
          onClick={() => setSearchParams({ create: "team" }, { replace: true })}
        >
          Create new team
        </Button>
      </div>
    </>
  );
};

export default TeamLayout;
