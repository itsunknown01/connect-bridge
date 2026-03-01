import { useSocketStore } from "@/src/client/stores/socket-store";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../../helpers/api";
import { Member } from "../../../lib/types";

export default function useChannelMembers(channelId: string | null) {
  const { onlineUsers, channelOnlineUsers } = useSocketStore();

  // Use TanStack Query for member list management
  const {
    data: members = [],
    isLoading,
    error,
  } = useQuery<Member[]>({
    queryKey: ["members", channelId],
    queryFn: async () => {
      const res = await axiosPrivate.get(`/channels/${channelId}/members`);
      return res.data.members;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const channelOnlineList = useMemo(
    () => (channelId ? channelOnlineUsers[channelId] || [] : []),
    [channelId, channelOnlineUsers],
  );

  const onlineMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          channelOnlineList.includes(String(member.id)) ||
          onlineUsers.includes(String(member.id)),
      ),
    [members, channelOnlineList, onlineUsers],
  );
  const offlineMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          !channelOnlineList.includes(String(member.id)) &&
          !onlineUsers.includes(String(member.id)),
      ),
    [members, channelOnlineList, onlineUsers],
  );

  return {
    members,
    onlineMembers,
    offlineMembers,
    channelOnlineList,
    loading: isLoading,
    error: error ? (error as any).message : null,
  };
}
