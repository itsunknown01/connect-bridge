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
    <CardWrapper className={props.className}>
      <CardHeader className="text-center space-y-4 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-2xl mx-auto">
          <span className="text-2xl sm:text-3xl">🎉</span>
        </div>
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-[#12372A]">
          {props.heading}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {props.tab === "login"
            ? "Sign in to continue to your account"
            : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-xs sm:text-sm text-gray-600">
          {props.tab === "login" ? (
            <>
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => props.onTabChange("register")}
                className="text-[#12372A] font-bold hover:underline p-0 h-auto"
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
                className="text-[#12372A] font-bold hover:underline p-0 h-auto"
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
