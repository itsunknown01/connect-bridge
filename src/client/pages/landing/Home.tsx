import React, { useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { selectIsAuthenticated } from "../../redux/selectors";
import { useNavigate } from "react-router-dom";

function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chats", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ADBC9F]/20 border-t-[#12372A]" />
    </div>
  );
}

export default Home;
