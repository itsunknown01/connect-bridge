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
  const selectedClasses =
    "!bg-[#12372A] dark:!bg-[#ADBC9F] !text-white dark:!text-[#12372A] font-semibold";
  const defaultClasses =
    "text-[#12372A] dark:text-white/80 !hover:bg-[#12372A]/5 dark:!hover:bg-white/5 !hover:text-[#12372A] dark:!hover:text-white";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onSelect(String(channel.id))}
        isActive={isSelected}
        className={`${baseClasses} ${
          isSelected ? selectedClasses : defaultClasses
        }`}
        aria-current={isSelected ? "page" : undefined}
      >
        <Hash className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left truncate">{channel.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
