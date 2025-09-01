/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";

/** ---- Response Types ---- */
export interface GQLErrorExtension {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export interface GQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: GQLErrorExtension;
}

export interface GraphQLSuccessResponse<T> {
  data: T;
  errors?: never;
}

export interface GraphQLErrorResponse {
  data: null;
  errors: GQLError[];
}

export type GraphQLResponse<T> =
  | GraphQLSuccessResponse<T>
  | GraphQLErrorResponse;

/** ---- Normalized API Response ---- */
export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  message: string | null;
  errors?: GQLError[];
  pagination?: unknown;
  response?: unknown;
}

/** ---- Axios Instance Factory ---- */
const createAxiosFetch = () => {
  const axiosFetch = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_GQL_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /** ---- Request Interceptor ---- */
  axiosFetch.interceptors.request.use((config: any) => {
    const token = Cookies.get("TOKEN");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const ws = JSON.parse(sessionStorage.getItem("workspace") || "{}");
    const team = JSON.parse(sessionStorage.getItem("team") || "{}");
    const room = JSON.parse(sessionStorage.getItem("room") || "{}");
    config.headers = {
      ...config.headers,
      workspaceid: ws?.state?.id,
      teamid: team?.state?.id,
      roomid: room?.state?.id,
    };

    return config;
  });

  /** ---- Response Interceptor ---- */
  axiosFetch.interceptors.response.use(
    (response: any) => {
      // GraphQL error case
      if ("errors" in response.data && response.data.errors?.length) {
        const errorResponse: ApiResponse = {
          data: null,
          status: response.data.errors[0]?.extensions?.code ?? 500,
          message: response.data.errors[0]?.message ?? "Unexpected Error",
          errors: response.data.errors,
          response: response.data,
        };
        throw errorResponse;
      }

      response.data = {
        data: response?.data?.data as GraphQLSuccessResponse<any>,
        status: response.status,
        message: response?.message ?? "Success",
        pagination: (response.data as any)?.pagination ?? null,
        response: response.data,
      };

      return response;
    },
    (error: any) => {
      const errorResponse: ApiResponse = {
        data: null,
        status: error.response?.status ?? 500,
        message:
          error.response?.data?.message ?? error.message ?? "Unexpected error",
        errors: error.response?.data?.errors,
      };
      throw errorResponse;
    }
  );

  return axiosFetch;
};

/** ---- Export Singleton ---- */
const AxiosFetch = createAxiosFetch();
export default AxiosFetch;
