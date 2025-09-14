import React, { createContext, useContext, useState } from "react";

export interface ContextMenuItem {
  name: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

interface ContextMenuContextType extends ContextMenuState {
  openMenu: (
    items: ContextMenuItem[],
    position: { x: number; y: number }
  ) => void;
  closeMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menuState, setMenuState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    items: [],
  });

  const openMenu = (
    items: ContextMenuItem[],
    position: { x: number; y: number }
  ) => {
    if (items.length > 0)
      setMenuState({
        isOpen: true,
        position,
        items,
      });
    else
      setMenuState({
        isOpen: false,
        position,
        items: [],
      });
  };

  const closeMenu = () => {
    setMenuState({
      isOpen: false,
      position: { x: 0, y: 0 },
      items: [],
    });
  };

  const value: ContextMenuContextType = {
    ...menuState,
    openMenu,
    closeMenu,
  };

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error("useContextMenu يجب أن يُستخدم داخل ContextMenuProvider");
  }
  return context;
};
