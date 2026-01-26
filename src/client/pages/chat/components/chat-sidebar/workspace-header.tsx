import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/client/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";

export default function WorkspaceHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CB</span>
            </div>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Connect-Bridge</span>
            <span className="truncate text-xs">Workspace</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
