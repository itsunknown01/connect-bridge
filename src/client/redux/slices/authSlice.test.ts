import { describe, it, expect } from "vitest";
import authReducer, { setUserOnlineStatus } from "./authSlice";

describe("authSlice", () => {
  const initialState = {
    currentUser: null,
    accessToken: null,
    isOnline: false,
    success: false,
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setUserOnlineStatus", () => {
    const actual = authReducer(initialState, setUserOnlineStatus(true));
    expect(actual.isOnline).toBe(true);
  });
});
