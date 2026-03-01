import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail } from "lucide-react";
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
} from "@/src/client/components/ui";
import { useAuthStore } from "@/src/client/stores/auth-store";
import { useLogin } from "@/src/client/hooks/api/use-auth-queries";
import { socketManager } from "@/src/client/lib/socket-manager";
import { IconInput, PasswordInput, SubmitButton } from "../ui/auth-fields";

export default function LoginForm() {
  const { loading } = useAuthStore();
  const login = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.from || "/chats";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      await login.mutateAsync(values);
      socketManager.connect();
      navigate(redirectPath, { replace: true });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                Email
              </FormLabel>
              <FormControl>
                <IconInput
                  icon={Mail}
                  type="email"
                  placeholder="your@email.com"
                  disabled={loading}
                  {...field}
                />
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
                <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                  Password
                </FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="text-xs sm:text-sm text-[#ADBC9F] hover:text-[#12372A] dark:hover:text-white p-0 h-auto font-medium"
                >
                  Forgot?
                </Button>
              </div>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <SubmitButton loading={loading}>
          Sign In
          <CheckCircle2 className="w-5 h-5 ml-2" />
        </SubmitButton>
      </form>
    </Form>
  );
}
