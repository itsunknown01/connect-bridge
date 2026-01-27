import { createListenerMiddleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import {
  connectRequested,
  disconnectRequested,
  setChannelOnlineUsers,
  setOnlineCount,
  setOnlineUsers,
  socketConnected,
  socketDisconnected,
  userOffline,
  userOnline,
} from "../slices/socketSlice";
import {
  addChannel,
  addMember,
  getChannelsAsync,
  createChannelAsync,
  joinChannelAsync,
  removeChannel,
} from "../slices/channelSlice";
import {
  appendMessage,
  sendMessage,
  updateLocalMessage,
  removeLocalMessage,
} from "../slices/messageSlice";
import { RootState } from "../store";
import { setUserOnlineStatus, logoutUserAsync } from "../slices/authSlice";
import { Channel } from "../../lib/types";
import logger from "../../lib/logger";

let socket: Socket | null = null;

const joinedChannels = new Set<string>();
const socketListener = createListenerMiddleware();

socketListener.startListening({
  actionCreator: connectRequested,
  effect: async (_, listenerApi) => {
    if (socket) return;

    const serverUrl =
      import.meta.env.VITE_SERVER_URL ||
      import.meta.env.VITE_API_URL ||
      window.location.origin;
    logger.info("[SOCKET] Initializing connection to:", serverUrl);

    socket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on("connect", () => {
      logger.info("[SOCKET] Connected with ID:", socket?.id);
      listenerApi.dispatch(socketConnected());

      logger.debug(`[SOCKET] Re-joining ${joinedChannels.size} rooms...`);
      joinedChannels.forEach((channelId) => {
        socket?.emit("join-channel", channelId);
      });
    });

    socket.on("connect_error", (error) => {
      logger.error("[SOCKET] Connection error:", error);

      const errorMessage = error.message;
      if (
        errorMessage === "Unauthorized" ||
        errorMessage === "User does not exist" ||
        errorMessage === "Not authenticated" ||
        errorMessage === "server error" // Catch generic error if middleware failed hard
      ) {
        logger.warn("[SOCKET] Auth failed, logging out...");
        listenerApi.dispatch(logoutUserAsync() as any);
      }
    });

    socket.on("disconnect", (reason) => {
      logger.warn("[SOCKET] Disconnected:", reason);
      listenerApi.dispatch(socketDisconnected());
    });

    socket.on("online_users", (users: string[]) => {
      const state = listenerApi.getState() as RootState;
      const currentUserId = state.authReducer.currentUser?.id;
      listenerApi.dispatch(setOnlineUsers(users));
      if (!currentUserId) return;

      listenerApi.dispatch(
        setUserOnlineStatus(users.includes(String(currentUserId))),
      );
    });

    socket.on(
      "channel_online_users",
      (data: { channelId: string; users: string[] }) => {
        listenerApi.dispatch(setChannelOnlineUsers(data));
      },
    );

    socket.on("online_count", (count: number) => {
      listenerApi.dispatch(setOnlineCount(count));
    });

    socket.on("user-online", (userId: string) => {
      const state = listenerApi.getState() as RootState;
      const currentUserId = state.authReducer.currentUser?.id;

      listenerApi.dispatch(userOnline(userId));
      if (currentUserId && currentUserId === Number(userId)) {
        listenerApi.dispatch(setUserOnlineStatus(true));
      }
    });

    socket.on("user-offline", (userId: string) => {
      const state = listenerApi.getState() as RootState;
      const currentUserId = state.authReducer.currentUser?.id;

      listenerApi.dispatch(userOffline(userId));
      if (currentUserId && currentUserId === Number(userId)) {
        listenerApi.dispatch(setUserOnlineStatus(false));
      }
    });

    socket.on("new-message", (message) => {
      logger.info("[SOCKET] New message:", message);
      listenerApi.dispatch(appendMessage(message));
    });

    socket.on("channel-joined", ({ channel }) => {
      listenerApi.dispatch(addChannel(channel));
      socket?.emit("join-channel", String(channel.id));
    });

    socket.on("member-joined", ({ channelId, member }) => {
      listenerApi.dispatch(addMember({ channelId, member }));
    });

    socket.on(
      "message-updated",
      (data: { id: string | number; content: string }) => {
        listenerApi.dispatch(updateLocalMessage(data));
      },
    );

    socket.on("message-deleted", (data: { id: string | number }) => {
      listenerApi.dispatch(removeLocalMessage(data));
    });

    socket.on("member-removed", ({ channelId }: { channelId: number }) => {
      listenerApi.dispatch(removeChannel(String(channelId)));
    });
  },
});

socketListener.startListening({
  actionCreator: getChannelsAsync.fulfilled,
  effect: async (action) => {
    const channels = action.payload.data.channels as Channel[] | undefined;
    if (!channels) return;

    channels.forEach((channel) => {
      const channelId = String(channel.id);
      joinedChannels.add(channelId);
      if (socket?.connected) {
        socket.emit("join-channel", channelId);
      }
    });
  },
});

socketListener.startListening({
  actionCreator: createChannelAsync.fulfilled,
  effect: async (action) => {
    const channelId = String(action.payload.data.channel.id);

    joinedChannels.add(channelId);
    if (socket?.connected) {
      socket.emit("join-channel", channelId);
    }
  },
});

socketListener.startListening({
  actionCreator: disconnectRequested,
  effect: async () => {
    logger.info("[SOCKET] Disconnect requested");
    socket?.disconnect();
    socket = null;
  },
});

socketListener.startListening({
  actionCreator: joinChannelAsync.fulfilled,
  effect: async (action) => {
    const channelId = String(action.meta.arg);

    joinedChannels.add(channelId);
    if (socket?.connected) {
      socket.emit("join-channel", channelId);
    }
  },
});

socketListener.startListening({
  actionCreator: sendMessage,
  effect: async (action) => {
    if (socket?.connected) {
      socket.emit("send-message", action.payload);
    } else {
      logger.error(
        "[SOCKET] Cannot send: Socket disconnected or uninitialized",
      );
    }
  },
});

export { socketListener };
