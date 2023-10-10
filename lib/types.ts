import { Member, Profile, Server } from "@prisma/client";
import { navLinks } from "./constants";

export type PageName =(typeof navLinks)[number]["name"]

export type Language ={
    code: string,
    name: string
  }

  export type ServerWithMemberWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
  };
  