"use client"

import React from "react";
import ActionTooltip from "../Feature/action-tooltip";
import { BsDiscord } from "react-icons/bs";
import { useRouter } from "next/navigation";

const NavigationChatRoom = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push("/channels/me")
  }

  return (
    <ActionTooltip label="Direct messages" side="left" align="center">
      <button className="group flex items-center" onClick={() => handleClick()}>
        <div className="flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-[#404eed]">
          <div className="group-hover:text-white text-[#404eed]">
            <BsDiscord fontSize={25} />
          </div>
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationChatRoom;
