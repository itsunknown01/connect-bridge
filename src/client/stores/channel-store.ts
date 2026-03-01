import { create } from "zustand";
import { Channel } from "../lib/types";

interface ChannelState {
  channels: Channel[];
  currentChannel: Channel | null;
  loading: boolean;
  error: string | null;
}

interface ChannelActions {
  setChannels: (channels: Channel[]) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (channel: Channel) => void;
  clearCurrentChannel: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChannelStore = create<ChannelState & ChannelActions>(
  (set, get) => ({
    channels: [],
    currentChannel: null,
    loading: false,
    error: null,

    setChannels: (channels) => {
      const { currentChannel } = get();
      // Preserve current selection if it still exists in the new list
      const stillExists = currentChannel
        ? channels.find((c) => String(c.id) === String(currentChannel.id))
        : null;
      set({
        channels,
        currentChannel: stillExists || currentChannel || channels[0] || null,
      });
    },

    setCurrentChannel: (channel) => set({ currentChannel: channel }),

    addChannel: (channel) => {
      const { channels } = get();
      const exists = channels.some((c) => c.id === channel.id);
      if (!exists) {
        set({ channels: [...channels, channel] });
      }
    },

    removeChannel: (channelId) => {
      const { channels, currentChannel } = get();
      const filtered = channels.filter((ch) => String(ch.id) !== channelId);
      const newCurrent =
        currentChannel && String(currentChannel.id) === channelId
          ? filtered[0] || null
          : currentChannel;
      set({ channels: filtered, currentChannel: newCurrent });
    },

    updateChannel: (updatedChannel) => {
      const { channels, currentChannel } = get();
      const updated = channels.map((c) =>
        String(c.id) === String(updatedChannel.id)
          ? { ...c, ...updatedChannel }
          : c,
      );
      set({
        channels: updated,
        currentChannel:
          currentChannel &&
          String(currentChannel.id) === String(updatedChannel.id)
            ? { ...currentChannel, ...updatedChannel }
            : currentChannel,
      });
    },

    clearCurrentChannel: () => set({ currentChannel: null }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }),
);
