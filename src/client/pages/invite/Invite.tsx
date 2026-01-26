import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { joinChannelAsync } from "@/src/client/redux/slices/channelSlice";
import { selectIsAuthenticated } from "@/src/client/redux/selectors";
import { toast } from "sonner";

export default function Invite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

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

    const joinChannel = async () => {
      try {
        const result = await dispatch(joinChannelAsync(id));
        if (joinChannelAsync.fulfilled.match(result)) {
          toast.success("Joined channel successfully!");
          navigate("/chats");
        } else {
          // If error is "Already a member", still redirect to chats
          const message = (result.payload as string) || "";
          if (message.includes("Already a member")) {
            navigate("/chats");
          } else {
            toast.error(message || "Failed to join channel");
            navigate("/");
          }
        }
      } catch (error) {
        toast.error("Something went wrong");
        navigate("/");
      }
    };

    joinChannel();
  }, [id, isAuthenticated, dispatch, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-white w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#ADBC9F] border-t-transparent" />
        <p className="text-gray-500 font-medium">Joining channel...</p>
      </div>
    </div>
  );
}
