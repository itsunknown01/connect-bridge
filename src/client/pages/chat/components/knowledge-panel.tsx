import { ScrollArea } from "@/src/client/components/ui";
import { BookOpen, Clock, User } from "lucide-react";
import { useChannelKnowledge } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Knowledge } from "@/src/client/lib/types";

interface KnowledgePanelProps {
  channelId: string | null;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        No saved knowledge
      </h3>
      <p className="text-xs text-gray-500 dark:text-white/70 max-w-[200px]">
        Important messages you save will appear here for quick reference
      </p>
    </div>
  );
}

export default function KnowledgePanel({ channelId }: KnowledgePanelProps) {
  const queryClient = useQueryClient();
  const {
    items: knowledgeItems,
    loading,
    deleteKnowledge,
  } = useChannelKnowledge(channelId);

  if (!channelId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-white/50 px-4 text-center">
        Select a channel to view knowledge
      </div>
    );
  }

  const handleJumpToMessage = (messageId: string | number) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("highlight-message");
      setTimeout(() => {
        messageElement.classList.remove("highlight-message");
      }, 2000);
    }
  };

  const handleRemove = async (
    knowledgeId: string | number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      await deleteKnowledge(String(knowledgeId));
    } catch (error) {
      console.error("Failed to remove knowledge:", error);
    }
  };

  if (loading && knowledgeItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {knowledgeItems.length > 0 ? (
          knowledgeItems.map((item: Knowledge, index: number) => (
            <button
              key={item.id}
              onClick={() => handleJumpToMessage(item.messageId)}
              className="w-full text-left p-3 rounded-lg bg-amber-50/50 dark:bg-amber-500/10 hover:bg-amber-50 dark:hover:bg-amber-500/20 border border-amber-100 dark:border-amber-500/20 hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-150 group cursor-pointer relative animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="text-sm text-gray-700 dark:text-white/90 line-clamp-2 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {item.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/60">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">
                    {item.authorName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={(e) => handleRemove(item.id, e)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-1.5 rounded-full bg-white/80 dark:bg-[#12372A]/80 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all shadow-sm"
                aria-label="Remove from knowledge"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </button>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </ScrollArea>
  );
}
