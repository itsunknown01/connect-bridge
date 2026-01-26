import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivate } from "../../../helpers/api";
import { Outcome, OutcomeType } from "../../../lib/types";

/**
 * Hook to manage channel-specific outcomes with automated caching.
 */
export default function useChannelOutcomes(channelId: string | null) {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Outcome[]>({
    queryKey: ["outcomes", channelId],
    queryFn: async () => {
      if (!channelId) return [];
      const res = await axiosPrivate.get(`/channels/${channelId}/outcomes`);
      return res.data.results;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: async (data: {
      messageId: string;
      type: OutcomeType;
      assignedId: string | null;
    }) => {
      const res = await axiosPrivate.post(
        `/channels/${channelId}/outcomes`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outcomes", channelId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (outcomeId: string) => {
      const res = await axiosPrivate.delete(
        `/channels/${channelId}/outcomes/${outcomeId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outcomes", channelId] });
    },
  });

  return {
    items,
    loading,
    error,
    refetch,
    createOutcome: createMutation.mutateAsync,
    deleteOutcome: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
