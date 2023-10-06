"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileToggle from "../Feature/MobileToggle";
import { Button } from "../ui/button";
import Navbar from "./Navbar";

const Header = () => {
  const router = useRouter();

  return (
    <header className="static px-6 md:flex md:items-center md:justify-center md:px-10">
      <nav className="w-full flex items-center justify-between py-6">
        <Link href="/" className="flex items-start justify-center">
          <Image
            src="/logo.svg"
            width={124}
            height={34}
            alt="logo"
            className="object-contain"
          />
        </Link>
        <div className="hidden md:block">
          <Navbar />
        </div>
        <div className="flex items-center gap-5 md:flex-row-reverse">
          <Button
            onClick={() => router.push("/sign-in")}
            className="inline-flex leading-6 font-medium items-center whitespace-nowrap rounded-[40px] text-sm px-4 py-[7px] bg-white text-black hover:bg-white"
          >
            Login
          </Button>
          <MobileToggle className="md:hidden" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
