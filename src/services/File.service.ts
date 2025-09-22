import axios from "axios";
import type { MCPType } from "../view/pages/admin/mcps/AdminMCPsList";

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    file_path: string;
    file_type: string;
    original_name: string;
    size: number;
    createdAt: string;
  };
}

export interface McpUploadResponse {
  success: boolean;
  message: string;
  data: {
    file_path: string;
    file_type: MCPType;
    original_name: string;
    size: string;
  };
}

export const uploadFile = async (
  file: File,
  options?: { onUploadProgress?: (event: any) => void }
): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/filemanager/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    }
  );

  return response.data as FileUploadResponse;
};

export const uploadMcpFile = async (
  file: File,
  options?: { onUploadProgress?: (event: any) => void }
): Promise<McpUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/filemanager/upload/mcp",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    }
  );

  return response.data as McpUploadResponse;
};
