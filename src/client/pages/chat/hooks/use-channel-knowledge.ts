import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../../../helpers/api";
import { Knowledge } from "../../../lib/types";

/**
 * Hook to manage channel-specific knowledge artifacts with automated caching.
 */
export default function useChannelKnowledge(channelId: string | null) {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Knowledge[]>({
    queryKey: ["knowledge", channelId],
    queryFn: async () => {
      if (!channelId) return [];
      const res = await axiosPrivate.get(`/channels/${channelId}/knowledge`);
      return res.data.items;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: async (data: { messageId: string }) => {
      const res = await axiosPrivate.post(
        `/channels/${channelId}/knowledge`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", channelId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (knowledgeId: string) => {
      const res = await axiosPrivate.delete(
        `/channels/${channelId}/knowledge/${knowledgeId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge", channelId] });
    },
  });

  return {
    items,
    loading,
    error,
    refetch,
    saveKnowledge: createMutation.mutateAsync,
    deleteKnowledge: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
