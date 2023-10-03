import Image from "next/image";
import Header from "../layouts/Header";

const HeroSection = () => {
  return (
    <section className="bg-[#404eed] min-h-[626px] w-full box-border flex items-center overflow-hidden flex-col">
      <Header />
    </section>
  );
};

export default HeroSection;
