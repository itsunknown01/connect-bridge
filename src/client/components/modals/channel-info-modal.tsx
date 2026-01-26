import { Button } from "../ui";
import { Modal } from "../ui/modal";
import { DialogFooter } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { RootState } from "../../redux/store";
import { Hash, Users, Calendar } from "lucide-react";

export default function ChannelInfoModal() {
  const dispatch = useAppDispatch();
  const { currentChannel } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );
  const { isOpen, type } = useAppSelector(
    (state: RootState) => state.modalReducer,
  );

  const isModalOpen = isOpen && type === "channelInfo";

  const handleClose = () => dispatch(onClose());

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Channel Info"
      description="Details about this channel"
      onClose={handleClose}
    >
      <div className="space-y-4 py-4">
        {/* Channel Name */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Hash className="h-5 w-5 text-[#12372A]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Channel Name
            </p>
            <p className="text-sm font-medium text-gray-900">
              {currentChannel.name}
            </p>
          </div>
        </div>

        {/* Member Count */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Users className="h-5 w-5 text-[#12372A]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Members
            </p>
            <p className="text-sm font-medium text-gray-900">
              {currentChannel.memberCount}{" "}
              {currentChannel.memberCount === 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        {/* Created Info (placeholder) */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="p-2 bg-[#ADBC9F]/20 rounded-lg">
            <Calendar className="h-5 w-5 text-[#12372A]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Channel ID
            </p>
            <p className="text-sm font-medium text-gray-900">
              #{currentChannel.id}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Close
        </Button>
      </DialogFooter>
    </Modal>
  );
}
