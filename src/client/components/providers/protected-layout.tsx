import { useAppDispatch, useAppSelector } from "@/src/client/hooks/index.ts";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  logoutUserAsync,
  refreshTokenAsync,
} from "../../redux/slices/authSlice";
import {
  connectRequested,
  disconnectRequested,
} from "../../redux/slices/socketSlice.ts";
import ModalProvider from "./modal-provider.tsx";

export default function ProtectedLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { accessToken, loading } = useAppSelector((state) => state.authReducer);

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
      dispatch(connectRequested());
    } else {
      dispatch(disconnectRequested());
    }
  }, [isAuthenticated, accessToken]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(refreshTokenAsync());
      } catch {
        // Silent refresh failure - trigger logout
        dispatch(logoutUserAsync());
        dispatch(disconnectRequested());
      } finally {
        setHasAttemptedRefresh(true);
      }
    };

    if (!isAuthenticated || accessToken == null) {
      checkAuth();
    } else {
      setHasAttemptedRefresh(true);
    }
  }, [accessToken, dispatch, isAuthenticated]);

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
