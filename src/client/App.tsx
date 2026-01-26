import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Auth = lazy(() => import("./pages/Authentication"));
const Home = lazy(() => import("./pages/landing/Home"));
const Chat = lazy(() => import("./pages/chat/chat"));
const Invite = lazy(() => import("./pages/invite/Invite"));

import Layout from "./components/layout";
import ProtectedLayout from "./components/providers/protected-layout";

function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#ADBC9F]/20 border-t-[#12372A]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-[#12372A] rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-[#12372A] animate-pulse">
        Synchronizing workspace...
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-[#ADBC9F] to-white from-60% ">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/chats" element={<Chat />} />
            <Route path="/invite/:id" element={<Invite />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
