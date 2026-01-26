import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/client/components/ui/sidebar";
import { Channel } from "@/src/client/lib/types";
import { Hash } from "lucide-react";

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: (channelId: string) => void;
}

export default function ChannelItem({
  channel,
  isSelected,
  onSelect,
}: ChannelItemProps) {
  const baseClasses =
    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all";
  const selectedClasses = "!bg-[#12372A] !text-white font-semibold";
  const defaultClasses =
    "text-gray-700 !hover:bg-[#ADBC9F]/10 !hover:text-[#12372A]";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onSelect(String(channel.id))}
        isActive={isSelected}
        className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses
          }`}
        aria-current={isSelected ? "page" : undefined}
      >
        <Hash className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left truncate">{channel.name}</span>
        {/* {channel.unreadCount && channel.unreadCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    selectedChannel === channel.id
                      ? "bg-white/20 text-white"
                      : "bg-[#ADBC9F] text-white"
                  }`}
                >
                  {channel.unreadCount}
                </span>
              )} */}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
