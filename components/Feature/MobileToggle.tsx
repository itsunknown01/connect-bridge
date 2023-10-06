"use client"

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { navLinks } from "@/lib/constants";
import Link from "next/link";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageName } from "@/lib/types";

const MobileToggle = ({ className }: { className: string }) => {
  const [active, setActive] = useState<PageName>("Home");

  return (
    <Sheet>
      <SheetTrigger asChild className={className}>
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center justify-center"
        >
          <Menu color="white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-black.svg"
            width={124}
            height={34}
            alt="logo"
            className="object-contain"
          />
        </Link>
        <Separator />
        <nav className="flex flex-col">
          {navLinks.map((link, index) => (
            <Link
              href="/"
              key={index}
              className={cn("flex items-center py-2 px-4", {
                "bg-[#f6f6f6] text-[#00b0f4] rounded-[8px]": active === link.name,
              })}
              onClick={()=> setActive(link.name)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
