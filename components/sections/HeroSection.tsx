import Image from "next/image";
import Header from "../layouts/Header";
import Link from "next/link";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="bg-[#404eed] min-h-[626px] w-full box-border flex md:items-center overflow-hidden flex-col">
      <Header />

      <div className="flex items-center justify-center md:w-[720px] box-border gap-x-5 py-14 px-6 z-50">
        <div className="flex flex-col">
          <div className="text-white flex flex-col items-center justify-between w-full">
            <h1 className=" text-[1.5rem] md:text-[3rem] font-extrabold leading-[95%] uppercase">
              Imagine a place...
            </h1>
            <p className="mt-6 text-[1.5rem] leading-[1.625] flex md:items-center md:justify-center">
              ...where you can belong to a school club, a gaming group, or a
              worldwide art community. Where just you and a handful of friends
              can spend time together. A place that makes it easy to talk every
              day and hang out more often.
            </p>
          </div>

          <div className="flex items-center justify-center flex-col md:mt-10 md:flex-row">
            <Link
              href={"/"}
              className="mr-6 mt-6 rounded-[28px] text-xl py-4 px-6 bg-white text-[#23272a] leading-[24px] inline-flex font-normal items-center box-border"
            >
              <Image
                src="/hero.svg"
                alt="download icon"
                width={24}
                height={24}
                className="mr-2"
              />
              Download for Windows
            </Link>

            <Button className="mt-[24px] rounded-[28px] text-xl py-8 px-4 bg-[#23272a] text-white leading-[24px] inline-flex font-normal items-center box-border">
              Open Discord in your browser
            </Button>
          </div>
        </div>
      </div>

      <Image
        src="/bg-shoeguy-left.svg"
        width={375}
        height={191.58}
        alt="background"
        className="block -ml-20 md:hidden"
      />

      <Image
        src="/background.svg"
        width={2056}
        height={626}
        alt="background"
        className="absolute top-11 hidden md:block"
      />
    </section>
  );
};

export default HeroSection;
