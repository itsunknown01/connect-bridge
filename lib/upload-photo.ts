import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
const url = "http://localhost:3000"

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();