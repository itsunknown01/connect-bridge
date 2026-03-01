import { create } from "zustand";
import { Message } from "../lib/types";

interface MessageState {
  messages: Message[];
  searchResults: Message[];
  loadedChannelId: string | null;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  nextCursor: string | number | null;
  searchLoading: boolean;
  error: string | null;
}

interface MessageActions {
  setMessages: (messages: Message[], channelId: string) => void;
  appendMessage: (message: Message & { channelId: string }) => void;
  removeMessage: (id: string | number) => void;
  updateMessage: (id: string | number, content: string) => void;
  prependMessages: (
    messages: Message[],
    nextCursor: string | number | null,
  ) => void;
  clearMessages: () => void;
  setSearchResults: (results: Message[]) => void;
  clearSearchResults: () => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setLoadedChannelId: (id: string | null) => void;
  setCursor: (cursor: string | number | null) => void;
  setError: (error: string | null) => void;
  setSearchLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState & MessageActions>(
  (set, get) => ({
    messages: [],
    searchResults: [],
    loadedChannelId: null,
    loading: false,
    loadingMore: false,
    hasMore: true,
    nextCursor: null,
    searchLoading: false,
    error: null,

    setMessages: (messages, channelId) =>
      set({
        messages,
        loadedChannelId: channelId,
        loading: false,
        hasMore: true,
      }),

    appendMessage: (message) => {
      const { loadedChannelId, messages } = get();
      if (
        loadedChannelId &&
        String(loadedChannelId) === String(message.channelId)
      ) {
        const exists = messages.some(
          (m) => String(m.id) === String(message.id),
        );
        if (!exists) {
          set({ messages: [...messages, message] });
        }
      }
    },

    removeMessage: (id) => {
      const { messages } = get();
      set({ messages: messages.filter((m) => String(m.id) !== String(id)) });
    },

    updateMessage: (id, content) => {
      const { messages } = get();
      set({
        messages: messages.map((m) =>
          String(m.id) === String(id) ? { ...m, content } : m,
        ),
      });
    },

    prependMessages: (newMessages, nextCursor) => {
      const { messages } = get();
      const existingIds = new Set(messages.map((m) => String(m.id)));
      const unique = newMessages.filter((m) => !existingIds.has(String(m.id)));
      set({
        messages: [...unique, ...messages],
        nextCursor,
        hasMore: !!nextCursor,
        loadingMore: false,
      });
    },

    clearMessages: () =>
      set({
        messages: [],
        loadedChannelId: null,
        nextCursor: null,
        hasMore: true,
      }),

    setSearchResults: (results) =>
      set({ searchResults: results, searchLoading: false }),
    clearSearchResults: () => set({ searchResults: [], searchLoading: false }),
    setLoading: (loading) => set({ loading }),
    setLoadingMore: (loading) => set({ loadingMore: loading }),
    setLoadedChannelId: (id) => set({ loadedChannelId: id }),
    setCursor: (cursor) => set({ nextCursor: cursor, hasMore: !!cursor }),
    setError: (error) => set({ error }),
    setSearchLoading: (loading) => set({ searchLoading: loading }),
  }),
);
