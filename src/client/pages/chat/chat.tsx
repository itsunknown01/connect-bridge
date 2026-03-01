import { useChannelStore } from "@/src/client/stores/channel-store";
import { useModalStore } from "@/src/client/stores/modal-store";
import {
  ChatHeader,
  ChatSidebar,
  MessageInput,
  MessageList,
} from "@/src/client/pages/chat";
import {
  useChannelConnection,
  useChannelSelection,
} from "@/src/client/pages/chat/hooks";
import { useChannels } from "@/src/client/hooks/api/use-channel-queries";
import { useEffect, useRef, useState } from "react";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import RightPanel from "./components/right-panel";

function LoadingSpinner() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#ADBC9F]/30 to-white dark:from-[#12372A] dark:via-[#0d2a1f] dark:to-[#ADBC9F]/20">
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#ADBC9F] border-t-transparent dark:border-white dark:border-t-transparent" />
        <span className="text-sm text-[#12372A]/70 dark:text-white/70">
          Loading channels...
        </span>
      </div>
    </div>
  );
}

/* ─── Mobile Right Panel (SRP) ─── */
function MobileRightPanel({
  open,
  onOpenChange,
  channelId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelId: string | null;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-80 p-0 dark:bg-[#12372A] dark:border-white/10 flex flex-col"
      >
        <SheetHeader className="px-4 py-3 border-b border-[#ADBC9F]/20 dark:border-white/10 flex-shrink-0">
          <SheetTitle className="text-sm font-semibold text-[#12372A] dark:text-white">
            Channel Panel
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          <RightPanel channelId={channelId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Chat() {
  const { channels } = useChannelStore();
  const { onOpen } = useModalStore();
  const { isLoading } = useChannels();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const hasOpenedCreateModal = useRef(false);

  // Open create-channel modal only once for users with no channels
  useEffect(() => {
    if (!isLoading && channels.length === 0 && !hasOpenedCreateModal.current) {
      hasOpenedCreateModal.current = true;
      onOpen("createChannel");
    }
  }, [isLoading, channels.length, onOpen]);

  const { selectedChannelId, setSelectedChannelId, selectedChannel } =
    useChannelSelection(channels);

  useChannelConnection(selectedChannelId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleCurrentChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    const channel = channels.find((ch) => String(ch.id) === channelId);
    if (channel) {
      useChannelStore.getState().setCurrentChannel(channel);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-[100dvh] bg-gradient-to-br from-[#ADBC9F]/20 to-white dark:from-[#12372A] dark:via-[#12372A] dark:to-[#ADBC9F]/10 w-full overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          className="bg-transparent border-none flex flex-col shadow-sm"
          collapsible="icon"
        >
          <ChatSidebar
            channels={channels}
            selectedChannel={selectedChannelId}
            onSelectChannel={handleCurrentChannel}
          />
        </Sidebar>

        {/* Main Chat Area */}
        <SidebarInset className="flex-1 flex flex-col bg-transparent min-w-0">
          <ChatHeader
            currentChannel={selectedChannel}
            onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
            isRightPanelOpen={showRightPanel}
            onOpenMobilePanel={() => setShowMobilePanel(true)}
          />
          <MessageList
            currentChannel={selectedChannel}
            channelId={selectedChannelId}
          />
          <MessageInput channelId={selectedChannelId} />
        </SidebarInset>

        {/* Right Panel - Desktop */}
        {showRightPanel && (
          <aside className="hidden md:flex flex-shrink-0 animate-in slide-in-from-right-5 duration-200">
            <RightPanel channelId={selectedChannelId} />
          </aside>
        )}

        {/* Right Panel - Mobile */}
        <MobileRightPanel
          open={showMobilePanel}
          onOpenChange={setShowMobilePanel}
          channelId={selectedChannelId}
        />
      </div>
    </SidebarProvider>
  );
}
