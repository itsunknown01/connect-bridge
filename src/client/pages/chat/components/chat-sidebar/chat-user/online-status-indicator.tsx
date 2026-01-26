export default function OnlineStatusIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      }`}
      aria-label={isOnline ? "Online" : "Offline"}
    />
  );
}