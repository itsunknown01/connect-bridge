import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../lib/types";
import { axiosPrivate } from "../../helpers/api";
import { RootState } from "../store";

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

const initialState: MessageState = {
  loadedChannelId: null,
  searchResults: [],
  messages: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  nextCursor: null,
  searchLoading: false,
  error: null,
};

export const fetchChannelMessagesAsync = createAsyncThunk(
  "messages/fetch",
  async ({ channelId, limit = 50 }: { channelId: string; limit?: number }) => {
    const res = await axiosPrivate.get(`/channels/${channelId}/messages`, {
      params: { limit },
    });
    return { channelId, data: res.data };
  },
  {
    condition: ({ channelId }, { getState }) => {
      const state = getState() as RootState;
      if (state.messageReducer.loadedChannelId === channelId) return false;
      return true;
    },
  },
);

export const fetchMoreMessagesAsync = createAsyncThunk(
  "messages/fetchMore",
  async ({
    channelId,
    cursor,
    limit = 50,
  }: {
    channelId: string;
    cursor: string | number;
    limit?: number;
  }) => {
    const res = await axiosPrivate.get(`/channels/${channelId}/messages`, {
      params: { limit, cursor },
    });
    return { channelId, data: res.data };
  },
);

export const searchChannelMessagesAsync = createAsyncThunk(
  "messages/search",
  async ({
    channelId,
    query,
    limit,
  }: {
    channelId: string;
    query: string;
    limit: number;
  }) => {
    const res = await axiosPrivate.get(
      `/channels/${channelId}/messages/search`,
      {
        params: {
          search: query,
          limit,
        },
      },
    );
    return res.data;
  },
);

export const updateMessageAsync = createAsyncThunk(
  "messages/update",
  async (
    {
      channelId,
      messageId,
      content,
    }: { channelId: string; messageId: string | number; content: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosPrivate.put(
        `/channels/${channelId}/messages/${messageId}`,
        { content },
      );
      return { channelId, messageId, content, data: res.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update message",
      );
    }
  },
);

export const deleteMessageAsync = createAsyncThunk(
  "messages/delete",
  async (
    { channelId, messageId }: { channelId: string; messageId: string | number },
    { rejectWithValue },
  ) => {
    try {
      await axiosPrivate.delete(`/channels/${channelId}/messages/${messageId}`);
      return { channelId, messageId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    sendMessage(
      state,
      action: PayloadAction<{ channelId: string; content: string }>,
    ) {},
    clearMessages(state) {
      state.messages = [];
      state.loadedChannelId = null;
      state.nextCursor = null;
      state.hasMore = true;
    },
    setLoadedChannelId(state, action: PayloadAction<string>) {
      state.loadedChannelId = action.payload;
    },
    appendMessage(state, action) {
      if (
        state.loadedChannelId &&
        String(state.loadedChannelId) === String(action.payload.channelId)
      ) {
        const exists = state.messages.some(
          (m) => String(m.id) === String(action.payload.id),
        );
        if (!exists) {
          state.messages.push(action.payload);
        }
      }
    },
    clearSearchResults(state) {
      state.searchResults = [];
      state.searchLoading = false;
    },
    removeLocalMessage(state, action: PayloadAction<{ id: string | number }>) {
      state.messages = state.messages.filter(
        (m) => String(m.id) !== String(action.payload.id),
      );
    },
    updateLocalMessage(
      state,
      action: PayloadAction<{ id: string | number; content: string }>,
    ) {
      const message = state.messages.find(
        (m) => String(m.id) === String(action.payload.id),
      );
      if (message) {
        message.content = action.payload.content;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelMessagesAsync.pending, (state, action) => {
        state.loading = true;
        state.loadedChannelId = action.meta.arg.channelId;
      })
      .addCase(fetchChannelMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data.messages;
        state.nextCursor = action.payload.data.nextCursor;
        state.hasMore = !!action.payload.data.nextCursor;
        state.loadedChannelId = action.payload.channelId;
      })
      .addCase(fetchChannelMessagesAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.messages = [];
        state.loadedChannelId = null;
      })
      // Fetch More
      .addCase(fetchMoreMessagesAsync.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreMessagesAsync.fulfilled, (state, action) => {
        state.loadingMore = false;
        const newMessages = action.payload.data.messages;
        // Prepend new (older) messages, ensuring no duplicates
        const existingIds = new Set(state.messages.map((m) => String(m.id)));
        const uniqueNew = newMessages.filter(
          (m: any) => !existingIds.has(String(m.id)),
        );

        state.messages = [...uniqueNew, ...state.messages];
        state.nextCursor = action.payload.data.nextCursor;
        state.hasMore = !!action.payload.data.nextCursor;
      })
      .addCase(fetchMoreMessagesAsync.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      .addCase(searchChannelMessagesAsync.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchChannelMessagesAsync.fulfilled, (state, action) => {
        state.searchResults = action.payload.messages;
        state.searchLoading = false;
      })
      .addCase(searchChannelMessagesAsync.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
        state.searchResults = [];
      })
      // Internal management
      .addCase(updateMessageAsync.fulfilled, (state, action) => {
        const message = state.messages.find(
          (m) => String(m.id) === String(action.payload.messageId),
        );
        if (message) {
          message.content = action.payload.content;
        }
      })
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (m) => String(m.id) !== String(action.payload.messageId),
        );
      });
  },
});

export const {
  clearMessages,
  appendMessage,
  sendMessage,
  clearSearchResults,
  setLoadedChannelId,
  updateLocalMessage,
  removeLocalMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
