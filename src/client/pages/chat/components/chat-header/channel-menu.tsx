import { Button, Separator } from "@/src/client/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/client/components/ui/dropdown-menu";
import {
  MoreVertical,
  Settings,
  UserPlus,
  Info,
  LogOut,
  Trash2,
} from "lucide-react";

interface ChannelMenuProps {
  onSettingsClick: () => void;
  onInviteClick: () => void;
  onInfoClick: () => void;
  onLeaveClick: () => void;
  onDeleteClick?: () => void;
  isCreator?: boolean;
}

export default function ChannelMenu({
  onSettingsClick,
  onInviteClick,
  onInfoClick,
  onLeaveClick,
  onDeleteClick,
  isCreator = false,
}: ChannelMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[#ADBC9F] hover:text-[#12372A] hover:bg-[#ADBC9F]/10 transition-colors"
          aria-label="Channel options"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuItem onClick={onSettingsClick} className="gap-2">
          <Settings className="h-4 w-4" />
          Channel Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onInviteClick} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onInfoClick} className="gap-2">
          <Info className="h-4 w-4" />
          View Channel Info
        </DropdownMenuItem>

        <Separator className="my-1" />

        {isCreator ? (
          <DropdownMenuItem
            className="text-red-600 gap-2 focus:text-red-600 focus:bg-red-50"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
            Delete Channel
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-red-600 gap-2 focus:text-red-600 focus:bg-red-50"
            onClick={onLeaveClick}
          >
            <LogOut className="h-4 w-4" />
            Leave Channel
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
