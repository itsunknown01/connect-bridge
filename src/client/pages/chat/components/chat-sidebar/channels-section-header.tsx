import { Button } from "@/src/client/components/ui";
import { SidebarGroupLabel } from "@/src/client/components/ui/sidebar";
import { useAppDispatch } from "@/src/client/hooks";
import { onOpen } from "@/src/client/redux/slices/modalSlice";
import { Plus } from "lucide-react";

export default function ChannelsSectionHeader() {
  const dispatch = useAppDispatch();
  return (
    <div className="py-2 flex items-center justify-between">
      <SidebarGroupLabel className="text-sm font-semibold text-[#12372A]">
        Channels
      </SidebarGroupLabel>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-[#ADBC9F] hover:text-[#12372A] hover:bg-[#ADBC9F]/10"
        onClick={() => dispatch(onOpen("createChannel"))}
        aria-label="Create new channel"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}