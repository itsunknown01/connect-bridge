import { RootState } from "@/src/client/redux/store";
import { createSelector } from "@reduxjs/toolkit";

// Channel Selectors
export const selectChannelState = (state: RootState) => state.channelReducer;
export const selectChannels = createSelector(
  selectChannelState,
  (state) => state.channels,
);
export const selectCurrentChannel = createSelector(
  selectChannelState,
  (state) => state.currentChannel,
);
export const selectChannelLoading = createSelector(
  selectChannelState,
  (state) => state.loading,
);

// Message Selectors
export const selectMessageState = (state: RootState) => state.messageReducer;
export const selectMessages = createSelector(
  selectMessageState,
  (state) => state.messages,
);
export const selectMessageLoading = createSelector(
  selectMessageState,
  (state) => state.loading,
);

// Auth Selectors
export const selectAuthState = (state: RootState) => state.authReducer;
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser,
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.success,
);
