import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useParams, useSearchParams } from "react-router";
import "./TeamsSideBar.css";
import { AiOutlineRobot } from "react-icons/ai";
import Button from "../Button/Button";
import { useActiveTeam } from "../../../stores/team.store";
import { useTeams } from "../../../hooks/useTeams";
import Loader from "../Loader/Loader";

const TeamsSideBar = () => {
  const [, setSearchParams] = useSearchParams();
  const { wsId } = useParams();

  const { setActiveTeam, id: activeTeamId } = useActiveTeam();

  // Shared teams query (current user's teams)
  const {
    data: teamsData,
    isLoading: loadingTeams,
    error: teamsError,
    refetch: refetchTeams,
  } = useTeams();

  return (
    <div className="team-sidebar">
      <div className="workspaces-list">
        {loadingTeams ? (
          <div className="loading-container">
            <Loader />
            <p>Loading teams...</p>
          </div>
        ) : teamsError ? (
          <div className="error-container">
            <p>Error loading teams</p>
            <Button onClick={() => refetchTeams()}>Retry</Button>
          </div>
        ) : (teamsData?.listMyTeams || []).length > 0 ? (
          (teamsData?.listMyTeams || []).map((team) => (
            <NavLink
              key={team.id}
              to={
                wsId ? `/workspace/${wsId}/team/${team.id}` : `/team/${team.id}`
              }
              className={`workspace ${
                activeTeamId === team.id ? "active" : ""
              }`}
              onClick={() =>
                setActiveTeam({
                  id: team.id,
                  name: team.name,
                  createdAt: team.createdAt,
                  updatedAt: team.updatedAt,
                })
              }
            >
              <img src={"http://placehold.co/60"} alt="team" />
              <p>{team.name}</p>
            </NavLink>
          ))
        ) : (
          <div className="empty-container">
            <p>No teams found</p>
            <Button onClick={() => refetchTeams()}>Refresh</Button>
          </div>
        )}
      </div>

      <Button
        className="settings tooltip"
        data-tooltip="Create Team"
        onClick={() => {
          setSearchParams(
            { create: "team" },
            {
              replace: true,
            }
          );
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>

      <Link
        to={`/workspace/${wsId}/agents`}
        className="settings tooltip"
        data-tooltip="Workspace Agents"
      >
        <AiOutlineRobot size={25} />
      </Link>
    </div>
  );
};

export default TeamsSideBar;
