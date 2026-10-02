import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/session";
import { PwaRegister } from "@/components/pwa-register";
import { AuthGuard } from "@/components/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equinox Sports - Premium Booking Platform",
  description:
    "Book paddle, football turf, and table tennis in Guwahati with live availability and transparent pricing.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0B] text-white">
        <Providers>
          <AuthGuard />
          <PwaRegister />
          <Nav user={user} />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
