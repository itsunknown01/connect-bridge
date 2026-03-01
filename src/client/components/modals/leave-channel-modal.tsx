import { Button } from "../ui";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { useLeaveChannel } from "@/src/client/hooks/api/use-channel-queries";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeaveChannelModal() {
  const { onClose } = useModalStore();
  const { currentChannel } = useChannelStore();
  const { isOpen, type } = useModalStore();
  const leaveChannel = useLeaveChannel();
  const navigate = useNavigate();

  const isModalOpen = isOpen && type === "leaveChannel";

  const handleClose = () => onClose();

  const handleLeave = async () => {
    if (!currentChannel) return;

    try {
      await leaveChannel.mutateAsync(String(currentChannel.id));
      handleClose();
      navigate("/chats");
    } catch {
      // Error handled by mutation
    }
  };

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Leave Channel"
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <div className="space-y-4 py-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Are you sure you want to leave?
            </p>
            <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">
              You will lose access to <strong>#{currentChannel.name}</strong>{" "}
              and its message history. You can rejoin later if you have an
              invite link.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={leaveChannel.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleLeave}
          disabled={leaveChannel.isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {leaveChannel.isPending ? "Leaving..." : "Leave Channel"}
        </Button>
      </div>
    </Modal>
  );
}
