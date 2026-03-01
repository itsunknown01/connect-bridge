import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/client/components/ui/sidebar";
import { Switch } from "@/src/client/components/ui/switch";
import { ChevronsUpDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/src/client/hooks/contexts/ThemeContext";

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <Sun
        className={`w-3.5 h-3.5 ${isDark ? "text-white/40" : "text-[#ADBC9F]"}`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-[#ADBC9F] data-[state=unchecked]:bg-[#ADBC9F]/40"
      />
      <Moon
        className={`w-3.5 h-3.5 ${isDark ? "text-[#ADBC9F]" : "text-[#12372A]/40"}`}
      />
    </div>
  );
}

export default function WorkspaceHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] dark:from-[#ADBC9F] dark:to-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-[#12372A] text-sm font-bold">
                CB
              </span>
            </div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-[#12372A] dark:text-white">
              Connect-Bridge
            </span>
            <span className="truncate text-xs text-[#12372A]/60 dark:text-white/60">
              Workspace
            </span>
          </div>
          <ThemeToggle />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
