import { Avatar, AvatarFallback } from "@/src/client/components/ui/avatar";
import { IUser } from "@/src/client/lib/types";
import { getInitials } from "@/src/client/lib/utils";
import { OnlineStatusIndicator } from "./";

interface UserAvatarProps {
  user: IUser;
  isOnline?: boolean;
  showStatus?: boolean;
}

export default function UserAvatar({
  user,
  isOnline = false,
  showStatus = false,
}: UserAvatarProps) {
  return (
    <div className="relative">
      <Avatar className="h-8 w-8 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-lg flex items-center justify-center">
        {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
        <AvatarFallback className="bg-inherit text-white text-sm font-semibold">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {showStatus && <OnlineStatusIndicator isOnline={isOnline} />}
    </div>
  );
}
