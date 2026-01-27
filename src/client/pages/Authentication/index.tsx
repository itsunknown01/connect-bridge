import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/client/components/ui";
import { useState } from "react";
import LoginForm from "./components/Forms/LoginForm";
import RegisterForm from "./components/Forms/RegisterForm";
import AuthWrapper from "./components/wrappers/auth-wrapper";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#ADBC9F] to-white">
      <AuthWrapper
        heading="Welcome Back!"
        tab={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 p-1 bg-[#ADBC9F]/20 h-auto">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-[#12372A] data-[state=active]:text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base data-[state=active]:shadow-lg transition-all duration-300 text-[#12372A]"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-[#12372A] data-[state=active]:text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base data-[state=active]:shadow-lg transition-all duration-300 text-[#12372A]"
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
