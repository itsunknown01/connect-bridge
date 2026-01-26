import { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an Axios error response.
 * Provides a consistent pattern for thunk error handling.
 */
export function extractApiError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred",
): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

export default extractApiError;
