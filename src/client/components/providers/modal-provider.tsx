import { useModalStore } from "../../stores/modal-store";
import ChannelSettingsModal from "../modals/channel-settings-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";
import InviteMembersModal from "../modals/invite-members-modal";
import LeaveChannelModal from "../modals/leave-channel-modal";
import ProfileSettingsModal from "../modals/profile-settings-modal";
import CreateOutcomeModal from "../modals/create-outcome-modal";
import ChannelInfoModal from "../modals/channel-info-modal";

export default function ModalProvider() {
  const { isOpen } = useModalStore();

  if (!isOpen) return null;

  return (
    <>
      <CreateChannelModal />
      <ChannelSettingsModal />
      <DeleteChannelModal />
      <InviteMembersModal />
      <LeaveChannelModal />
      <ProfileSettingsModal />
      <CreateOutcomeModal />
      <ChannelInfoModal />
    </>
  );
}
