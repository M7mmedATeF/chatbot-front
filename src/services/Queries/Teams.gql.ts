import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const TeamsQuery = `
query ListMyTeams {
    listMyTeams {
        id
        name
        createdAt
        updatedAt
    }
}
`;

// Types for the query response
export interface GraphQLTeam {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamsResponse {
  listMyTeams: GraphQLTeam[];
}

// Query function using AxiosFetch
export const fetchTeams = async (): Promise<TeamsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<TeamsResponse>>("", {
    query: TeamsQuery,
  });

  return response.data.data as TeamsResponse;
};
