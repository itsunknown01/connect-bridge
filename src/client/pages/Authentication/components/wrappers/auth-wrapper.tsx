import { ReactNode } from "react";
import { Button } from "@/src/client/components/ui/Button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/client/components/ui/Card";
import CardWrapper from "@/src/client/components/ui/CardWrapper";

interface AuthWrapperProps {
  className?: string;
  heading: string;
  tab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const TAB_CONFIG = {
  login: {
    description: "Sign in to continue to your account",
    prompt: "Don't have an account?",
    action: "Sign up free",
    target: "register",
  },
  register: {
    description: "Create your account to get started",
    prompt: "Already have an account?",
    action: "Sign in",
    target: "login",
  },
} as const;

export default function AuthWrapper({
  className,
  heading,
  tab,
  onTabChange,
  children,
}: AuthWrapperProps) {
  const config = TAB_CONFIG[tab as keyof typeof TAB_CONFIG] ?? TAB_CONFIG.login;

  return (
    <CardWrapper
      className={`${className || ""} bg-white/90 dark:bg-[#12372A]/90 backdrop-blur-xl border-[#ADBC9F]/30 dark:border-[#ADBC9F]/20 shadow-2xl shadow-[#12372A]/10 dark:shadow-black/20`}
    >
      <CardHeader className="text-center space-y-4 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] dark:from-[#ADBC9F] dark:to-white rounded-2xl mx-auto shadow-lg">
          <span className="text-2xl sm:text-3xl">🎉</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-[#12372A] dark:text-white">
          {heading}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-[#12372A]/60 dark:text-white/70">
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter className="flex justify-center pb-6">
        <p className="text-xs sm:text-sm text-[#12372A]/60 dark:text-white/60">
          {config.prompt}{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => onTabChange(config.target)}
            className="text-[#12372A] dark:text-[#ADBC9F] font-bold hover:underline p-0 h-auto"
          >
            {config.action}
          </Button>
        </p>
      </CardFooter>
    </CardWrapper>
  );
}
