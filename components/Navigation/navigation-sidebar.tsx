import { db } from "@/lib/db";
import { userProfile } from "@/lib/user-profile";
import { UserButton } from "@clerk/nextjs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavigationAction from "./navigation-action";
import NavigationChatRoom from "./navigation-chat-room";
import NavigationItem from "./navigation-item";

const NavigationSidebar = async () => {
  const profile = await userProfile();

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full pt-2 text-primary w-full dark:bg-[#1E1F22]">
      <NavigationChatRoom />

      <Separator className="h-0.5 bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col space-y-2">
          {servers.map((server) => (
            <div key={server.id} className="mb-4">
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </div>
          ))}
        </div>
        
        <NavigationAction />
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-12 w-12",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
