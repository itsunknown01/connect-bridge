import { useEffect, useRef } from "react";
import { useMessageStore } from "@/src/client/stores/message-store";
import { socketManager } from "@/src/client/lib/socket-manager";
import { axiosPrivate } from "@/src/client/helpers/api";

/**
 * Hook that manages channel connection:
 * - Joins the channel via socket
 * - Fetches initial messages if they haven't been loaded for this channel
 */
export default function useChannelConnection(channelId: string | null) {
  const prevChannelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!channelId || channelId === prevChannelIdRef.current) return;
    prevChannelIdRef.current = channelId;

    const {
      loadedChannelId,
      setLoading,
      setMessages,
      setCursor,
      clearMessages,
      setError,
    } = useMessageStore.getState();

    // Join the channel via socket
    socketManager.joinChannel(channelId);

    // Skip if messages are already loaded for this channel
    if (loadedChannelId === channelId) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      setLoading(true);
      clearMessages();
      try {
        const res = await axiosPrivate.get(`/channels/${channelId}/messages`, {
          params: { limit: 50 },
        });
        setMessages(res.data.messages, channelId);
        setCursor(res.data.nextCursor);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [channelId]);
}
