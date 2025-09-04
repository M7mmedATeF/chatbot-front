/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useUser } from "../../stores/user.store";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { activeRoutes } from "../../router/ActiveRoutes";

const AuthGaurd = ({ children }: { children: React.ReactNode }) => {
  const nav = useNavigate();
  const { user, setUser, removeUser }: any = useUser();
  useEffect(() => {
    if (!user) {
      const userData = Cookies.get("USER");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        removeUser();
        nav(activeRoutes.auth.login);
      }
    }
  }, [user]);
  return user ? children : "";
};

export default AuthGaurd;
