import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/session";
import { PwaRegister } from "@/components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equinox Sports - Premium Booking PWA",
  description:
    "Book paddle, football, table tennis and more with membership based access and admin analytics.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#d4af37",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <Providers>
          <PwaRegister />
          <Nav user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
