import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ChannelsSchema } from "@/src/schemas";
import { axiosPrivate } from "@/src/client/helpers/api";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { useSocketStore } from "@/src/client/stores/socket-store";
import { socketManager } from "@/src/client/lib/socket-manager";

export function useChannels() {
  const { setChannels, setLoading, setError } = useChannelStore();
  const queryClient = useQueryClient();
  const socketConnected = useSocketStore((s) => s.connected);

  const query = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      try {
        const response = await axiosPrivate.get("/channels");
        const channels = response.data.channels;
        setChannels(channels);
        setLoading(false);
        return channels;
      } catch (error: any) {
        setLoading(false);
        const msg = error.response?.data?.message || "Failed to fetch channels";
        setError(msg);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // Join all channels via socket whenever:
  // 1. Channels are loaded (from cache or network)
  // 2. Socket (re)connects
  useEffect(() => {
    if (query.data && query.data.length > 0 && socketConnected) {
      socketManager.joinChannels(query.data.map((ch: any) => String(ch.id)));
    }
  }, [query.data, socketConnected]);

  return query;
}

export function useChannelById(id: string | null) {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosPrivate.get(`/channel/${id}`);
      return response.data.channel;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  const { addChannel } = useChannelStore();

  return useMutation({
    mutationFn: async (data: z.infer<typeof ChannelsSchema>) => {
      const response = await axiosPrivate.post("/create-channels", data);
      return response;
    },
    onSuccess: (response) => {
      const channel = response.data.channel;
      addChannel(channel);
      socketManager.joinChannel(String(channel.id));
      // Update React Query cache directly to avoid full refetch
      queryClient.setQueryData(["channels"], (old: any[]) =>
        old ? [...old, channel] : [channel],
      );
      toast.success(response.data.message || "Channel created");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to create channel";
      toast.error(message);
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      channelId,
    }: {
      data: z.infer<typeof ChannelsSchema>;
      channelId: string;
    }) => {
      const response = await axiosPrivate.put(
        `/update-channels/${channelId}`,
        data,
      );
      return response;
    },
    onSuccess: (response) => {
      const channel = response.data.channel;
      useChannelStore.getState().updateChannel(channel);
      // Update React Query cache directly
      queryClient.setQueryData(["channels"], (old: any[]) =>
        old
          ? old.map((c) =>
              String(c.id) === String(channel.id) ? { ...c, ...channel } : c,
            )
          : old,
      );
      toast.success(response.data.message || "Channel updated");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to update channel";
      toast.error(message);
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await axiosPrivate.delete(
        `/delete-channels/${channelId}`,
      );
      return { channelId, data: response.data };
    },
    onSuccess: ({ channelId, data }) => {
      useChannelStore.getState().removeChannel(channelId);
      // Update React Query cache directly
      queryClient.setQueryData(["channels"], (old: any[]) =>
        old ? old.filter((c) => String(c.id) !== channelId) : old,
      );
      toast.success(data.message || "Channel deleted");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to delete channel";
      toast.error(message);
    },
  });
}

export function useJoinChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosPrivate.get(`/channels/${id}/join`);
      return response;
    },
    onSuccess: (response, channelId) => {
      const channel = response.data?.channel;
      if (channel) {
        useChannelStore.getState().addChannel(channel);
        useChannelStore.getState().setCurrentChannel(channel);
        // Update React Query cache directly
        queryClient.setQueryData(["channels"], (old: any[]) =>
          old ? [...old, channel] : [channel],
        );
      }
      socketManager.joinChannel(String(channelId));
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to join channel";
      toast.error(message);
    },
  });
}

export function useLeaveChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await axiosPrivate.delete(
        `/channels/${channelId}/leave`,
      );
      return { channelId, data: response.data };
    },
    onSuccess: ({ channelId, data }) => {
      useChannelStore.getState().removeChannel(channelId);
      // Update React Query cache directly
      queryClient.setQueryData(["channels"], (old: any[]) =>
        old ? old.filter((c) => String(c.id) !== channelId) : old,
      );
      toast.success(data.message || "Left channel");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to leave channel";
      toast.error(message);
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      email,
    }: {
      channelId: string;
      email: string;
    }) => {
      const response = await axiosPrivate.post(
        `/channels/${channelId}/invite`,
        { email },
      );
      return response;
    },
    onSuccess: (response, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: ["members", channelId] });
      toast.success(response.data.message || "Member invited");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to invite member";
      toast.error(message);
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      userId,
    }: {
      channelId: string;
      userId: string | number;
    }) => {
      const response = await axiosPrivate.delete(
        `/channels/${channelId}/members/${userId}`,
      );
      return { channelId, userId, data: response.data };
    },
    onSuccess: ({ channelId, data }) => {
      queryClient.invalidateQueries({ queryKey: ["members", channelId] });
      toast.success(data.message || "Member removed");
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || "Failed to remove member";
      toast.error(message);
    },
  });
}
