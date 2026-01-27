/**
 * Theme Toggle Component
 *
 * A button to toggle between light and dark modes.
 * Can be used in headers, settings, or anywhere theme switching is needed.
 */

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "@/src/client/contexts/ThemeContext";
import { cn } from "@/src/client/lib/utils";

interface ThemeToggleProps {
  /** Show all three options (light/dark/system) or just toggle */
  showSystem?: boolean;
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Simple theme toggle button (switches between light and dark)
 */
export function ThemeToggle({
  className,
  size = "md",
}: Omit<ThemeToggleProps, "showSystem">) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center rounded-lg border border-border bg-background hover:bg-accent transition-colors focus-ring",
        sizes[size],
        className,
      )}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className={cn(iconSizes[size], "text-yellow-500")} />
      ) : (
        <Moon className={cn(iconSizes[size], "text-slate-700")} />
      )}
    </button>
  );
}

/**
 * Theme switcher with all three options (light/dark/system)
 */
export function ThemeSwitcher({
  className,
}: Pick<ThemeToggleProps, "className">) {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className={cn("flex gap-1 p-1 rounded-lg bg-muted", className)}>
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-label={`Set ${label} theme`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Dropdown theme selector for compact spaces
 */
export function ThemeDropdown({
  className,
}: Pick<ThemeToggleProps, "className">) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className={cn("relative", className)}>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="appearance-none bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm font-medium cursor-pointer hover:bg-accent transition-colors focus-ring"
        aria-label="Select theme"
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {resolvedTheme === "dark" ? (
          <Moon className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Sun className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

export default ThemeToggle;
