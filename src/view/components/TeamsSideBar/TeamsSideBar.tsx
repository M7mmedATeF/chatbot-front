import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useParams, useSearchParams } from "react-router";
import "./TeamsSideBar.css";
import type { Team } from "../../../types/team.entity";
import { AiOutlineRobot } from "react-icons/ai";
import Button from "../Button/Button";
import { useActiveTeam } from "../../../stores/team.store";

const TeamsSideBar = ({ teams = [] }: { teams: Team[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  const { wsId } = useParams();

  const { addTeam }: any = useActiveTeam((state) => state);

  return (
    <div className="team-sidebar">
      <div className="workspaces-list">
        {teams.map((team) => (
          <NavLink
            to={`team/${team.id}`}
            className="workspace"
            onClick={() => addTeam({ id: team.id, name: team.name })}
          >
            <img src={"http://placehold.co/60"} alt="workspace" />
            <p>{team.name}</p>
          </NavLink>
        ))}
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
