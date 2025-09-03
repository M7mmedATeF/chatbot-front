import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import "./WorkspaceLayout.css";
import bot from "../../../assets/images/bot.png";
import Button from "../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { faHome } from "@fortawesome/free-regular-svg-icons";
import { useActiveWorkspace } from "../../../stores/workspace.store";
import { useControllerContext } from "../../../context/ControllerContext";
import {
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { useActiveTeam } from "../../../stores/team.store";
import Modal from "../../components/Modal/Modal";
import CreateTeam from "../../pages/team/Create/CreateTeam";
import { useWorkspaces } from "../../../hooks/useWorkspaces";
import { useTeams } from "../../../hooks/useTeams";
import Loader from "../../components/Loader/Loader";
import { useUser } from "../../../stores/user.store";

const WorkspaceLayout = () => {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { wsId, teamId } = useParams();
  const { updateTeamId, updateWsId } = useControllerContext();

  const { user, removeUser }: any = useUser();

  // Shared workspaces query
  const {
    data: workspacesData,
    isLoading: loadingWorkspaces,
    error: workspacesError,
    refetch: refetchWorkspaces,
  } = useWorkspaces();
  // Shared teams query (current user's teams)
  const {
    data: teamsData,
    isLoading: loadingTeams,
    error: teamsError,
    refetch: refetchTeams,
  } = useTeams();
  const {
    id: activeWorkspaceId,
    name: activeWorkspaceName,
    setActiveWorkspace,
    clearActiveWorkspace,
  } = useActiveWorkspace();
  const {
    id: activeTeamId,
    name: activeTeamName,
    setActiveTeam,
    clearActiveTeam,
  } = useActiveTeam();

  useEffect(() => {
    if (pathname == "/") clearActiveWorkspace();
  }, [pathname, searchParams, clearActiveWorkspace]);

  useEffect(() => {
    updateWsId(wsId || "");
    if (!teamId) clearActiveTeam();
  }, [wsId, teamId, updateWsId, clearActiveTeam]);

  useEffect(() => {
    updateTeamId(teamId || "");
  }, [teamId, updateTeamId]);

  // Auto-select workspace from URL if not already active
  useEffect(() => {
    if (wsId && workspacesData?.myWorkspaces && activeWorkspaceId !== wsId) {
      const workspace = workspacesData.myWorkspaces.find(
        (ws) => ws.id === wsId
      );
      if (workspace) {
        setActiveWorkspace({
          id: workspace.id,
          name: workspace.name,
          createdAt: workspace.createdAt,
        });
      }
    }
  }, [wsId, workspacesData, activeWorkspaceId, setActiveWorkspace]);

  // Auto-select team from URL if not already active
  useEffect(() => {
    if (teamId && teamsData?.listMyTeams && activeTeamId !== teamId) {
      const team = teamsData.listMyTeams.find((t) => t.id === teamId);
      if (team) {
        setActiveTeam({
          id: team.id,
          name: team.name,
          createdAt: team.createdAt,
          updatedAt: team.updatedAt,
        });
      }
    }
  }, [teamId, teamsData, activeTeamId, setActiveTeam]);

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
            <span>{activeWorkspaceName || "My Workspaces"}</span>
            <ul className="glass-bg">
              {loadingWorkspaces ? (
                <li>
                  <Loader />
                  <span>Loading workspaces...</span>
                </li>
              ) : workspacesError ? (
                <li>
                  <span>Error loading workspaces</span>
                  <Button onClick={() => refetchWorkspaces()}>Retry</Button>
                </li>
              ) : (workspacesData?.myWorkspaces || []).length > 0 ? (
                (workspacesData?.myWorkspaces || []).map((ws) => (
                  <li key={ws.id}>
                    <Button
                      href={`/workspace/${ws.id}`}
                      onClick={() =>
                        setActiveWorkspace({
                          id: ws.id,
                          name: ws.name,
                          createdAt: ws.createdAt,
                        })
                      }
                    >
                      {ws.name}
                    </Button>
                  </li>
                ))
              ) : (
                <li>
                  <span>No workspaces found</span>
                  <Button onClick={() => refetchWorkspaces()}>Retry</Button>
                </li>
              )}
            </ul>
          </li>

          {wsId && (
            <li className="dd-start">
              <span>{activeTeamName || "Select Team"}</span>
              <ul className="glass-bg">
                {loadingTeams ? (
                  <li>
                    <Loader />
                    <span>Loading teams...</span>
                  </li>
                ) : teamsError ? (
                  <li>
                    <span>Error loading teams</span>
                    <Button onClick={() => refetchTeams()}>Retry</Button>
                  </li>
                ) : (teamsData?.listMyTeams || []).length > 0 ? (
                  (teamsData?.listMyTeams || []).map((team) => (
                    <li key={team.id}>
                      <Button
                        href={`/workspace/${wsId}/team/${team.id}`}
                        onClick={() =>
                          setActiveTeam({
                            id: team.id,
                            name: team.name,
                            createdAt: team.createdAt,
                            updatedAt: team.updatedAt,
                          })
                        }
                      >
                        {team.name}
                      </Button>
                    </li>
                  ))
                ) : (
                  <li>
                    <span>No teams found</span>
                    <Button onClick={() => refetchTeams()}>Retry</Button>
                  </li>
                )}
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
                <Button href="/profile">
                  <AiOutlineUser /> <span> {user.name}</span>
                </Button>
              </li>
              <li>
                <Button>
                  <AiOutlineSetting /> <span> Settings</span>
                </Button>
              </li>
              <li>
                <Button
                  theme="danger"
                  onClick={() => {
                    removeUser();
                    nav("/auth/login");
                  }}
                >
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
