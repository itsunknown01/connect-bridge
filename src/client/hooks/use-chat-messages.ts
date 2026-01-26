import { useAppDispatch } from "@/src/client/hooks";
import { sendMessage } from "@/src/client/redux/slices/messageSlice";
import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../helpers/api";

export function useChatMessages(channelId: string | null) {
  const dispatch = useAppDispatch();

  // Use TanStack Query for hyper-scale message fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: async ({ pageParam }) => {
      const res = await axiosPrivate.get(`/channels/${channelId}/messages`, {
        params: { cursor: pageParam, limit: 50 },
      });
      return res.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    enabled: !!channelId,
    // Keep data fresh but allow background updates
    staleTime: 1000 * 60,
  });

  // Flatten messages from all pages
  const messages = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.messages) || [];
  }, [data]);

  const fetchMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const send = (content: string) => {
    if (channelId) {
      dispatch(sendMessage({ channelId, content }));
    }
  };

  return {
    messages,
    loading: isLoading,
    loadingMore: isFetchingNextPage,
    hasMore: !!hasNextPage,
    fetchMore,
    send,
    error: error ? (error as any).message : null,
  };
}
