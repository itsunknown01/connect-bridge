import { LucideIcon } from "lucide-react";

/**
 * Shared utility to scroll to and briefly highlight a message in the chat.
 * Used by KnowledgePanel and OutcomesPanel.
 */
export function jumpToMessage(messageId: string | number) {
  const el = document.getElementById(`message-${messageId}`);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("highlight-message");
  setTimeout(() => el.classList.remove("highlight-message"), 2000);
}

/**
 * Generic empty state for panels (Knowledge, Outcomes, Members, Messages).
 */
interface PanelEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName?: string;
  iconBgClassName?: string;
}

export function PanelEmptyState({
  icon: Icon,
  title,
  description,
  iconClassName = "text-gray-400 dark:text-white/60",
  iconBgClassName = "bg-gray-100 dark:bg-white/10",
}: PanelEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div
        className={`w-16 h-16 ${iconBgClassName} rounded-full flex items-center justify-center mb-4`}
      >
        <Icon className={`w-8 h-8 ${iconClassName}`} />
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-white/70 max-w-[200px]">
        {description}
      </p>
    </div>
  );
}

/**
 * Generic loading spinner for panels.
 */
interface PanelSpinnerProps {
  label?: string;
  borderColor?: string;
}

export function PanelSpinner({
  label,
  borderColor = "border-[#ADBC9F] dark:border-white",
}: PanelSpinnerProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <div
        className={`h-8 w-8 animate-spin rounded-full border-2 ${borderColor} border-t-transparent dark:border-t-transparent`}
      />
      {label && (
        <span className="text-xs text-gray-400 dark:text-white/50">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Placeholder for "no channel selected" state.
 */
export function NoChannelSelected({
  text = "Select a channel",
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-white/50 px-4 text-center">
      {text}
    </div>
  );
}
