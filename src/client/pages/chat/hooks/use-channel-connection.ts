import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import {
  joinChannelAsync
} from "@/src/client/redux/slices/channelSlice";
import {
  clearMessages,
  fetchChannelMessagesAsync,
} from "@/src/client/redux/slices/messageSlice";
import { RootState } from "@/src/client/redux/store";
import { useEffect, useRef } from "react";

export default function useChannelConnection(channelId: string | null) {
  const dispatch = useAppDispatch();
  const joinChannelRef = useRef<string | null>(null);
  const { channels } = useAppSelector((state: RootState) => state.channelReducer);

  useEffect(() => {
    if (!channelId) return;

    if (joinChannelRef.current === channelId) return;

    joinChannelRef.current = channelId;

    const connectChannel = async () => {
      dispatch(clearMessages());
      await dispatch(joinChannelAsync(channelId));
      // Only fetch messages if the channel has existing messages to prevent shuttering
      const channel = channels.find((ch) => String(ch.id) === channelId);
      if (channel && (channel.messageCount ?? 0) > 0) {
        dispatch(
          fetchChannelMessagesAsync({
            channelId,
          })
        );
      }
    };

    connectChannel();
  }, [channelId, channels]);
}
