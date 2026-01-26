import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { Channel } from "@/src/client/lib/types";
import { useAppDispatch } from "@/src/client/hooks";
import { updateChannel } from "@/src/client/redux/slices/channelSlice";

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
  const dispatch = useAppDispatch();

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
      await dispatch(
        updateChannel({
          channelId: String(currentChannel.id),
          data: { name: editName },
        }),
      ).unwrap();
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
        className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ADBC9F]/50 transition-all"
        placeholder="Channel name..."
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleRename}
        disabled={isSaving}
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
