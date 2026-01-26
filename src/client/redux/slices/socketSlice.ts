import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  connected: boolean;
  onlineUsers: string[];
  onlineCount: number;
  channelOnlineUsers: Record<string, string[]>;
}

const initialState: SocketState = {
  connected: false,
  onlineUsers: [],
  onlineCount: 0,
  channelOnlineUsers: {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connectRequested(state) {},
    disconnectRequested(state) {},
    socketConnected(state) {
      state.connected = true;
    },
    socketDisconnected(state) {
      state.connected = false;
      state.onlineUsers = [];
      state.onlineCount = 0;
      state.channelOnlineUsers = {};
    },

    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    setOnlineCount(state, action: PayloadAction<number>) {
      state.onlineCount = action.payload;
    },
    setChannelOnlineUsers(
      state,
      action: PayloadAction<{ channelId: string; users: string[] }>,
    ) {
      state.channelOnlineUsers[action.payload.channelId] = action.payload.users;
    },
    userOnline(state, action: PayloadAction<string>) {
      // Add to global list (capped at 50 anyway)
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userOffline(state, action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload,
      );
      // Remove from all channel lists
      Object.keys(state.channelOnlineUsers).forEach((channelId) => {
        state.channelOnlineUsers[channelId] = state.channelOnlineUsers[
          channelId
        ].filter((id) => id !== action.payload);
      });
    },
  },
});

export const {
  connectRequested,
  disconnectRequested,
  socketConnected,
  socketDisconnected,
  setOnlineUsers,
  setOnlineCount,
  setChannelOnlineUsers,
  userOnline,
  userOffline,
} = socketSlice.actions;

export default socketSlice.reducer;
