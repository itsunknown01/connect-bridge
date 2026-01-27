import { Button } from "../ui";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { RootState } from "../../redux/store";
import { AlertTriangle } from "lucide-react";
import { deleteChannelAsync } from "../../redux/slices/channelSlice";
import { useNavigate } from "react-router-dom";

export default function DeleteChannelModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentChannel, loading, channels } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );
  const { isOpen, type } = useAppSelector(
    (state: RootState) => state.modalReducer,
  );

  const isModalOpen = isOpen && type === "deleteChannel";

  const handleClose = () => dispatch(onClose());

  const handleDelete = async () => {
    if (!currentChannel) return;

    const result = await dispatch(
      deleteChannelAsync(String(currentChannel.id)),
    );

    if (deleteChannelAsync.fulfilled.match(result)) {
      handleClose();
      navigate("/chats");
    }
  };

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Delete Channel"
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
              Are you sure you want to delete this channel?
            </p>
            <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">
              This action is permanent. All messages and data in{" "}
              <strong>#{currentChannel.name}</strong> will be permanently
              deleted and cannot be recovered.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? "Deleting..." : "Delete Channel"}
        </Button>
      </div>
    </Modal>
  );
}
