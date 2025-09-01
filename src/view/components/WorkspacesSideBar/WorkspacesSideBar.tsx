import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import type { Workspace } from "../../../types/workspace.entity";
import "./WorkspacesSideBar.css";

const WorkspacesSideBar = ({
  workspaces = [],
}: {
  workspaces: Workspace[];
}) => {
  return (
    <div className="workspace-sidebar">
      <Link to={"#"} className="user">
        <img src={"http://placehold.co/60"} alt="user" />
      </Link>

      <div className="workspaces-list">
        {workspaces.map((workspace) => (
          <Link to={`workspace/${workspace.id}`} className="workspace">
            <img src={"http://placehold.co/60"} alt="workspace" />
            <p>{workspace.name}</p>
          </Link>
        ))}
      </div>

      <Link to={"#"} className="settings">
        <FontAwesomeIcon icon={faGear} />
      </Link>
    </div>
  );
};

export default WorkspacesSideBar;
