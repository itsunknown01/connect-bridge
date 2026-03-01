import { Button, Separator } from "@/src/client/components/ui";
import { SidebarTrigger } from "@/src/client/components/ui/sidebar";
import { Channel } from "@/src/client/lib/types";
import { useAuthStore } from "@/src/client/stores/auth-store";
import { useModalStore } from "@/src/client/stores/modal-store";
import {
  LayoutPanelLeft,
  PanelRightClose,
  PanelRightOpen,
  Search,
} from "lucide-react";
import { useState } from "react";
import { ChannelInfo, ChannelMenu, HeaderRenameInput, SearchBar } from "./";

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

  const { onOpen } = useModalStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isCreator = currentUser?.id === currentChannel?.userId;

  return (
    <header className="border-b border-[#ADBC9F]/20 dark:border-[#ADBC9F]/20 bg-white/80 dark:bg-gradient-to-r dark:from-[#12372A] dark:to-[#0d2a1f]/90 backdrop-blur-md sticky top-0 z-10 transition-colors">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
        {/* Left Section - Identity & Settings */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 flex-shrink-0" />
          <Separator
            orientation="vertical"
            className="h-5 sm:h-6 bg-[#ADBC9F]/30 dark:bg-white/20 hidden sm:block"
          />

          {currentChannel ? (
            isEditing ? (
              <HeaderRenameInput
                currentChannel={currentChannel}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ChannelInfo
                channelName={currentChannel.name}
                memberCount={currentChannel.memberCount}
              />
            )
          ) : (
            <span className="text-sm text-gray-400 dark:text-white/40 ml-2">
              No channel selected
            </span>
          )}
        </div>

        {/* Right Section - Utilities & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Search Toggle */}
          {isSearchActive ? (
            <div className="px-4 sm:px-6">
              <SearchBar
                channelId={String(currentChannel?.id)}
                onClose={() => setIsSearchActive(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-[#12372A]/60 dark:text-white/60 hover:text-[#12372A] dark:hover:text-white hover:bg-[#ADBC9F]/10 dark:hover:bg-white/10"
              onClick={() => setIsSearchActive(true)}
              aria-label="Search messages"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          {/* Panel Controls (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 text-[#12372A]/60 dark:text-white/60 hover:text-[#12372A] dark:hover:text-white hover:bg-[#ADBC9F]/10 dark:hover:bg-white/10 md:hidden"
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
                ? "text-[#12372A] dark:text-white bg-[#ADBC9F]/10 dark:bg-white/10"
                : "text-[#12372A]/60 dark:text-white/60 hover:text-[#12372A] dark:hover:text-white hover:bg-[#ADBC9F]/10 dark:hover:bg-white/10"
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
            onInviteClick={() => onOpen("inviteMembers")}
            onInfoClick={() => onOpen("channelInfo")}
            onLeaveClick={() => onOpen("leaveChannel")}
            onDeleteClick={() => onOpen("deleteChannel")}
            isCreator={isCreator}
          />
        </div>
      </div>
    </header>
  );
}
