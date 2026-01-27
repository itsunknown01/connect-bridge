/**
 * Auth Wrapper Component
 * Card container for auth forms with theme support
 */
import { Button } from "@/src/client/components/ui/Button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/client/components/ui/Card";
import CardWrapper, {
  CardWrapperProps,
} from "@/src/client/components/ui/CardWrapper";

interface AuthWrapperProps extends CardWrapperProps {
  className?: string;
  heading: string;
  tab: string;
  onTabChange: (tab: string) => void;
}

export default function AuthWrapper(props: AuthWrapperProps) {
  return (
    <CardWrapper
      className={`${props.className} bg-white/90 dark:bg-[#12372A]/90 backdrop-blur-xl border-[#ADBC9F]/30 dark:border-[#ADBC9F]/20 shadow-2xl shadow-[#12372A]/10 dark:shadow-black/20`}
    >
      <CardHeader className="text-center space-y-4 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] dark:from-[#ADBC9F] dark:to-white rounded-2xl mx-auto shadow-lg">
          <span className="text-2xl sm:text-3xl">🎉</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-[#12372A] dark:text-white">
          {props.heading}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-[#12372A]/60 dark:text-white/70">
          {props.tab === "login"
            ? "Sign in to continue to your account"
            : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-xs sm:text-sm text-[#12372A]/60 dark:text-white/60">
          {props.tab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => props.onTabChange("register")}
                className="text-[#12372A] dark:text-[#ADBC9F] font-bold hover:underline p-0 h-auto"
              >
                Sign up free
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => props.onTabChange("login")}
                className="text-[#12372A] dark:text-[#ADBC9F] font-bold hover:underline p-0 h-auto"
              >
                Sign in
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </CardWrapper>
  );
}
