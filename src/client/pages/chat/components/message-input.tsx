import { Button, Input } from "@/src/client/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/client/components/ui/popover";
import { useAppDispatch } from "@/src/client/hooks";
import { sendMessage } from "@/src/client/redux/slices/messageSlice";
import { Send, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const EMOJIS = [
  "😀",
  "😂",
  "❤️",
  "👍",
  "🎉",
  "🔥",
  "✨",
  "😍",
  "🤔",
  "👏",
  "💪",
  "🙌",
];

export default function MessageInput({
  channelId,
}: {
  channelId: string | null;
}) {
  const [content, setContent] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const canSend = Boolean(channelId) && content.trim().length > 0;

  // Focus input when channel changes
  useEffect(() => {
    if (channelId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [channelId]);

  const handleSend = () => {
    if (!canSend || !channelId) return;
    dispatch(sendMessage({ channelId, content: content.trim() }));
    setContent("");
    inputRef.current?.focus();
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-[#ADBC9F]/20 dark:border-[#ADBC9F]/20 bg-white/80 dark:bg-gradient-to-r dark:from-[#12372A] dark:to-[#0d2a1f]/90 backdrop-blur-md safe-area-bottom">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Input Area */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                channelId
                  ? "Type a message..."
                  : "Select a channel to start chatting"
              }
              disabled={!channelId}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="min-h-[44px] max-h-32 py-3 bg-[#ADBC9F]/10 dark:bg-[#12372A]/50 border border-transparent dark:border-[#ADBC9F]/30 focus-visible:ring-0 focus-visible:ring-offset-0 text-[#12372A] dark:text-white placeholder:text-[#12372A]/40 dark:placeholder:text-white/40 resize-none rounded-xl focus:dark:bg-[#12372A]/70 transition-colors"
              aria-label="Message input"
            />

            {/* Emoji Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 text-[#12372A]/40 dark:text-white/40 hover:text-[#12372A] dark:hover:text-white hover:bg-[#ADBC9F]/20 dark:hover:bg-white/10"
                  aria-label="Add emoji"
                >
                  <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 sm:w-64 p-2" align="end">
                <div className="grid grid-cols-6 gap-1">
                  {EMOJIS.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-lg hover:bg-[#ADBC9F]/20 rounded-md"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Send Button */}
          <Button
            disabled={!canSend}
            onClick={handleSend}
            size="icon"
            className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 bg-[#12372A] dark:bg-[#ADBC9F] hover:bg-[#12372A]/90 dark:hover:bg-[#ADBC9F]/90 text-white dark:text-[#12372A] rounded-full shadow-md disabled:opacity-40 disabled:shadow-none transition-all"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
