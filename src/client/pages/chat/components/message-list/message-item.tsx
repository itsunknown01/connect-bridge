import { Button } from "@/src/client/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/client/components/ui/dropdown-menu";
import { Message } from "@/src/client/lib/types";
import { getInitials } from "@/src/client/lib/utils";
import {
  ClipboardList,
  MoreHorizontal,
  Star,
  StarOff,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useAppDispatch } from "@/src/client/hooks";
import { onOpen } from "@/src/client/redux/slices/modalSlice";
import { useState, useRef, useEffect } from "react";
import {
  updateMessageAsync,
  deleteMessageAsync,
} from "@/src/client/redux/slices/messageSlice";
import DOMPurify from "dompurify";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean | null;
  isInKnowledge?: boolean;
  onToggleKnowledge?: (messageId: string | number) => void;
  channelId: string | null;
}

function MessageAvatar({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0">
      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-full flex items-center justify-center shadow-sm">
        <span className="text-white text-xs sm:text-sm font-semibold">
          {getInitials(name)}
        </span>
      </div>
    </div>
  );
}

function MessageHeader({
  authorName,
  isCurrentUser,
  timestamp,
}: {
  authorName: string;
  isCurrentUser: boolean | null;
  timestamp: string | Date;
}) {
  return (
    <div className="flex items-center gap-2 mb-1 flex-wrap">
      <span className="font-semibold text-[#12372A] text-sm">{authorName}</span>
      {isCurrentUser && (
        <span className="text-[10px] sm:text-xs bg-[#ADBC9F]/20 text-[#12372A] px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
          You
        </span>
      )}
      <span className="text-[10px] sm:text-xs text-gray-400">
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}

export default function MessageItem({
  message,
  isCurrentUser,
  isInKnowledge,
  onToggleKnowledge,
  channelId,
}: MessageItemProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleToggleKnowledge = () => {
    onToggleKnowledge?.(message.id);
  };

  const handleCreateOutcome = () => {
    dispatch(onOpen({ type: "createOutcome", data: { message } }));
  };

  const handleUpdate = async () => {
    if (!channelId || !editContent.trim()) return;
    if (editContent === message.content) {
      setIsEditing(false);
      return;
    }

    await dispatch(
      updateMessageAsync({
        channelId,
        messageId: message.id,
        content: editContent,
      }),
    );
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!channelId) return;
    setIsDeleting(true);
    await dispatch(
      deleteMessageAsync({
        channelId,
        messageId: message.id,
      }),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdate();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const sanitizedContent = DOMPurify.sanitize(message.content);

  return (
    <div
      id={`message-${message.id}`}
      className={`group relative px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-[#ADBC9F]/5 transition-colors duration-150 rounded-lg ${isDeleting ? "opacity-50 grayscale pointer-events-none" : ""}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <MessageAvatar name={message.authorName} />

        <div className="flex-1 min-w-0">
          <MessageHeader
            authorName={message.authorName}
            isCurrentUser={isCurrentUser}
            timestamp={message.createdAt}
          />

          {isEditing ? (
            <div className="mt-1 space-y-2">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white border border-[#ADBC9F]/30 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ADBC9F]/50 resize-none min-h-[60px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="h-7 text-xs px-2 hover:bg-gray-100"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  className="h-7 text-xs px-2 bg-[#12372A] hover:bg-[#12372A]/90 text-white"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <p
              className="text-sm text-gray-700 leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}
        </div>

        {!isEditing && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-[#12372A] hover:bg-[#ADBC9F]/10 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#ADBC9F]"
                  aria-label="Message actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isCurrentUser && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Edit Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Delete Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleToggleKnowledge}
                  className="cursor-pointer"
                >
                  {isInKnowledge ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Remove from Knowledge</span>
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Save to Knowledge</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleCreateOutcome}
                  className="cursor-pointer"
                >
                  <ClipboardList className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Mark as Outcome</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isInKnowledge && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-lg" />
      )}
    </div>
  );
}
