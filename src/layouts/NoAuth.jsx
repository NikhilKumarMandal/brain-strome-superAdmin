import { useAuthStore } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function NonAuth() {
  const { user } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  if (user !== null) {
    const returnTo =
      new URLSearchParams(window.location.search).get("returnTo") || "/home";
    return <Navigate to={returnTo} replace />;
  }

  return <Outlet />;
}

export default NonAuth;
