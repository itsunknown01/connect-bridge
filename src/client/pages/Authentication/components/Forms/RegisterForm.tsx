/**
 * Register Form Component
 * Handles new user registration
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { registerUserAsync } from "@/src/client/redux/slices/authSlice";
import { RegisterSchema } from "@/src/schemas";
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
import { RootState } from "@/src/client/redux/store";

const RegisterForm = ({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading } = useAppSelector((state: RootState) => state.authReducer);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const RegisterSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    const result = await dispatch(registerUserAsync(values));
    if (registerUserAsync.fulfilled.match(result)) {
      form.reset();
      onTabChange("login");
    }
  };

  // Common input styles
  const inputStyles =
    "pl-10 sm:pl-12 py-3 sm:py-3.5 bg-[#ADBC9F]/10 dark:bg-white/10 border-2 border-transparent rounded-xl text-sm sm:text-base text-[#12372A] dark:text-white placeholder:text-[#12372A]/40 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-white/5 focus:border-[#ADBC9F] focus-visible:ring-0 focus-visible:ring-offset-0";
  const passwordInputStyles = `${inputStyles} pr-12`;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(RegisterSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:space-x-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
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
                      className={inputStyles}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
                    <Input
                      {...field}
                      type="text"
                      placeholder="John Doe"
                      disabled={loading}
                      className={inputStyles}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    className={passwordInputStyles}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-[#ADBC9F] hover:text-[#12372A] dark:hover:text-white hover:bg-transparent"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                Confirm Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    className={passwordInputStyles}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-[#ADBC9F] hover:text-[#12372A] dark:hover:text-white hover:bg-transparent"
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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
          disabled={loading}
          className="w-full bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base mt-6 sm:mt-8 shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 dark:border-[#12372A]/30 border-t-white dark:border-t-[#12372A] rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              Create Account
              <CheckCircle2 className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
