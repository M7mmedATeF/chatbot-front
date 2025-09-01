import "./App.css";
import { RouterProvider } from "react-router";
import MainRoutes from "./router/routes/MainRoutes";
import { ControllerProvider } from "./context/ControllerContext";

function App() {
  return (
    <>
      <ControllerProvider>
        <RouterProvider router={MainRoutes} />
      </ControllerProvider>
    </>
  );
}

export default App;
