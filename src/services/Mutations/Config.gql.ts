import AxiosFetch from "../AxiosFetch";
import type { ApiResponse } from "../AxiosFetch";

// GraphQL mutation string
export const CreateConfigMutation = `
mutation CreateConfig($config: [ConfigInput!]!) {
    createConfig(createUpdateConfigInput: { configs: $config }) {
        id
        key
        value
    }
}
`;

// Types for the mutation variables
export interface ConfigItem {
  key: string;
  value: string;
}

export interface CreateUpdateConfigInput {
  config: ConfigItem[];
}

// Types for the mutation response
export interface ConfigResponse {
  id: number;
  key: string;
  value: string;
}

export interface CreateConfigResponse {
  createConfig: ConfigResponse[];
}

// Mutation function using AxiosFetch
export const createConfigMutation = async (
  variables: CreateUpdateConfigInput
): Promise<CreateConfigResponse> => {
  const response = await AxiosFetch.post<ApiResponse<CreateConfigResponse>>(
    "",
    {
      query: CreateConfigMutation,
      variables,
    }
  );

  return response.data.data as CreateConfigResponse;
};
