import { useEffect, useState } from "react";
import CreateChannelModal from "../modals/create-channel-modal";
import ChannelSettingsModal from "../modals/channel-settings-modal";
import ProfileSettingsModal from "../modals/profile-settings-modal";
import CreateOutcomeModal from "../modals/create-outcome-modal";
import InviteMembersModal from "../modals/invite-members-modal";
import ChannelInfoModal from "../modals/channel-info-modal";
import LeaveChannelModal from "../modals/leave-channel-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";

export default function ModalProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <CreateChannelModal />
      <ChannelSettingsModal />
      <InviteMembersModal />
      <ProfileSettingsModal />
      <CreateOutcomeModal />
      <ChannelInfoModal />
      <LeaveChannelModal />
      <DeleteChannelModal />
    </>
  );
}
