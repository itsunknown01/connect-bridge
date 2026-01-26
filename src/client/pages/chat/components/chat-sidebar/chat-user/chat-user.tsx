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
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { logoutUserAsync } from "@/src/client/redux/slices/authSlice";
import { disconnectRequested } from "@/src/client/redux/slices/socketSlice";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import { UserAvatar, UserInfo } from "./";
import { onOpen } from "@/src/client/redux/slices/modalSlice";

export default function ChatUser() {
  const { currentUser: user, isOnline } = useAppSelector(
    (state) => state.authReducer,
  );
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();

  if (!user) return null;

  function handleLogout() {
    dispatch(logoutUserAsync());
    dispatch(disconnectRequested());
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
              <DropdownMenuItem
                onClick={() => dispatch(onOpen({ type: "profileSettings" }))}
              >
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
