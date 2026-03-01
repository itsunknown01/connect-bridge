import { create } from "zustand";
import { Channel, Message } from "../lib/types";

export type ModalType =
  | "createChannel"
  | "channelSettings"
  | "profileSettings"
  | "createOutcome"
  | "inviteMembers"
  | "channelInfo"
  | "leaveChannel"
  | "deleteChannel";

export interface ModalData {
  channel?: Channel;
  message?: Message;
  apiUrl?: string;
  query?: any;
}

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  data: ModalData;
}

interface ModalActions {
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  isOpen: false,
  type: null,
  data: {},

  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
