import { ScrollArea } from "@/src/client/components/ui";
import { ClipboardList } from "lucide-react";
import { OutcomeItem } from "./outcomes/outcome-item";
import { useChannelOutcomes } from "../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Outcome } from "@/src/client/lib/types";

interface OutcomesPanelProps {
  channelId: string | null;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        No outcomes yet
      </h3>
      <p className="text-xs text-gray-500 max-w-[200px]">
        Decisions and actions you create from messages will appear here
      </p>
    </div>
  );
}

export default function OutcomesPanel({ channelId }: OutcomesPanelProps) {
  const queryClient = useQueryClient();
  const {
    items: outcomeItems,
    loading,
    deleteOutcome,
  } = useChannelOutcomes(channelId);

  if (!channelId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500 px-4 text-center">
        Select a channel to view outcomes
      </div>
    );
  }

  const handleRemove = async (outcomeId: string | number) => {
    try {
      await deleteOutcome(String(outcomeId));
      queryClient.invalidateQueries({ queryKey: ["outcomes", channelId] });
    } catch (error) {
      console.error("Failed to remove outcome:", error);
    }
  };

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

  if (loading && outcomeItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ADBC9F] border-t-transparent" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full scrollbar-thin">
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {outcomeItems.length > 0 ? (
          outcomeItems.map((item: Outcome, index: number) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <OutcomeItem
                outcome={item}
                onRemove={handleRemove}
                onJumpToMessage={handleJumpToMessage}
              />
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </ScrollArea>
  );
}
