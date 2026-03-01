import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth-store";
import { useRefreshToken, useLogout } from "../../hooks/api/use-auth-queries";
import { socketManager } from "../../lib/socket-manager";
import ModalProvider from "./modal-provider.tsx";

export default function ProtectedLayout() {
  const location = useLocation();
  const { accessToken, loading } = useAuthStore();
  const refreshToken = useRefreshToken();
  const logout = useLogout();

  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("authenticated") || "false"),
  );

  if (!isAuthenticated && accessToken != null) {
    localStorage.setItem("authenticated", JSON.stringify(true));
    setIsAuthenticated(true);
  }

  useEffect(() => {
    if (accessToken != null) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("authenticated");
      setHasAttemptedRefresh(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      socketManager.connect();
    } else {
      socketManager.disconnect();
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshToken.mutateAsync();
      } catch {
        // Silent refresh failure - trigger logout
        logout.mutate();
        socketManager.disconnect();
      } finally {
        setHasAttemptedRefresh(true);
      }
    };

    if (!isAuthenticated || accessToken == null) {
      checkAuth();
    } else {
      setHasAttemptedRefresh(true);
    }
  }, [accessToken, isAuthenticated]);

  if (!hasAttemptedRefresh) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ADBC9F] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && accessToken == null)
    return <Navigate to="/auth" state={{ from: location }} replace />;

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ADBC9F] border-t-transparent" />
      </div>
    );
  return (
    <>
      <Outlet />
      <ModalProvider />
    </>
  );
}
