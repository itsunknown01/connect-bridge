import { Button } from "@/src/client/components/ui";
import { Outcome } from "@/src/client/lib/types";
import { CheckCircle2, Gavel, Trash2, User } from "lucide-react";

interface OutcomeItemProps {
  outcome: Outcome;
  onRemove: (outcomeId: string | number) => void;
  onJumpToMessage: (messageId: string | number) => void;
}

export function OutcomeItem({
  outcome,
  onRemove,
  onJumpToMessage,
}: OutcomeItemProps) {
  const isDecision = outcome.type === "DECISION";

  return (
    <button
      className={`relative group w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
        isDecision
          ? "bg-amber-50/50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/20 hover:border-amber-200 dark:hover:border-amber-500/30 focus-visible:ring-amber-400"
          : "bg-blue-50/50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/30 focus-visible:ring-blue-400"
      }`}
      onClick={() => onJumpToMessage(outcome.messageId)}
    >
      <div className="flex items-start gap-2.5">
        {/* Icon */}
        <div
          className={`flex-shrink-0 mt-0.5 p-1.5 rounded-lg ${
            isDecision
              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          {isDecision ? (
            <Gavel className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDecision
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {outcome.type}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-400">
              {new Date(outcome.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-[13px] text-gray-700 dark:text-white/90 font-medium line-clamp-3 mb-2.5 leading-relaxed">
            {outcome.content}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
            <div className="flex items-center gap-1 bg-gray-100/80 px-1.5 py-0.5 rounded">
              <User className="w-2.5 h-2.5" />
              <span className="truncate max-w-[80px]">
                {outcome.authorName}
              </span>
            </div>
            {outcome.assigneeName && (
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold border ${
                  isDecision
                    ? "text-amber-700 bg-amber-100/50 border-amber-200/50"
                    : "text-blue-700 bg-blue-100/50 border-blue-200/50"
                }`}
              >
                <span className="text-[9px] opacity-70 italic">
                  Assigned to:
                </span>
                <span className="truncate max-w-[100px]">
                  {outcome.assigneeName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(outcome.id);
          }}
          aria-label="Remove outcome"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </button>
  );
}
