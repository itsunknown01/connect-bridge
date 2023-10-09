"use client"

import React from "react";
import ActionTooltip from "../Feature/action-tooltip";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal";

const NavigationAction = () => {
  const { onOpen } = useModal()
  return (
    <ActionTooltip label="Add a server" side="right" align="center">
      <button className="group flex items-center" onClick={() => onOpen("createServer") }>
        <div className="flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
          <Plus className="group-hover:text-white text-emerald-500" size={25} />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationAction;
