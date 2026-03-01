import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/auth-store";
import { useSocketStore } from "../stores/socket-store";
import { useMessageStore } from "../stores/message-store";
import { useChannelStore } from "../stores/channel-store";
import logger from "./logger";
import axios from "../helpers/api";

let socket: Socket | null = null;
const joinedChannels = new Set<string>();

function getServerUrl(): string {
  const rawUrl =
    import.meta.env.VITE_SERVER_URL ||
    import.meta.env.VITE_API_URL ||
    window.location.origin;
  try {
    return new URL(rawUrl).origin;
  } catch {
    return rawUrl;
  }
}

export const socketManager = {
  connect() {
    if (socket) return;

    const serverUrl = getServerUrl();
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
      useSocketStore.getState().setConnected();

      // Re-join all previously joined channels
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
        errorMessage === "server error"
      ) {
        logger.warn("[SOCKET] Auth failed, logging out...");
        // Perform logout
        axios.get("/logout").catch(() => {});
        useAuthStore.getState().clearAuth();
        localStorage.removeItem("authenticated");
        socketManager.disconnect();
      }
    });

    socket.on("disconnect", (reason) => {
      logger.warn("[SOCKET] Disconnected:", reason);
      useSocketStore.getState().setDisconnected();
    });

    socket.on("online_users", (users: string[]) => {
      const currentUserId = useAuthStore.getState().currentUser?.id;
      useSocketStore.getState().setOnlineUsers(users);
      if (currentUserId) {
        useAuthStore
          .getState()
          .setOnlineStatus(users.includes(String(currentUserId)));
      }
    });

    socket.on(
      "channel_online_users",
      (data: { channelId: string; users: string[] }) => {
        useSocketStore
          .getState()
          .setChannelOnlineUsers(data.channelId, data.users);
      },
    );

    socket.on("online_count", (count: number) => {
      useSocketStore.getState().setOnlineCount(count);
    });

    socket.on("user-online", (userId: string) => {
      const currentUserId = useAuthStore.getState().currentUser?.id;
      useSocketStore.getState().addUserOnline(userId);
      // Also add to all joined channels' online lists
      joinedChannels.forEach((channelId) => {
        useSocketStore.getState().addUserToChannel(channelId, userId);
      });
      if (currentUserId && currentUserId === Number(userId)) {
        useAuthStore.getState().setOnlineStatus(true);
      }
    });

    socket.on("user-offline", (userId: string) => {
      const currentUserId = useAuthStore.getState().currentUser?.id;
      useSocketStore.getState().removeUserOffline(userId);
      if (currentUserId && currentUserId === Number(userId)) {
        useAuthStore.getState().setOnlineStatus(false);
      }
    });

    socket.on("new-message", (message) => {
      logger.info("[SOCKET] New message:", message);
      useMessageStore.getState().appendMessage(message);
    });

    socket.on("channel-joined", ({ channel }) => {
      useChannelStore.getState().addChannel(channel);
      socket?.emit("join-channel", String(channel.id));
    });

    socket.on("member-joined", (_data: { channelId: string; member: any }) => {
      // Members are managed via React Query (useChannelMembers),
      // so we could invalidate the query cache here if needed.
      // For now, the members hook will refetch on its own stale schedule.
    });

    socket.on(
      "message-updated",
      (data: { id: string | number; content: string }) => {
        useMessageStore.getState().updateMessage(data.id, data.content);
      },
    );

    socket.on("message-deleted", (data: { id: string | number }) => {
      useMessageStore.getState().removeMessage(data.id);
    });

    socket.on("member-removed", ({ channelId }: { channelId: number }) => {
      useChannelStore.getState().removeChannel(String(channelId));
    });
  },

  disconnect() {
    logger.info("[SOCKET] Disconnect requested");
    socket?.disconnect();
    socket = null;
    joinedChannels.clear();
  },

  emit(event: string, data?: any) {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      logger.error(
        "[SOCKET] Cannot send: Socket disconnected or uninitialized",
      );
    }
  },

  joinChannel(channelId: string) {
    joinedChannels.add(channelId);
    if (socket?.connected) {
      socket.emit("join-channel", channelId);
    }
  },

  joinChannels(channelIds: string[]) {
    channelIds.forEach((id) => {
      joinedChannels.add(id);
      if (socket?.connected) {
        socket.emit("join-channel", id);
      }
    });
  },

  leaveChannel(channelId: string) {
    joinedChannels.delete(channelId);
    // No explicit "leave-channel" event needed — backend handles via socket rooms
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};
