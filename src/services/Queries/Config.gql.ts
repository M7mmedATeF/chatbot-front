import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL query string
export const ListConfigsQuery = `
query ListConfigs {
    listConfigs {
        id
        key
        value
    }
}
`;

// Types for the query response
export interface ConfigItem {
  id: number;
  key: string;
  value: string;
}

export interface ListConfigsResponse {
  listConfigs: ConfigItem[];
}

// Query function using AxiosFetch
export const listConfigsQuery = async (): Promise<ListConfigsResponse> => {
  const response = await AxiosFetch.post<ApiResponse<ListConfigsResponse>>("", {
    query: ListConfigsQuery,
  });

  return response.data.data as ListConfigsResponse;
};
