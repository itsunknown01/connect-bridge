import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/client/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/client/components/ui/sidebar";
import { useAuthStore } from "@/src/client/stores/auth-store";
import { useLogout } from "@/src/client/hooks/api/use-auth-queries";
import { socketManager } from "@/src/client/lib/socket-manager";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { UserAvatar, UserInfo } from "./";
import { useModalStore } from "@/src/client/stores/modal-store";

export default function ChatUser() {
  const { currentUser: user, isOnline } = useAuthStore();
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const { onOpen } = useModalStore();

  if (!user) return null;

  function handleLogout() {
    logout.mutate();
    socketManager.disconnect();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} isOnline={isOnline} showStatus />
              <UserInfo name={user.name} isOnline={isOnline} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} isOnline={isOnline} showStatus />
                <UserInfo name={user.name} email={user.email} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onOpen("profileSettings")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
