interface ChannelWelcomeProps {
  channelName: string;
}

export default function ChannelWelcome({ channelName }: ChannelWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-16 h-16 bg-gradient-to-br from-[#ADBC9F] to-[#12372A] rounded-2xl flex items-center justify-center mb-4">
        <span className="text-white text-2xl font-bold">#</span>
      </div>
      <h3 className="text-2xl font-bold text-[#12372A] dark:text-white mb-2">
        Welcome to #{channelName}
      </h3>
      <p className="text-sm text-gray-600 dark:text-white/70 text-center max-w-md">
        This is the beginning of the #{channelName} channel. Start the
        conversation!
      </p>
    </div>
  );
}
