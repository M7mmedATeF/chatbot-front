import React, { createContext, useContext, useEffect, useState } from "react";

type ControllerContextType = {
  wsId: string | undefined;
  teamId: string | undefined;
  updateWsId: (wsId: string) => void;
  updateTeamId: (teamId: string) => void;
};

const ControllerContext = createContext<ControllerContextType | undefined>(
  undefined
);

export const ControllerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wsId, setWsId] = useState<string | undefined>(undefined);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);

  useEffect(() => {
    sessionStorage.setItem("teamId", teamId || "");
    console.log("teamId", teamId || "");
  }, [teamId]);

  useEffect(() => {
    sessionStorage.setItem("wsId", wsId || "");
    console.log("wsId", wsId || "");
  }, [wsId]);

  return (
    <ControllerContext.Provider
      value={{ wsId, teamId, updateWsId: setWsId, updateTeamId: setTeamId }}
    >
      {children}
    </ControllerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useControllerContext = () => {
  const context = useContext(ControllerContext);
  if (context === undefined) {
    throw new Error("useController يجب أن يُستخدم داخل ControllerProvider");
  }
  return context;
};
