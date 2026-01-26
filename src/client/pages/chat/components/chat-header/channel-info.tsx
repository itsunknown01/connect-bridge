import { Separator } from "@/src/client/components/ui";
import { Hash, Users } from "lucide-react";

interface ChannelInfoProps {
  channelName: string;
  memberCount: number;
}

export default function ChannelInfo({
  channelName,
  memberCount,
}: ChannelInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <Hash className="h-5 w-5 text-[#ADBC9F]" aria-hidden="true" />
      <h2 className="text-xl font-bold text-[#12372A]">{channelName}</h2>
      <Separator orientation="vertical" className="h-6 bg-[#ADBC9F]/30" />
      <div className="flex items-center gap-2 text-sm text-gray-600 pt-1">
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>{memberCount} members</span>
      </div>
    </div>
  );
}
