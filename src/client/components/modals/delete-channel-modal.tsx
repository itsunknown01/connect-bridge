import { Button } from "../ui";
import { Modal } from "../ui/modal";
import { DialogFooter } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { RootState } from "../../redux/store";
import { AlertTriangle } from "lucide-react";
import { deleteChannelAsync } from "../../redux/slices/channelSlice";
import { useNavigate } from "react-router-dom";

export default function DeleteChannelModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentChannel, loading } = useAppSelector(
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
      description=""
      onClose={handleClose}
    >
      <div className="space-y-4 py-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-900">
              Are you sure you want to delete this channel?
            </p>
            <p className="text-xs text-red-700 mt-1">
              This action is permanent. All messages and data in{" "}
              <strong>#{currentChannel.name}</strong> will be permanently
              deleted and cannot be recovered.
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="flex gap-2">
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
      </DialogFooter>
    </Modal>
  );
}
