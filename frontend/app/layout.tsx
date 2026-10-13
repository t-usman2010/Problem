import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./leaflet-overrides.css";

import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/ui/Navbar";
import OfflineBanner from "@/components/ui/OfflineBanner";
import { LocaleProvider } from "@/context/LocaleContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Civic Issue Reporter",
  description: "Report and track civic issues pinned on a real-time interactive map",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoUrdu.variable} h-full dark antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0f1117] text-[#f0f0f0] font-sans">
        <LocaleProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <OfflineBanner />
                <Navbar />
                <main className="flex-1">{children}</main>
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
