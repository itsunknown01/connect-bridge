import { db } from "@/lib/db";
import { userProfile } from "@/lib/user-profile";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSection from "./server-section";
import { ChannelType } from "@prisma/client";
import ServerChannel from "./server-channel";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await userProfile();

  if (!profile) {
    return redirect(`/`);
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const voiceChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  if (!server) {
    redirect(`/channels`);
  }

  const handleRole = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#282D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={handleRole} />
      <ScrollArea className="flex-1 px-3">
        {!!textChannels?.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={handleRole}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={handleRole}
                />
              ))}
            </div>
          </div>
        )}
        {!!voiceChannels?.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={handleRole}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {voiceChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={handleRole}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={handleRole}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels?.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                  role={handleRole}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
