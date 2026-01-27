import { getInitials } from "@/src/client/lib/utils";
import { OnlineStatusIndicator } from "../chat-sidebar/chat-user";
import { Button } from "@/src/client/components/ui";
import { UserMinus } from "lucide-react";
import { useState } from "react";

interface Member {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

interface MemberItemProps {
  member: Member;
  isOnline: boolean;
  isChannelOnline: boolean;
  isCurrentUser: boolean;
  canKick: boolean;
  onKick?: (userId: string | number) => void;
}

function MemberAvatar({
  member,
  isOnline,
  isChannelOnline,
}: {
  member: Member;
  isOnline: boolean;
  isChannelOnline: boolean;
}) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`w-9 h-9 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-lg flex items-center justify-center ${
          isChannelOnline ? "ring-2 ring-[#ADBC9F] ring-offset-1" : ""
        }`}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full rounded-lg object-cover"
          />
        ) : (
          <span className="text-white text-xs font-semibold">
            {getInitials(member.name)}
          </span>
        )}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5">
        <OnlineStatusIndicator isOnline={isOnline} />
      </div>
    </div>
  );
}

function MemberInfo({
  member,
  isCurrentUser,
  isChannelOnline,
}: {
  member: Member;
  isCurrentUser: boolean;
  isChannelOnline: boolean;
}) {
  return (
    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {member.name}
        </span>
        {isCurrentUser && (
          <span className="text-[10px] bg-[#ADBC9F]/20 text-[#12372A] dark:text-white px-1.5 py-0.5 rounded font-medium">
            You
          </span>
        )}
        {isChannelOnline && !isCurrentUser && (
          <span className="text-[10px] bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full border border-green-100 dark:border-green-500/20 font-medium">
            Active Here
          </span>
        )}
      </div>
      {member.role && (
        <span className="text-xs text-gray-500 dark:text-white/60 truncate block">
          {member.role}
        </span>
      )}
    </div>
  );
}

export default function MemberItem({
  member,
  isOnline,
  isChannelOnline,
  isCurrentUser,
  canKick,
  onKick,
}: MemberItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleKick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove ${member.name}?`)) {
      setIsRemoving(true);
      onKick?.(member.id);
    }
  };

  return (
    <div
      className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#ADBC9F]/10 dark:hover:bg-white/5 transition-colors group cursor-default ${isRemoving ? "opacity-50 pointer-events-none" : ""}`}
      aria-label={`Member ${member.name}`}
    >
      <MemberAvatar
        member={member}
        isOnline={isOnline}
        isChannelOnline={isChannelOnline}
      />
      <MemberInfo
        member={member}
        isCurrentUser={isCurrentUser}
        isChannelOnline={isChannelOnline}
      />

      {canKick && !isCurrentUser && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleKick}
          className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Remove ${member.name}`}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
