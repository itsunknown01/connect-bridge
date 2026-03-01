import { ReactNode, useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { Button, Input } from "@/src/client/components/ui";

/* ─── Shared style tokens ─── */
const INPUT_BASE =
  "pl-10 sm:pl-12 py-3 sm:py-3.5 bg-[#ADBC9F]/10 dark:bg-white/10 border-2 border-transparent rounded-xl text-sm sm:text-base text-[#12372A] dark:text-white placeholder:text-[#12372A]/40 dark:placeholder:text-white/40 focus:bg-white dark:focus:bg-white/5 focus:border-[#ADBC9F] focus-visible:ring-0 focus-visible:ring-offset-0";

const INPUT_WITH_TOGGLE = `${INPUT_BASE} pr-12`;

/* ─── Icon Input ─── */
interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

export function IconInput({ icon: Icon, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none" />
      <Input {...props} className={`${INPUT_BASE} ${className || ""}`} />
    </div>
  );
}

/* ─── Password Input with toggle ─── */
interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  name: string;
  disabled?: boolean;
  placeholder?: string;
}

export function PasswordInput({ disabled, ...field }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#ADBC9F] pointer-events-none"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <Input
        {...field}
        type={show ? "text" : "password"}
        disabled={disabled}
        className={INPUT_WITH_TOGGLE}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow(!show)}
        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#ADBC9F] hover:text-[#12372A] dark:hover:text-white hover:bg-transparent"
        disabled={disabled}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </Button>
    </div>
  );
}

/* ─── Submit Button with loading spinner ─── */
interface SubmitButtonProps {
  loading: boolean;
  children: ReactNode;
}

export function SubmitButton({ loading, children }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base mt-6 sm:mt-8 shadow-lg hover:shadow-xl transition-all"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 dark:border-[#12372A]/30 border-t-white dark:border-t-[#12372A] rounded-full animate-spin mr-2" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
