import { create } from "zustand";

interface SocketState {
  connected: boolean;
  onlineUsers: string[];
  onlineCount: number;
  channelOnlineUsers: Record<string, string[]>;
}

interface SocketActions {
  setConnected: () => void;
  setDisconnected: () => void;
  setOnlineUsers: (users: string[]) => void;
  setOnlineCount: (count: number) => void;
  setChannelOnlineUsers: (channelId: string, users: string[]) => void;
  addUserOnline: (userId: string) => void;
  addUserToChannel: (channelId: string, userId: string) => void;
  removeUserOffline: (userId: string) => void;
}

export const useSocketStore = create<SocketState & SocketActions>(
  (set, get) => ({
    connected: false,
    onlineUsers: [],
    onlineCount: 0,
    channelOnlineUsers: {},

    setConnected: () => set({ connected: true }),

    setDisconnected: () =>
      set({
        connected: false,
        onlineUsers: [],
        onlineCount: 0,
        channelOnlineUsers: {},
      }),

    setOnlineUsers: (users) => set({ onlineUsers: users }),

    setOnlineCount: (count) => set({ onlineCount: count }),

    setChannelOnlineUsers: (channelId, users) => {
      const { channelOnlineUsers } = get();
      set({
        channelOnlineUsers: { ...channelOnlineUsers, [channelId]: users },
      });
    },

    addUserOnline: (userId) => {
      const { onlineUsers, onlineCount } = get();
      if (!onlineUsers.includes(userId)) {
        set({
          onlineUsers: [...onlineUsers, userId],
          onlineCount: onlineCount + 1,
        });
      }
    },

    addUserToChannel: (channelId, userId) => {
      const { channelOnlineUsers } = get();
      const current = channelOnlineUsers[channelId] || [];
      if (!current.includes(userId)) {
        set({
          channelOnlineUsers: {
            ...channelOnlineUsers,
            [channelId]: [...current, userId],
          },
        });
      }
    },

    removeUserOffline: (userId) => {
      const { onlineUsers, channelOnlineUsers } = get();
      const updatedChannels: Record<string, string[]> = {};
      Object.keys(channelOnlineUsers).forEach((channelId) => {
        updatedChannels[channelId] = channelOnlineUsers[channelId].filter(
          (id) => id !== userId,
        );
      });
      set({
        onlineUsers: onlineUsers.filter((id) => id !== userId),
        channelOnlineUsers: updatedChannels,
      });
    },
  }),
);
