import { Button, Input, Label } from "../ui";
import { Modal } from "../ui/modal";
import { DialogFooter } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { RootState } from "../../redux/store";
import { useState } from "react";
import { Copy, Check, UserPlus, Mail } from "lucide-react";
import { toast } from "sonner";
import { inviteMemberAsync } from "../../redux/slices/channelSlice";

export default function InviteMembersModal() {
  const dispatch = useAppDispatch();
  const { currentChannel, loading } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );
  const { isOpen, type } = useAppSelector(
    (state: RootState) => state.modalReducer,
  );
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const isModalOpen = isOpen && type === "inviteMembers";

  // Generate invite link
  const inviteLink = currentChannel
    ? `${window.location.origin}/invite/${currentChannel.id}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleInvite = async () => {
    if (!email) {
      return toast.error("Email is required");
    }
    if (!currentChannel) return;

    const result = await dispatch(
      inviteMemberAsync({
        channelId: String(currentChannel.id),
        email,
      }),
    );

    if (inviteMemberAsync.fulfilled.match(result)) {
      setEmail("");
    }
  };

  const handleClose = () => {
    setCopied(false);
    setEmail("");
    dispatch(onClose());
  };

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Invite Members"
      description={`Invite people to join #${currentChannel.name}`}
      onClose={handleClose}
    >
      <div className="space-y-6 py-4">
        {/* Email Invite Section */}
        <div className="space-y-2">
          <Label htmlFor="email">Invite by Email</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>
            <Button onClick={handleInvite} disabled={loading || !email}>
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or share link
            </span>
          </div>
        </div>

        {/* Link Share Section */}
        <div className="space-y-2">
          <Label htmlFor="invite-link">Invite Link</Label>
          <div className="flex gap-2">
            <Input
              id="invite-link"
              value={inviteLink}
              readOnly
              className="flex-1 bg-gray-50 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className={copied ? "text-green-600 border-green-600" : ""}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
          <UserPlus className="h-4 w-4" />
          <p>Anyone with the link can join this channel</p>
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
