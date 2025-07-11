import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClerkProviderWrapper from "@/providers/Clerk";
import TanstackProvider from "@/providers/QueryClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ETERNAL",
  description: "Timeless elegance meets modern design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackProvider>
      <ClerkProviderWrapper>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
          >
            <main className="">{children}</main>
          </body>
        </html>
      </ClerkProviderWrapper>
    </TanstackProvider>
  );
}
