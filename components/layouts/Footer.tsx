"use client";

import { footerSectionsData, socialLinks } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import LanguageMenu from "../Feature/language-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="w-full h-full flex flex-col bg-[#23272a] px-20 pt-28 pb-16">
      <div className="flex flex-wrap md:flex-row flex-grow md:justify-between px-10">
        <div className="flex flex-col mb-14 min-w-full md:min-w-fit">
          <div className="mb-14">
            <LanguageMenu />
          </div>
          <div className="flex mt-6 items-center gap-6">
            {socialLinks.map((link) => (
              <Link href={link.url} key={link.name} className="object-contain">
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
        {footerSectionsData.map((section) => (
          <div key={section.title} className="flex-2 w-1/2 md:w-auto mb-10 text-white">
            <h5 className="text-[#5865f2] text-base mb-2.5">{section.title}</h5>
            {section.content.map((link,index) => (
              <Link key={index} href={"/"} className="flex flex-col gap-y-10">
                {link.link}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <Separator className="bg-[#5865f2]" />
      <div className="flex items-center justify-between mt-8">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={124}
            height={34}
            alt="logo"
            className="object-contain"
          />
        </Link>
        <Button className="inline-flex leading-6 font-medium items-center whitespace-nowrap rounded-[40px] text-sm px-4 py-[7px] bg-[#5865f2] text-white hover:bg-white">
          Download
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
