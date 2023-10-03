import Image from "next/image";
import React from "react";

interface AboutCardProps {
  title: string;
  content: string;
  imageUrl: string;
  backgroundStyle: string;
  rowStyle: string;
}

const AboutCard = ({
  title,
  content,
  imageUrl,
  backgroundStyle,
  rowStyle,
}: AboutCardProps) => {
  return (
    <div
      className={`w-full flex flex-col md:flex-row items-center justify-center md:gap-20 box-border py-7 px-6 ${backgroundStyle} md:${rowStyle} md:py-14`}
    >
      <Image src={imageUrl} width={678} height={440} alt="about-image-1" />
      <div className="flex flex-col justify-center pt-4 text-[#23272a] md:w-[720px]">
        <h2 className=" text-[1.2rem] md:text-[3rem] font-extrabold leading-[120%]">
          {title}
        </h2>
        <p className="mt-6 text-[1rem] md:text-[2rem] leading-[1.625] flex md:items-center md:justify-center">
          {content}
        </p>
      </div>
    </div>
  );
};

export default AboutCard;
