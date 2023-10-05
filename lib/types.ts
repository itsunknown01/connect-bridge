import { navLinks } from "./constants";

export type PageName =(typeof navLinks)[number]["name"]

export type Language ={
    code: string,
    name: string
  }