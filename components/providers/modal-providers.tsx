"use client";

import { useEffect, useState } from "react";
import CreateChannelModal from "../modals/create-channel-modal";
import CreateServerModal from "../modals/create-server-modal";
import EditServerModal from "../modals/edit-server-modal";
import InviteModal from "../modals/invite-modal";
import MembersModal from "../modals/members-modal";
import LeaveServer from "../modals/leave-server-modal";
import DeleteServer from "../modals/delete-server-modal";
import DeleteChannel from "../modals/delete-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal/>
      <MembersModal />
      <CreateChannelModal/>
      <LeaveServer />
      <DeleteServer/>
      <EditChannelModal/>
      <DeleteChannel/>
    </>
  );
};
