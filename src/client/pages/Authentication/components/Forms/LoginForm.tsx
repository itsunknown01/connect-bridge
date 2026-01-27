import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";

import { LoginSchema } from "@/src/schemas";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/src/client/components/ui";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { loginUserAsync } from "@/src/client/redux/slices/authSlice";
import { connectRequested } from "@/src/client/redux/slices/socketSlice";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAppSelector((state) => state.authReducer);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const redirectPath = location.state?.from || "/chats";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const LoginSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const result = await dispatch(loginUserAsync(values));
    if (loginUserAsync.fulfilled.match(result)) {
      dispatch(connectRequested());
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(LoginSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#12372A]">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="your@email.com"
                    disabled={loading}
                    className="pl-10 sm:pl-12 py-3 sm:py-3.5 bg-[#ADBC9F]/10 border-2 border-transparent rounded-xl text-sm sm:text-base focus:bg-white focus:border-[#ADBC9F] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-sm font-semibold text-[#12372A]">
                  Password
                </FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="text-xs sm:text-sm text-[#ADBC9F] hover:text-[#12372A] p-0 h-auto font-medium"
                >
                  Forgot?
                </Button>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    className="pl-10 sm:pl-12 pr-12 py-3 sm:py-3.5 bg-[#ADBC9F]/10 border-2 border-transparent rounded-xl text-sm sm:text-base focus:bg-white focus:border-[#ADBC9F] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-[#ADBC9F] hover:text-[#12372A] hover:bg-transparent"
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#12372A] hover:bg-[#12372A]/90 text-white py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base mt-6 sm:mt-8 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Sign In
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
