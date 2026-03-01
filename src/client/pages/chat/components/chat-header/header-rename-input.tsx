import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { Channel } from "@/src/client/lib/types";
import { useUpdateChannel } from "@/src/client/hooks/api/use-channel-queries";

interface HeaderRenameInputProps {
  currentChannel: Channel;
  onCancel: () => void;
}

export default function HeaderRenameInput({
  currentChannel,
  onCancel,
}: HeaderRenameInputProps) {
  const [editName, setEditName] = useState(currentChannel.name);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateChannel = useUpdateChannel();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleRename = async () => {
    if (!editName.trim() || editName === currentChannel.name) {
      onCancel();
      return;
    }

    setIsSaving(true);
    try {
      await updateChannel.mutateAsync({
        channelId: String(currentChannel.id),
        data: { name: editName },
      });
      onCancel();
    } catch (error) {
      console.error("Failed to rename channel:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-2 flex-1 max-w-md ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
      <input
        ref={inputRef}
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        className="flex-1 bg-gray-50 dark:bg-[#12372A]/50 border border-gray-200 dark:border-[#ADBC9F]/30 rounded px-2 py-1 text-sm font-semibold text-[#12372A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ADBC9F]/50 transition-all"
        placeholder="Channel name..."
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleRename}
        disabled={isSaving}
        className="h-8 w-8 text-[#12372A] dark:text-[#ADBC9F] hover:bg-[#ADBC9F]/20"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        className="h-8 w-8 text-gray-400 hover:text-[#12372A] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
