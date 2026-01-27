import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

const Auth = lazy(() => import("./pages/Authentication"));
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const Chat = lazy(() => import("./pages/chat/chat"));
const Invite = lazy(() => import("./pages/invite/Invite"));

import ProtectedLayout from "./components/providers/protected-layout";

function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#ADBC9F]/20 border-t-[#12372A] dark:border-t-[#ADBC9F]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-[#12372A] dark:bg-[#ADBC9F] rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-foreground animate-pulse">
        Synchronizing workspace...
      </p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/chats" element={<Chat />} />
            <Route path="/invite/:id" element={<Invite />} />
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
