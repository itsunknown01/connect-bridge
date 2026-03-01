import { Button } from "../ui";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { Hash, Users, Calendar } from "lucide-react";

export default function ChannelInfoModal() {
  const { onClose } = useModalStore();
  const { currentChannel } = useChannelStore();
  const { isOpen, type } = useModalStore();

  const isModalOpen = isOpen && type === "channelInfo";

  const handleClose = () => onClose();

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Channel Info"
      description="Details about this channel"
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <div className="space-y-4 py-4">
        {/* Channel Name */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Hash className="h-5 w-5 text-[#12372A] dark:text-[#ADBC9F]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Channel Name
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentChannel.name}
            </p>
          </div>
        </div>

        {/* Member Count */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Users className="h-5 w-5 text-[#12372A] dark:text-[#ADBC9F]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Members
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {currentChannel.memberCount}{" "}
              {currentChannel.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        {/* Created Info (placeholder) */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Calendar className="h-5 w-5 text-[#12372A] dark:text-[#ADBC9F]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Channel ID
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
              #{currentChannel.id}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
