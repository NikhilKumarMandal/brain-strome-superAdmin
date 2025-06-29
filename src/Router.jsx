import { createBrowserRouter } from "react-router-dom";
import Root from "./layouts/Root";
import NoAuth from "./Layouts/NoAuth";
import Dashboard from "./Layouts/Dashboard";
import LoginPage from "./pages/LoginPage";
import DumpCSV from "./pages/DumpCSV";
import StatsPage from "./pages/StatsPage";
import SendEmailPage from "./pages/SendEmailPage";
import ControlPage from "./pages/ControlPage";

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
            element: <StatsPage />,
          },
          {
            path: "/dump-csv",
            element: <DumpCSV />,
          },
          {
            path: "/send-mail",
            element: <SendEmailPage />,
          },
          {
            path: "/control",
            element: <ControlPage />,
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
