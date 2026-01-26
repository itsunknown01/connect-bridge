import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/src/client/components/ui/sidebar";
import { Channel } from "@/src/client/lib/types";
import {
  WorkspaceHeader,
  ChatUser,
  ChannelItem,
  ChannelsSectionHeader,
} from "./";
import { VList } from "virtua";

interface ChatSidebarProps {
  channels: Channel[];
  selectedChannel: string | null;
  onSelectChannel: (channelId: string) => void;
}

export default function ChatSidebar({
  channels,
  selectedChannel,
  onSelectChannel,
}: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-[#12372A]/5 backdrop-blur-sm">
      <SidebarHeader>
        <WorkspaceHeader />
      </SidebarHeader>
      {/* Channels Header */}
      <SidebarContent className="p-0 overflow-hidden">
        <SidebarGroup className="h-full flex flex-col">
          <ChannelsSectionHeader />
          <SidebarMenu className="flex-1 min-h-0 px-2 mt-2">
            <VList className="h-full w-full scrollbar-thin overflow-y-auto">
              {channels.map((channel) => (
                <div key={channel.id} className="mb-1 uppercase">
                  <ChannelItem
                    channel={channel}
                    isSelected={selectedChannel === String(channel?.id)}
                    onSelect={onSelectChannel}
                  />
                </div>
              ))}
            </VList>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ChatUser />
      </SidebarFooter>
      <SidebarRail />
    </div>
  );
}
