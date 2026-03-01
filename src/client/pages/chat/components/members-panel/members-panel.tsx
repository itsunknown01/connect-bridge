import { useAuthStore } from "@/src/client/stores/auth-store";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { useRemoveMember } from "@/src/client/hooks/api/use-channel-queries";
import { useChannelMembers } from "../../hooks";
import MemberItem from "./member-item";
import { memo, useMemo, useCallback } from "react";
import { VList } from "virtua";
import { Member } from "@/src/client/lib/types";
import { PanelSpinner, NoChannelSelected } from "../panel-utils";

interface MembersPanelProps {
  channelId: string | null;
}

type MemberListItem =
  | { type: "header"; label: string }
  | { type: "member"; data: Member; isOnline: boolean };

function PanelHeader() {
  return (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-[#ADBC9F]/20 bg-white dark:bg-transparent">
      <h2 className="text-lg font-semibold text-[#12372A] dark:text-white pb-1">
        Members
      </h2>
      <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">
        Channel participants and their status
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
      <p className="text-sm">No members found</p>
    </div>
  );
}

const MembersPanel = memo(function MembersPanel({
  channelId,
}: MembersPanelProps) {
  const removeMember = useRemoveMember();
  const currentUser = useAuthStore((s) => s.currentUser);
  const currentChannel = useChannelStore((s) => s.currentChannel);

  const {
    members,
    onlineMembers,
    offlineMembers,
    channelOnlineList,
    loading,
    error,
  } = useChannelMembers(channelId);

  const isCreator = currentChannel?.userId === currentUser?.id;
  const ownerId = currentChannel?.userId ?? null;

  const handleKick = useCallback(
    async (userId: string | number) => {
      if (!channelId) return;
      await removeMember.mutateAsync({ channelId, userId });
    },
    [channelId, removeMember],
  );

  // Flatten the list into items for VList
  const flattenedItems = useMemo<MemberListItem[]>(() => {
    const items: MemberListItem[] = [];

    if (onlineMembers.length > 0) {
      items.push({ type: "header", label: `Online — ${onlineMembers.length}` });
      onlineMembers.forEach((m) =>
        items.push({ type: "member", data: m, isOnline: true }),
      );
    }

    if (offlineMembers.length > 0) {
      items.push({
        type: "header",
        label: `Offline — ${offlineMembers.length}`,
      });
      offlineMembers.forEach((m) =>
        items.push({ type: "member", data: m, isOnline: false }),
      );
    }

    return items;
  }, [onlineMembers, offlineMembers]);

  if (!channelId)
    return <NoChannelSelected text="Select a channel to view members" />;

  if (loading && members.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <PanelHeader />
        <PanelSpinner label="Loading members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col text-red-500 items-center justify-center p-4 text-center">
        <p className="text-sm">Failed to load members</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PanelHeader />
      <div className="flex-1 min-h-0 bg-white/50 dark:bg-transparent">
        {flattenedItems.length > 0 ? (
          <VList className="h-full w-full scrollbar-thin overflow-y-auto px-4 mt-2">
            {flattenedItems.map((item, index) => {
              if (item.type === "header") {
                return (
                  <h3
                    key={`header-${index}`}
                    className="text-xs font-semibold text-gray-500 dark:text-white/60 uppercase tracking-wider mb-2 mt-4 px-2"
                  >
                    {item.label}
                  </h3>
                );
              }
              const member = item.data;
              const isMemberActiveHere = channelId
                ? channelOnlineList.includes(String(member.id))
                : false;

              return (
                <div key={member.id} className="mb-1">
                  <MemberItem
                    member={member}
                    isOnline={item.isOnline}
                    isChannelOnline={isMemberActiveHere}
                    isCurrentUser={member.id === currentUser?.id}
                    canKick={isCreator}
                    onKick={handleKick}
                    isOwner={member.id === ownerId}
                  />
                </div>
              );
            })}
          </VList>
        ) : members.length === 0 && !loading ? (
          <EmptyState />
        ) : null}
      </div>
    </div>
  );
});

export default MembersPanel;
