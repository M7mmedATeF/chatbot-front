import axios from "axios";

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

export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    import.meta.env.VITE_API_URL + "/filemanager/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data as FileUploadResponse;
};
