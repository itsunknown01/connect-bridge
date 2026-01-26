import { useAppSelector } from "@/src/client/hooks";
import { useCallback, useMemo, useRef, useEffect } from "react";
import { ChannelWelcome, MessageItem } from "./";
import { Channel, Knowledge } from "@/src/client/lib/types";
import { MessageSquare } from "lucide-react";
import { useChatMessages } from "@/src/client/hooks/use-chat-messages";
import { selectCurrentUser } from "@/src/client/redux/selectors";
import { VList, VListHandle } from "virtua";
import { useChannelKnowledge } from "../../hooks";

interface MessageListProps {
  channelId: string | null;
  currentChannel: Channel | undefined;
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        No channel selected
      </h3>
      <p className="text-xs text-gray-500 max-w-[200px]">
        Select a channel from the sidebar to start chatting
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ADBC9F] border-t-transparent" />
      <span className="text-xs text-gray-400">Loading messages...</span>
    </div>
  );
}

const MessageList = ({ channelId, currentChannel }: MessageListProps) => {
  const vListRef = useRef<VListHandle>(null);
  const autoScrollEnabledRef = useRef(true);

  // Use custom hook for messages
  const { messages, loading, loadingMore, hasMore, fetchMore } =
    useChatMessages(channelId);

  // Use knowledge hook for mutations and items
  const {
    items: knowledgeItems,
    saveKnowledge,
    deleteKnowledge,
  } = useChannelKnowledge(channelId);

  const currentUser = useAppSelector(selectCurrentUser);

  // Handle auto-scroll to bottom only for NEW messages, NOT for history fetches
  useEffect(() => {
    if (messages.length > 0 && !loadingMore && autoScrollEnabledRef.current) {
      vListRef.current?.scrollToIndex(messages.length - 1, { align: "end" });
    }
  }, [messages.length, loadingMore]);

  // Detected if user is near bottom to enable/disable auto-scroll
  const handleScroll = useCallback(
    (event: any) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      autoScrollEnabledRef.current = isNearBottom;

      // Trigger fetchMore when near top
      if (
        scrollTop < 50 &&
        hasMore &&
        !loading &&
        !loadingMore &&
        messages.length > 0
      ) {
        fetchMore();
      }
    },
    [hasMore, loading, loadingMore, messages.length, fetchMore],
  );

  // Memoize knowledge map to prevent recalculation
  const knowledgeMap = useMemo(() => {
    if (!channelId) return new Set<string>();
    return new Set(
      knowledgeItems.map((item: Knowledge) => String(item.messageId)),
    );
  }, [channelId, knowledgeItems]);

  // Optimized knowledge toggle handler
  const handleToggleKnowledge = useCallback(
    async (messageId: string | number) => {
      if (!channelId) return;

      const isInKnowledge = knowledgeMap.has(String(messageId));

      try {
        if (isInKnowledge) {
          const knowledgeItem = knowledgeItems.find(
            (item: Knowledge) => String(item.messageId) === String(messageId),
          );
          if (knowledgeItem) {
            await deleteKnowledge(String(knowledgeItem.id));
          }
        } else {
          await saveKnowledge({
            messageId: String(messageId),
          });
        }
      } catch (error) {
        console.error("Failed to toggle knowledge:", error);
      }
    },
    [channelId, knowledgeMap, knowledgeItems, saveKnowledge, deleteKnowledge],
  );

  if (!channelId) {
    return <EmptyState />;
  }

  if (loading && messages.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="flex-1 min-h-0 w-full bg-white/50 backdrop-blur-sm">
      <VList
        ref={vListRef}
        onScroll={handleScroll}
        className="h-full w-full scrollbar-thin overflow-y-auto px-2 sm:px-4 py-4"
      >
        {hasMore && messages.length > 0 && (
          <div className="flex justify-center py-4">
            {loadingMore ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ADBC9F] border-t-transparent" />
            ) : (
              <span className="text-[10px] text-gray-400">
                Scroll up to load history
              </span>
            )}
          </div>
        )}
        <ChannelWelcome channelName={currentChannel?.name || "General"} />
        <div className="space-y-0.5 mt-4">
          {messages.map((message, index) => {
            const isInKnowledge = knowledgeMap.has(String(message.id));
            const isCurrentUser =
              currentUser && Number(message.authorId) === currentUser.id;

            return (
              <div
                key={message.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 30, 150)}ms` }}
              >
                <MessageItem
                  message={message}
                  isCurrentUser={Boolean(isCurrentUser)}
                  isInKnowledge={isInKnowledge}
                  onToggleKnowledge={handleToggleKnowledge}
                  channelId={channelId}
                />
              </div>
            );
          })}
        </div>
      </VList>
    </div>
  );
};

export default MessageList;
