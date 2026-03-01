import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle2, Mail, User } from "lucide-react";

import { useAuthStore } from "@/src/client/stores/auth-store";
import { useRegister } from "@/src/client/hooks/api/use-auth-queries";
import { RegisterSchema } from "@/src/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/client/components/ui";
import { IconInput, PasswordInput, SubmitButton } from "../ui/auth-fields";

interface RegisterFormProps {
  onTabChange: (tab: string) => void;
}

export default function RegisterForm({ onTabChange }: RegisterFormProps) {
  const { loading } = useAuthStore();
  const register = useRegister();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      await register.mutateAsync(values);
      form.reset();
      onTabChange("login");
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
            name="name"
            render={({ field }) => (
              <FormItem className="sm:w-1/2">
                <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                  Full Name
                </FormLabel>
                <FormControl>
                  <IconInput
                    icon={User}
                    type="text"
                    placeholder="John Doe"
                    disabled={loading}
                    {...field}
                  />
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
                Confirm Password
              </FormLabel>
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
          Create Account
          <CheckCircle2 className="w-5 h-5 ml-2" />
        </SubmitButton>
      </form>
    </Form>
  );
}
