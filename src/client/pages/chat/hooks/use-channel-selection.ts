import { Channel } from "@/src/client/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function useChannelSelection(channels: Channel[]) {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );

  const setChannelSafe = useCallback((id: string) => {
    setSelectedChannelId((prev) => {
      if (prev === id) return prev; // 🔒 HARD GUARD
      return id;
    });
  }, []);

  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      setChannelSafe(String(channels[0].id));
    }
  }, [selectedChannelId, channels]);

  const selectedChannel = channels.find(
    (ch) => String(ch.id) === selectedChannelId
  );

  return {
    selectedChannelId,
    setSelectedChannelId,
    selectedChannel,
  };
}
