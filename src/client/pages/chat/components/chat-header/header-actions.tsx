import { Button } from "@/src/client/components/ui";
import { BookUser, ClipboardList, Search, User2Icon } from "lucide-react";
import { useState } from "react";
import ChannelMenu from "./channel-menu";
import SearchBar from "./search-bar";
import { onOpen } from "@/src/client/redux/slices/modalSlice";
import { useAppDispatch } from "@/src/client/hooks";

interface HeaderActionsProps {
  channelId: string | null;
  onToggleKnowledgePanel?: () => void;
  onToggleMembersPanel?: () => void;
  isKnowledgePanelOpen?: boolean;
  onToggleOutcomesPanel?: () => void;
  isOutcomesPanelOpen?: boolean;
  isMembersPanelOpen?: boolean;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

function ActionButton({
  icon,
  label,
  onClick,
  isActive = false,
}: ActionButtonProps) {
  const baseClasses =
    "hover:text-[#12372A] hover:bg-[#ADBC9F]/10 transition-colors";
  const activeClasses = "text-[#12372A] bg-[#ADBC9F]/10";
  const inactiveClasses = "text-[#ADBC9F]";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
    >
      {icon}
    </Button>
  );
}

export default function HeaderActions({
  channelId,
  onToggleKnowledgePanel,
  onToggleMembersPanel,
  isKnowledgePanelOpen,
  onToggleOutcomesPanel,
  isOutcomesPanelOpen,
  isMembersPanelOpen,
}: HeaderActionsProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dispatch = useAppDispatch();

  if (isSearchActive)
    return (
      <SearchBar
        channelId={channelId || ""}
        onClose={() => setIsSearchActive(false)}
      />
    );

  return (
    <div className="flex items-center gap-2">
      <ActionButton
        icon={<Search className="h-5 w-5" />}
        label="Search Messages"
        onClick={() => setIsSearchActive(true)}
        isActive={false}
      />
      <ActionButton
        icon={<BookUser className="h-5 w-5" />}
        label="Toggle knowledge panel"
        onClick={onToggleKnowledgePanel}
        isActive={isKnowledgePanelOpen}
      />
      <ActionButton
        icon={<ClipboardList className="h-5 w-5" />}
        label="Toggle outcomes panel"
        onClick={onToggleOutcomesPanel}
        isActive={isOutcomesPanelOpen}
      />

      <ActionButton
        icon={<User2Icon className="h-5 w-5" />}
        label="Toggle members panel"
        onClick={onToggleMembersPanel}
        isActive={isMembersPanelOpen}
      />
      <ChannelMenu
        onInfoClick={() => {}}
        onInviteClick={() => {}}
        onLeaveClick={() => {}}
        onSettingsClick={() => dispatch(onOpen("channelSettings"))}
      />
    </div>
  );
}
