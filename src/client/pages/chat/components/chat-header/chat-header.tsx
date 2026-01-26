import { Separator, Button } from "@/src/client/components/ui";
import { SidebarTrigger } from "@/src/client/components/ui/sidebar";
import {
  ChannelInfo,
  LoadingState,
  HeaderRenameInput,
  ChannelMenu,
  SearchBar,
} from "./";
import { Channel } from "@/src/client/lib/types";
import {
  LayoutPanelLeft,
  PanelRightClose,
  PanelRightOpen,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { onOpen } from "@/src/client/redux/slices/modalSlice";
import { selectCurrentUser } from "@/src/client/redux/selectors";

interface ChatHeaderProps {
  currentChannel: Channel | undefined;
  onToggleRightPanel?: () => void;
  isRightPanelOpen?: boolean;
  onOpenMobilePanel?: () => void;
}

export default function ChatHeader({
  currentChannel,
  onToggleRightPanel,
  isRightPanelOpen,
  onOpenMobilePanel,
}: ChatHeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isCreator = currentUser?.id === currentChannel?.userId;

  if (!currentChannel) {
    return <LoadingState />;
  }

  if (isSearchActive) {
    return (
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-2">
        <SearchBar
          channelId={String(currentChannel.id)}
          onClose={() => setIsSearchActive(false)}
        />
      </div>
    );
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
        {/* Left Section - Identity & Settings */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 flex-shrink-0" />
          <Separator
            orientation="vertical"
            className="h-5 sm:h-6 bg-gray-200 hidden sm:block"
          />

          {isEditing ? (
            <HeaderRenameInput
              currentChannel={currentChannel}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ChannelInfo
              channelName={currentChannel.name}
              memberCount={currentChannel.memberCount}
            />
          )}
        </div>

        {/* Right Section - Utilities & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-500 hover:text-[#12372A] hover:bg-[#ADBC9F]/10"
            onClick={() => setIsSearchActive(true)}
            aria-label="Search messages"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Panel Controls (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-gray-500 hover:text-[#12372A] hover:bg-[#ADBC9F]/10 md:hidden"
            onClick={onOpenMobilePanel}
            aria-label="Open panel"
          >
            <LayoutPanelLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Panel Controls (Desktop) */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 sm:h-9 sm:w-9 hidden md:flex ${
              isRightPanelOpen
                ? "text-[#12372A] bg-[#ADBC9F]/10"
                : "text-gray-500 hover:text-[#12372A] hover:bg-[#ADBC9F]/10"
            }`}
            onClick={onToggleRightPanel}
            aria-label={isRightPanelOpen ? "Close panel" : "Open panel"}
            aria-pressed={isRightPanelOpen}
          >
            {isRightPanelOpen ? (
              <PanelRightClose className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <PanelRightOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          {/* Global Actions Menu */}
          <ChannelMenu
            onSettingsClick={() => setIsEditing(true)}
            onInviteClick={() => dispatch(onOpen({ type: "inviteMembers" }))}
            onInfoClick={() => dispatch(onOpen({ type: "channelInfo" }))}
            onLeaveClick={() => dispatch(onOpen({ type: "leaveChannel" }))}
            onDeleteClick={() => dispatch(onOpen({ type: "deleteChannel" }))}
            isCreator={isCreator}
          />
        </div>
      </div>
    </header>
  );
}
