export const activeRoutes = {
  admin: {
    dashboard: "/admin",
  },
  auth: {
    admin: "/auth/login/admin",
    login: "/auth/login",
    register: "/auth/register",
  },
  home: "/",
  workspace: {
    index: "/workspace",
    show: "/workspace/:wsId",
    create: "/workspace/create",
    edit: "/workspace/:wsId/edit",
    agents: {
      index: "/workspace/:wsId/agents",
      assign: "/workspace/:wsId/agents/assign",
    },
  },
  team: {
    index: "/workspace/:wsId/team",
    edit: "/workspace/:wsId/team/:teamId/edit",
    agents: {
      index: "/workspace/:wsId/team/:teamId/agents",
      assign: "/workspace/:wsId/team/:teamId/agents/assign",
    },
  },
  room: {
    index: "/workspace/:wsId/team/:teamId/room",
    show: "/workspace/:wsId/team/:teamId/room/:roomId",
  },
};
