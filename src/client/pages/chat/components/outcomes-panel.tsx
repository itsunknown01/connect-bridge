import { ScrollArea } from "@/src/client/components/ui";
import { ClipboardList } from "lucide-react";
import { OutcomeItem } from "./outcomes/outcome-item";
import { useChannelOutcomes } from "../hooks";
import { Outcome } from "@/src/client/lib/types";
import {
  jumpToMessage,
  PanelEmptyState,
  PanelSpinner,
  NoChannelSelected,
} from "./panel-utils";

interface OutcomesPanelProps {
  channelId: string | null;
}

export default function OutcomesPanel({ channelId }: OutcomesPanelProps) {
  const {
    items: outcomeItems,
    loading,
    deleteOutcome,
  } = useChannelOutcomes(channelId);

  if (!channelId) {
    return <NoChannelSelected text="Select a channel to view outcomes" />;
  }

  if (loading && outcomeItems.length === 0) {
    return <PanelSpinner />;
  }

  const handleRemove = async (outcomeId: string | number) => {
    try {
      await deleteOutcome(String(outcomeId));
    } catch (error) {
      console.error("Failed to remove outcome:", error);
    }
  };

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
                onJumpToMessage={jumpToMessage}
              />
            </div>
          ))
        ) : (
          <PanelEmptyState
            icon={ClipboardList}
            title="No outcomes yet"
            description="Decisions and actions you create from messages will appear here"
          />
        )}
      </div>
    </ScrollArea>
  );
}
