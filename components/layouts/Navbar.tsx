import { navLinks } from "@/lib/constants"
import Link from "next/link"

const Navbar = () => {
  return (
    <div className="flex-[1_1_auto] text-center text-base leading-[140%] font-medium w-[933px] hidden md:block">
      {navLinks.map((item, index) => (
        <Link href={"/"} key={index} className="text-white m-2.5 p-2.5">
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Navbar
