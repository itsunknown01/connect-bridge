import Image from "next/image";
import Header from "../layouts/Header";

const HeroSection = () => {
  return (
    <section className="bg-[#404eed] relative min-h-[38.5rem] overflow-hidden pb-0 w-full flex items-center flex-col">
      <Header />
      <Image
        src="/background.svg"
        width={2560}
        height={626}
        alt="background"
        className="absolute bottom-0"
      />
    </section>
  );
};

export default HeroSection;
