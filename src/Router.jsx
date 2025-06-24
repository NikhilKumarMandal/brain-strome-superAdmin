import { createBrowserRouter } from "react-router-dom";
import Root from "./Layouts/Root";
import NoAuth from "./Layouts/NoAuth";
import Dashboard from "./Layouts/Dashboard";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DumpCSV from "./pages/DumpCSV";
import StatsPage from "./pages/StatsPage";
import SendEmailPage from "./pages/SendEmailPage";

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
