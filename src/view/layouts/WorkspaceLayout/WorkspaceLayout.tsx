import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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
  AiOutlinePlus,
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
import Input from "../../components/Input/Input";
import { useCreateConfig } from "../../../hooks/useCreateConfig";
import { useListConfigs } from "../../../hooks/useListConfigs";
import type { ListConfigsResponse } from "../../../services/Queries/Config.gql";
import Image from "../../components/Image/Image";
import { useContextMenuHandler } from "../../../hooks/useContextMenuHandler";
import { RouteParser } from "../../../router/RouteParser";
import { activeRoutes } from "../../../router/ActiveRoutes";

const WorkspaceLayout = () => {
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { wsId, teamId } = useParams();
  const { updateTeamId, updateWsId } = useControllerContext();
  const queryClient = useQueryClient();

  // Configuration modal state
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form setup for configuration
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      geminiModel: "",
      googleApiKey: "",
    },
  });

  // Config mutation hook
  const createConfigMutation = useCreateConfig();

  // Config query hook
  const { data: configsData, isLoading: configsLoading } = useListConfigs() as {
    data: ListConfigsResponse | undefined;
    isLoading: boolean;
  };

  // Configuration form handlers
  const onConfigSubmit = async (data: any) => {
    try {
      await createConfigMutation.mutateAsync({
        config: [
          {
            key: "GEMINI_MODEL",
            value: data.geminiModel,
          },
          {
            key: "GOOGLE_API_KEY",
            value: data.googleApiKey,
          },
        ],
      });
      setShowConfigModal(false);
      reset();
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  const handleConfigModalClose = () => {
    setShowConfigModal(false);
    reset();
  };

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

  useEffect(() => {
    const isAdmin = !!user.AdminAuditLog;
    if (isAdmin) nav(activeRoutes.admin.dashboard, { replace: true });
  }, []);

  // Auto-select workspace from URL if not already active
  useEffect(() => {
    if (wsId && workspacesData?.myWorkspaces && activeWorkspaceId !== wsId) {
      const workspace = workspacesData.myWorkspaces.find((ws) => ws.id == wsId);

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

  // Populate form with existing config values when configs are loaded
  useEffect(() => {
    if (configsData?.listConfigs) {
      const geminiConfig = configsData.listConfigs.find(
        (config: { id: number; key: string; value: string }) =>
          config.key === "GEMINI_MODEL"
      );
      const apiKeyConfig = configsData.listConfigs.find(
        (config: { id: number; key: string; value: string }) =>
          config.key === "GOOGLE_API_KEY"
      );

      reset({
        geminiModel: geminiConfig?.value || "",
        googleApiKey: apiKeyConfig?.value || "",
      });
    }
  }, [configsData, reset]);

  // Invalidate rooms list when active team changes
  useEffect(() => {
    if (activeTeamId) {
      queryClient.invalidateQueries({
        queryKey: ["rooms", activeTeamId],
        exact: false,
      });
    }
  }, [activeTeamId, queryClient]);

  // Invalidate teams list when active workspace changes
  useEffect(() => {
    if (activeWorkspaceId) {
      queryClient.invalidateQueries({
        queryKey: ["my-teams", activeWorkspaceId],
        exact: false,
      });
    }
  }, [activeWorkspaceId, queryClient]);

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
                onClick={() => setShowConfigModal(true)}
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
                  <AiOutlineUser /> <span> {user?.name}</span>
                </Button>
              </li>
              {/* <li>
                <Button>
                  <AiOutlineSetting /> <span> Settings</span>
                </Button>
              </li> */}
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

      <Modal
        open={showConfigModal}
        title="System Configuration"
        onClose={handleConfigModalClose}
        onSave={handleSubmit(onConfigSubmit)}
        isLoading={createConfigMutation.isPending || configsLoading}
        size="sm"
      >
        <form onSubmit={handleSubmit(onConfigSubmit)}>
          {configsLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Loader />
              <p>Loading configuration...</p>
            </div>
          ) : (
            <div className="form-group">
              <Controller
                control={control}
                name="geminiModel"
                render={({ field, fieldState }) => (
                  <Input
                    label="GEMINI_MODEL"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState?.error?.message}
                    placeholder="GEMINI_MODEL"
                  />
                )}
              />
              <Controller
                control={control}
                name="googleApiKey"
                render={({ field, fieldState }) => (
                  <Input
                    label="GOOGLE_API_KEY"
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState?.error?.message}
                    placeholder="GOOGLE_API_KEY"
                  />
                )}
              />
            </div>
          )}
        </form>
      </Modal>
    </main>
  );
};

export const SelectWorkspace = () => {
  const nav = useNavigate();
  const handleContextMenu = useContextMenuHandler();

  const { data: workspaces, isLoading: workspacesLoading } = useWorkspaces();
  return workspaces && workspaces?.myWorkspaces.length > 0 ? (
    <section className="sys_container">
      <h2 className="font-black text-4xl">Your workspaces</h2>
      <div className="workspaces-grid mt-10">
        {workspaces?.myWorkspaces.map((workspace) => (
          <Button
            className="workspace-card glass-bg"
            href={RouteParser(activeRoutes.workspace.show, {
              wsId: workspace.id,
            })}
            onContextMenu={handleContextMenu([
              ...(workspace.userRole == "OWNER"
                ? [
                    {
                      name: "Edit",
                      onClick: () => {
                        nav(`/workspace/${workspace.id}/edit`);
                      },
                    },
                  ]
                : []),
            ])}
          >
            <Image src={bot} alt="workspace" className="avatar" />
            <div>
              <p className="whitespace-nowrap">{workspace.name}</p>
              <p className="text-sm text-gray-400">{workspace.userRole}</p>
            </div>
          </Button>
        ))}
        <Button className="workspace-card glass-bg" href={`/workspace/create`}>
          <div className="avatar">
            <AiOutlinePlus />
          </div>
          <p>Create workspace</p>
        </Button>
      </div>
    </section>
  ) : (
    <div className="select-workspace-area">
      <img src={bot} alt="bot" />
      <h1>MCP Chatbot</h1>
      <p>
        {!workspacesLoading
          ? "Select a workspace to get started"
          : "Loading workspaces..."}
      </p>
      {!workspacesLoading && (
        <>
          <Button href="/workspace/create" theme="primary">
            Start your workspace
          </Button>
        </>
      )}
    </div>
  );
};

export default WorkspaceLayout;
