import { useCallback } from "react";
import {
  useContextMenu,
  type ContextMenuItem,
} from "../context/ContextMenuContext";

export const useContextMenuHandler = () => {
  const { openMenu } = useContextMenu();

  const handleContextMenu = useCallback(
    (items: ContextMenuItem[]) => {
      return (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        openMenu(items, {
          x: event.clientX,
          y: event.clientY,
        });
      };
    },
    [openMenu]
  );

  return handleContextMenu;
};
