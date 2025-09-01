import { useEffect, useMemo } from "react";
import { Outlet, useLocation, useParams, useSearchParams } from "react-router";
import "./WorkspaceLayout.css";
import bot from "../../../assets/images/bot.png";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useActiveWorkspace } from "../../../stores/workspace.store";
import { faHome } from "@fortawesome/free-regular-svg-icons";
import { useControllerContext } from "../../../context/ControllerContext";
import {
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { useActiveTeam } from "../../../stores/team.store";
import Modal from "../../components/Modal/Modal";
import CreateTeam from "../../pages/team/Create/CreateTeam";

const WorkspaceLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { wsId, teamId } = useParams();
  const { updateTeamId, updateWsId } = useControllerContext();
  const workspaces = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => {
      return {
        id: index,
        name: `Workspace ${index}`,
      };
    });
  }, []);
  const teams = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => {
      return {
        id: index,
        name: `Team ${index}`,
      };
    });
  }, []);
  const { name, addWorskpace, removeWorkspace }: any = useActiveWorkspace(
    (state) => state
  );
  const {
    name: teamName,
    addTeam,
    removeTeam,
  }: any = useActiveTeam((state) => state);

  useEffect(() => {
    if (pathname == "/") removeWorkspace();
  }, [pathname, removeWorkspace, searchParams]);

  useEffect(() => {
    updateWsId(wsId || "");
    if (teamId) addTeam({ id: teamId, name: teamName });
    else removeTeam();
  }, [wsId, updateWsId]);

  useEffect(() => {
    updateTeamId(teamId || "");
  }, [teamId, updateTeamId]);

  return (
    <main className="workspace-layout">
      <header className={`glass-bg ${wsId ? "show" : ""}`}>
        <ul className="dropdown-list breadcrumb-list">
          {pathname == "/" ? (
            <li className="dd-start">
              <Button href="/workspace/create">
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </li>
          ) : (
            <li className="dd-start">
              <Button href="/">
                <FontAwesomeIcon icon={faHome} />
              </Button>
            </li>
          )}

          <li className="dd-start">
            <span>{name || "My Workspaces"}</span>
            <ul className="glass-bg">
              {workspaces.length > 0 &&
                workspaces.map((ws) => (
                  <li key={ws.id}>
                    <Button
                      href={`/workspace/${ws.id}`}
                      onClick={() => addWorskpace(ws)}
                    >
                      {ws.name}
                    </Button>
                  </li>
                ))}
            </ul>
          </li>

          {wsId && (
            <li className="dd-start">
              <span>{teamName || "Select Team"}</span>
              <ul className="glass-bg">
                {teams.length > 0 &&
                  teams.map((team) => (
                    <li key={team.id}>
                      <Button
                        href={`/workspace/${wsId}/team/${team.id}`}
                        onClick={() => addTeam(team)}
                      >
                        {team.name}
                      </Button>
                    </li>
                  ))}
              </ul>
            </li>
          )}
        </ul>

        <ul className="dropdown-list">
          {wsId && (
            <li>
              <Button
                className="tooltip tooltip-bottom"
                data-tooltip="Workspace Settings"
              >
                <AiOutlineSetting />
              </Button>
            </li>
          )}
          <li>
            <Button>
              <AiOutlineUser />
            </Button>
            <ul className="glass-bg">
              <li>
                <Button>
                  <AiOutlineUser /> <span> John Doe</span>
                </Button>
              </li>
              <li>
                <Button>
                  <AiOutlineSetting /> <span> Settings</span>
                </Button>
              </li>
              <li>
                <Button theme="danger">
                  <AiOutlineLogout />
                  <span>Logout</span>
                </Button>
              </li>
            </ul>
          </li>
        </ul>
      </header>

      <div className="view-area">
        <Outlet />
      </div>

      <Modal
        open={
          searchParams.get("create") == "team" ||
          searchParams.get("edit") == "team"
        }
        title={searchParams.get("edit") == "team" ? "Edit Team" : "Create Team"}
        onClose={() => {
          setSearchParams({});
        }}
        size="lg"
      >
        <CreateTeam editMode={searchParams.get("edit") == "team"} />
      </Modal>
    </main>
  );
};

export const SelectWorkspace = () => {
  return (
    <>
      <div className="select-workspace-area">
        <img src={bot} alt="bot" />
        <h1>MCP Chatbot</h1>
        <p>Select a workspace to get started</p>
        <Button href="/workspace/create" theme="primary">
          Start your workspace
        </Button>
      </div>
    </>
  );
};

export default WorkspaceLayout;
