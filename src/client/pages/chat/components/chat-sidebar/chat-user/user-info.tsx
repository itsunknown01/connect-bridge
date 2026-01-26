export default function UserInfo({
  name,
  email,
  isOnline,
}: {
  name: string;
  email?: string;
  isOnline?: boolean;
}) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="text-sm font-semibold text-[#12372A] truncate">
        {name}
      </span>
      <span className="truncate text-xs">
        {!email ? (isOnline ? "Online" : "Offline") : email}
      </span>
    </div>
  );
}
