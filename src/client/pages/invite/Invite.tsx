import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/src/client/stores/auth-store";
import { useJoinChannel } from "@/src/client/hooks/api/use-channel-queries";
import { toast } from "sonner";

export default function Invite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = !!accessToken;
  const joinChannel = useJoinChannel();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please login to join the channel");
      navigate("/auth", { state: { from: `/invite/${id}` } });
      return;
    }

    if (!id) {
      toast.error("Invalid invite link");
      navigate("/");
      return;
    }

    const doJoin = async () => {
      try {
        await joinChannel.mutateAsync(id);
        toast.success("Joined channel successfully!");
        navigate("/chats");
      } catch (error: any) {
        const message = error?.response?.data?.message || "";
        if (message.includes("Already a member")) {
          navigate("/chats");
        } else {
          toast.error(message || "Failed to join channel");
          navigate("/");
        }
      }
    };

    doJoin();
  }, [id, isAuthenticated]);

  return (
    <div className="h-screen flex items-center justify-center bg-white w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#ADBC9F] border-t-transparent" />
        <p className="text-gray-500 font-medium">Joining channel...</p>
      </div>
    </div>
  );
}
