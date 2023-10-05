import { aboutData } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import AboutCard from "../cards/AboutCard";
import Footer from "../layouts/Footer";

const AboutSection = () => {
  return (
    <section className="w-full flex items-center flex-col">
      {aboutData.map((item, index) => (
        <AboutCard
          key={index}
          title={item.title}
          content={item.content}
          imageUrl={item.image}
          backgroundStyle={index % 2 === 0 ? "" : "bg-[#f6f6f6]"}
          rowStyle={index % 2 === 0 ? "" : "flex-row-reverse"}
        />
      ))}

      <div className={`w-full flex items-center flex-col bg-[#f6f6f6]`}>
        <div className={`box-border py-10 px-14`}>
          <div className="flex flex-col items-center justify-between w-full">
            <h2 className=" text-[1.2rem] md:text-[3rem] font-extrabold leading-[120%] uppercase">
              Reliable tech for staying close
            </h2>
            <p className="mt-[24px] text-[clamp(16px,2vw,20px)] leading-[1.625]">
              Low-latency voice and video feels like you’re in the same room.
              Wave hello over video, watch friends stream their games, or gather
              up and have a drawing session with screen share.
            </p>
          </div>
          <Image
            src="/bottomBanner.svg"
            alt="about"
            width={1180}
            height={716}
            className="flex justify-center items-center mx-auto my-auto object-cover"
          />
        </div>
      </div>

      <div className="w-full bg-[#f6f6f6] flex items-center flex-col">
        <div className="mb-24 flex justify-center flex-col items-center flex-wrap relative box-border gap-y-5 px-5">
          <div className="flex justify-center absolute top-0 w-full overflow-hidden">
            <Image
              src="/sparkles.svg"
              alt="sparkles"
              width={531}
              height={49}
              className="object-cover flex justify-center items-center"
            />
          </div>
          <h4 className="mt-[30px] z-[1] font-bold text-[1.5rem] leading-[120%]">
            Ready to start your journey?
          </h4>
          <Link
            href={"/"}
            className="mr-6 mt-6 rounded-[28px] text-xl py-4 px-4 bg-[#5865f2] text-white leading-[24px] inline-flex font-normal items-center box-border"
          >
            <Image src="/hero.svg" alt="download icon" width={24} height={24} className="mr-4" />
            Download for Windows
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
