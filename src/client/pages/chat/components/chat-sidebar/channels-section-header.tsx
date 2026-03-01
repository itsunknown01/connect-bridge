import { Button } from "@/src/client/components/ui";
import { SidebarGroupLabel } from "@/src/client/components/ui/sidebar";
import { useModalStore } from "@/src/client/stores/modal-store";
import { Plus } from "lucide-react";

export default function ChannelsSectionHeader() {
  const { onOpen } = useModalStore();
  return (
    <div className="py-2 flex items-center justify-between">
      <SidebarGroupLabel className="text-sm font-semibold text-[#12372A] dark:text-white">
        Channels
      </SidebarGroupLabel>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-[#ADBC9F] hover:text-[#12372A] hover:bg-[#ADBC9F]/10"
        onClick={() => onOpen("createChannel")}
        aria-label="Create new channel"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
