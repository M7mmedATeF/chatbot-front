import { createBrowserRouter } from "react-router";
import Test from "../../view/pages/Test";
import LoginPage from "../../view/pages/auth/login/LoginPage";
import RegisterPage from "../../view/pages/auth/Register/RegisterPage";
import WorkspaceLayout, {
  SelectWorkspace,
} from "../../view/layouts/WorkspaceLayout/WorkspaceLayout";
import TeamLayout, {
  SelectTeam,
} from "../../view/layouts/TeamLayout/TeamLayout";
import RoomLayout, {
  SelectRoom,
} from "../../view/layouts/RoomLayout/RoomLayout";
import Conversation from "../../view/pages/conversation/Conversation";
import CreateWorkspace from "../../view/pages/workspace/Create/CreateWorkspace";
import CreateTeam from "../../view/pages/team/Create/CreateTeam";
import WorkspaceAgentsList from "../../view/pages/workspace/AgentsList/WorkspaceAgentsList";
import TeamAgentsList from "../../view/pages/team/AgentsList/TeamAgentsList";
import AssignTeamAgent from "../../view/pages/team/AssignAgent/AssignTeamAgent";
import NotFoundPage from "../../view/pages/404Page/NotFoundPage";
import ProfileLayout from "../../view/layouts/ProfileLayout/UserProfile";
import UserProfile from "../../view/pages/profile/UserProfile/UserProfile";
import AccountSettings from "../../view/pages/profile/AccountSettings/AccountSettings";
import SecuritySettings from "../../view/pages/profile/SecuritySettings/SecuritySettings";
import DashboardLayout from "../../view/layouts/DashboardLayout/DashboardLayout";
import AuthGaurd from "../../utils/Gaurds/AuthGaurd";
import Dashboard from "../../view/pages/admin/dashboard/Dashboard";
import AdminMCPsList from "../../view/pages/admin/mcps/AdminMCPsList";

const MainRoutes = createBrowserRouter([
  {
    path: "auth",
    children: [
      {
        path: "login",
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
          {
            path: "admin",
            element: <LoginPage isAdmin />,
          },
        ],
      },
      {
        path: "register",
        Component: RegisterPage,
      },
    ],
  },
  {
    path: "/",
    element: (
      <AuthGaurd>
        <WorkspaceLayout />
      </AuthGaurd>
    ),
    children: [
      {
        index: true,
        element: <SelectWorkspace />,
      },
      {
        path: "workspace",
        children: [
          {
            index: true,
            element: <SelectWorkspace />,
          },
          {
            path: "create",
            element: <CreateWorkspace />,
          },
          {
            path: ":wsId/edit",
            element: <CreateWorkspace editMode />,
          },
          {
            path: ":wsId",
            element: <TeamLayout />,
            children: [
              {
                index: true,
                element: <SelectTeam />,
              },
              {
                path: "agents",
                children: [
                  {
                    index: true,
                    element: <WorkspaceAgentsList />,
                  },
                ],
              },
              {
                path: "team",
                children: [
                  {
                    index: true,
                    element: <SelectTeam />,
                  },
                  {
                    path: ":teamId",
                    element: <RoomLayout />,
                    children: [
                      {
                        index: true,
                        element: <SelectTeam />,
                      },
                      {
                        path: "edit",
                        element: <CreateTeam editMode />,
                      },
                      {
                        path: "room",
                        children: [
                          {
                            index: true,
                            element: <SelectRoom />,
                          },
                          {
                            path: ":roomId",
                            element: <Conversation />,
                          },
                        ],
                      },
                      {
                        path: "agents",
                        children: [
                          {
                            index: true,
                            element: <TeamAgentsList />,
                          },
                          {
                            path: "assign",
                            element: <AssignTeamAgent />,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <UserProfile />,
          },
          {
            path: "settings",
            children: [
              {
                index: true,
                element: <AccountSettings />,
              },
              {
                path: "security",
                element: <SecuritySettings />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "admin",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "mcps",
        element: <AdminMCPsList />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
]);

export default MainRoutes;
