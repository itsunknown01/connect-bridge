import { z } from "zod";
import axios from "./api";
import { RegisterSchema } from "@/src/schemas";

export const registerUser = (data: z.infer<typeof RegisterSchema>) =>
  axios
    .post("/register", data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
