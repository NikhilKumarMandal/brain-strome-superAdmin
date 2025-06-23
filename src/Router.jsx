import { createBrowserRouter } from "react-router-dom";
import Root from "./Layouts/Root";
import NoAuth from "./Layouts/NoAuth";
import Dashboard from "./Layouts/Dashboard";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DumpCSV from "./pages/DumpCSV";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          {
            path: "/dump-csv",
            element: <DumpCSV />,
          },
        ],
      },
      {
        path: "/auth",
        element: <NoAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      // {
      //   path: "*",
      //   element: <NotFoundPage />,
      // },
    ],
  },
]);
