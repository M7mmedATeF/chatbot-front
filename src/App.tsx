import "./App.css";
import { RouterProvider } from "react-router";
import MainRoutes from "./router/routes/MainRoutes";
import { ControllerProvider } from "./context/ControllerContext";
import { ContextMenuProvider } from "./context/ContextMenuContext";
import ContextMenu from "./view/components/ContextMenu/ContextMenu";

function App() {
  return (
    <>
      <ContextMenuProvider>
        <ControllerProvider>
          <RouterProvider router={MainRoutes} />
          <ContextMenu />
        </ControllerProvider>
      </ContextMenuProvider>
    </>
  );
}

export default App;
