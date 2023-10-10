import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/components/providers/modal-providers";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "Created by Ayushman Gohain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="discord-theme"
          >
          <ModalProvider />
          {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
