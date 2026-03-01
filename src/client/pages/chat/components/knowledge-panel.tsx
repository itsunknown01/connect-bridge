import { ScrollArea } from "@/src/client/components/ui";
import { Knowledge } from "@/src/client/lib/types";
import { BookOpen, Clock, User, X } from "lucide-react";
import { useChannelKnowledge } from "../hooks";
import {
  jumpToMessage,
  PanelEmptyState,
  PanelSpinner,
  NoChannelSelected,
} from "./panel-utils";

interface KnowledgePanelProps {
  channelId: string | null;
}

export default function KnowledgePanel({ channelId }: KnowledgePanelProps) {
  const {
    items: knowledgeItems,
    loading,
    deleteKnowledge,
  } = useChannelKnowledge(channelId);

  if (!channelId) {
    return <NoChannelSelected text="Select a channel to view knowledge" />;
  }

  if (loading && knowledgeItems.length === 0) {
    return <PanelSpinner borderColor="border-amber-400" />;
  }

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

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {knowledgeItems.length > 0 ? (
          knowledgeItems.map((item: Knowledge, index: number) => (
            <button
              key={item.id}
              onClick={() => jumpToMessage(item.messageId)}
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
                <X className="w-3 h-3" />
              </button>
            </button>
          ))
        ) : (
          <PanelEmptyState
            icon={BookOpen}
            title="No saved knowledge"
            description="Important messages you save will appear here for quick reference"
            iconClassName="text-amber-400"
            iconBgClassName="bg-amber-50 dark:bg-amber-500/10"
          />
        )}
      </div>
    </ScrollArea>
  );
}
