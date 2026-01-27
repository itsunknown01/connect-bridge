import {
  clearMessages,
  fetchChannelMessagesAsync,
  fetchMoreMessagesAsync,
  sendMessage,
} from "@/src/client/redux/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { useCallback, useEffect } from "react";

export function useChatMessages(channelId: string | null) {
  const dispatch = useAppDispatch();

  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    error,
    nextCursor,
    loadedChannelId,
  } = useAppSelector((state) => state.messageReducer);

  // Initial fetch when channel changes
  useEffect(() => {
    if (channelId && loadedChannelId !== channelId) {
      dispatch(clearMessages());
      dispatch(fetchChannelMessagesAsync({ channelId }));
    }
  }, [channelId, dispatch, loadedChannelId]);

  const fetchMore = useCallback(() => {
    if (hasMore && !loadingMore && nextCursor && channelId) {
      dispatch(
        fetchMoreMessagesAsync({
          channelId,
          cursor: nextCursor,
        }),
      );
    }
  }, [hasMore, loadingMore, nextCursor, channelId, dispatch]);

  const send = (content: string) => {
    if (channelId) {
      dispatch(sendMessage({ channelId, content }));
    }
  };

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
