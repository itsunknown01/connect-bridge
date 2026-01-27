/**
 * Authentication Page
 *
 * Color Scheme:
 * - Light: #ADBC9F gradients, #12372A text/buttons, white cards
 * - Dark: #12372A with #ADBC9F accents, white text/buttons
 */
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/client/components/ui";
import { Switch } from "@/src/client/components/ui/switch";
import { useState } from "react";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import AuthWrapper from "./components/wrappers/auth-wrapper";
import { useTheme } from "@/src/client/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-[#12372A]/60 backdrop-blur-md border border-[#ADBC9F]/30 dark:border-white/10">
      <Sun
        className={`w-4 h-4 transition-colors ${isDark ? "text-white/40" : "text-[#ADBC9F]"}`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-[#ADBC9F] data-[state=unchecked]:bg-[#ADBC9F]/40"
      />
      <Moon
        className={`w-4 h-4 transition-colors ${isDark ? "text-[#ADBC9F]" : "text-[#12372A]/40"}`}
      />
    </div>
  );
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ADBC9F]/60 via-white to-[#ADBC9F]/30 dark:from-[#12372A] dark:via-[#0d2a1f] dark:to-[#ADBC9F]/20" />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#ADBC9F]/40 dark:bg-[#ADBC9F]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#12372A]/10 dark:bg-[#ADBC9F]/5 rounded-full blur-[120px]" />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(18,55,42,0.1) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <ThemeToggle />

      <AuthWrapper
        heading="Welcome Back!"
        tab={activeTab}
        onTabChange={setActiveTab}
        className="relative z-10"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 p-1 bg-[#ADBC9F]/20 dark:bg-white/10 h-auto rounded-xl">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-[#12372A] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#12372A] py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base data-[state=active]:shadow-lg transition-all duration-300 text-[#12372A] dark:text-white"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-[#12372A] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#12372A] py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base data-[state=active]:shadow-lg transition-all duration-300 text-[#12372A] dark:text-white"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-0">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-0">
            <RegisterForm onTabChange={setActiveTab} />
          </TabsContent>
        </Tabs>
      </AuthWrapper>
    </div>
  );
};

export default Auth;
