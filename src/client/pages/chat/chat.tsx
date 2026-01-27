import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
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
import {
  fetchChannelByIdAsync,
  getChannelsAsync,
} from "@/src/client/redux/slices/channelSlice";
import { RootState } from "@/src/client/redux/store";
import { useEffect, useState } from "react";
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

export default function Chat() {
  const dispatch = useAppDispatch();
  const { channels, loading } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  useEffect(() => {
    dispatch(getChannelsAsync());
  }, [dispatch]);

  const { selectedChannelId, setSelectedChannelId, selectedChannel } =
    useChannelSelection(channels);

  useChannelConnection(selectedChannelId);

  if (loading && channels.length === 0) {
    return <LoadingSpinner />;
  }

  const handleCurrentChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    dispatch(fetchChannelByIdAsync(channelId));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen h-[100dvh] bg-gradient-to-br from-[#ADBC9F]/20 to-white dark:from-[#12372A] dark:via-[#12372A] dark:to-[#ADBC9F]/10 w-full overflow-hidden">
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

        {/* Right Panel - Mobile Sheet */}
        <Sheet open={showMobilePanel} onOpenChange={setShowMobilePanel}>
          <SheetContent
            side="right"
            className="w-full sm:w-80 p-0 dark:bg-[#12372A] dark:border-white/10"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Channel Panel</SheetTitle>
            </SheetHeader>
            <RightPanel channelId={selectedChannelId} />
          </SheetContent>
        </Sheet>
      </div>
    </SidebarProvider>
  );
}
