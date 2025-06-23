import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";

export default function Dashboard() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  return <Outlet />;
}
