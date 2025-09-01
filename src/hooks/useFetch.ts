import { useNavigate } from "react-router";
import { activeRoutes } from "../router/ActiveRoutes";
import { toast } from "react-toastify";

interface ShowPopups {
  error?: boolean;
  success?: boolean;
}

const useFetch = () => {
  const nav = useNavigate();

  const fetchData = async (
    service: (...args: any[]) => Promise<any>,
    showPopups: ShowPopups = {},
    ...params: any[]
  ) => {
    const controls = {
      error: true,
      success: false,
      ...showPopups,
    };
    let response = null;

    try {
      response = await service(...params);
    } catch (err) {
      response = err;
    }

    if (response.status === 401) {
      nav(activeRoutes.auth.login);
    }

    if (response.status >= 300 && controls.error) {
      toast.error(response?.message || "Something went wrong");
    }
    if (response.status < 300 && controls.success) {
      toast.success(response.message);
    }

    return response;
  };

  return fetchData;
};

export default useFetch;
