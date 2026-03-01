import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/src/client/helpers/api";
import { useMessageStore } from "@/src/client/stores/message-store";
import { useCallback, useEffect } from "react";
import { socketManager } from "@/src/client/lib/socket-manager";

/**
 * Hook to fetch & manage messages for a channel.
 * Replaces the old useChatMessages + Redux messageSlice approach.
 */
export function useChatMessages(channelId: string | null) {
  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    error,
    nextCursor,
    loadedChannelId,
    setMessages,
    setLoading,
    setLoadedChannelId,
    clearMessages,
    prependMessages,
    setLoadingMore,
    setCursor,
    setError,
  } = useMessageStore();

  // Initial fetch when channel changes
  useEffect(() => {
    if (!channelId) return;
    if (loadedChannelId === channelId) return;

    const fetchMessages = async () => {
      setLoading(true);
      setLoadedChannelId(channelId);
      try {
        const res = await axiosPrivate.get(`/channels/${channelId}/messages`, {
          params: { limit: 50 },
        });
        setMessages(res.data.messages, channelId);
        setCursor(res.data.nextCursor);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch messages");
        clearMessages();
      }
    };

    clearMessages();
    fetchMessages();
  }, [channelId]);

  const fetchMore = useCallback(() => {
    if (!hasMore || loadingMore || !nextCursor || !channelId) return;

    setLoadingMore(true);
    axiosPrivate
      .get(`/channels/${channelId}/messages`, {
        params: { limit: 50, cursor: nextCursor },
      })
      .then((res) => {
        prependMessages(res.data.messages, res.data.nextCursor);
      })
      .catch((err) => {
        setLoadingMore(false);
        setError(err.response?.data?.message || "Failed to load more");
      });
  }, [hasMore, loadingMore, nextCursor, channelId]);

  const send = useCallback(
    (content: string) => {
      if (channelId) {
        socketManager.emit("send-message", { channelId, content });
      }
    },
    [channelId],
  );

  return {
    messages,
    loading,
    loadingMore,
    hasMore,
    fetchMore,
    send,
    error,
  };
}

export function useSearchMessages() {
  const { setSearchResults, setSearchLoading, setError, clearSearchResults } =
    useMessageStore();

  const mutation = useMutation({
    mutationFn: async ({
      channelId,
      query,
      limit,
    }: {
      channelId: string;
      query: string;
      limit: number;
    }) => {
      setSearchLoading(true);
      const res = await axiosPrivate.get(
        `/channels/${channelId}/messages/search`,
        {
          params: { search: query, limit },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      setSearchResults(data.messages);
    },
    onError: (err: any) => {
      setSearchLoading(false);
      setError(err.response?.data?.message || "Search failed");
    },
  });

  return {
    ...mutation,
    clearSearchResults,
  };
}

export function useUpdateMessage() {
  return useMutation({
    mutationFn: async ({
      channelId,
      messageId,
      content,
    }: {
      channelId: string;
      messageId: string | number;
      content: string;
    }) => {
      const res = await axiosPrivate.put(
        `/channels/${channelId}/messages/${messageId}`,
        { content },
      );
      return { channelId, messageId, content, data: res.data };
    },
    onSuccess: ({ messageId, content }) => {
      useMessageStore.getState().updateMessage(messageId, content);
    },
  });
}

export function useDeleteMessage() {
  return useMutation({
    mutationFn: async ({
      channelId,
      messageId,
    }: {
      channelId: string;
      messageId: string | number;
    }) => {
      await axiosPrivate.delete(`/channels/${channelId}/messages/${messageId}`);
      return { channelId, messageId };
    },
    onSuccess: ({ messageId }) => {
      useMessageStore.getState().removeMessage(messageId);
    },
  });
}
