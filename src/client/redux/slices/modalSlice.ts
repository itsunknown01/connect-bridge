import { createSlice } from "@reduxjs/toolkit";

import { Channel, Message } from "../../lib/types";

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

const initialState: ModalState = {
  isOpen: false,
  type: null,
  data: {},
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    onOpen: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type || action.payload; // Handle both string and object
      state.data = action.payload.data || {};
    },
    onClose: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { onOpen, onClose } = modalSlice.actions;
export default modalSlice.reducer;
