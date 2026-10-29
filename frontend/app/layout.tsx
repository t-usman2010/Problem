import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./leaflet-overrides.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/ui/Navbar";
import OfflineBanner from "@/components/ui/OfflineBanner";
import { LocaleProvider } from "@/context/LocaleContext";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const notoUrdu = Noto_Nastaliq_Urdu({ variable: "--font-urdu", subsets: ["arabic"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "CivicReport — Smart City Platform",
  description: "Report and track civic issues pinned on a real-time interactive map",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080d" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${notoUrdu.variable} h-full antialiased`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var stored = localStorage.getItem('civic_theme');
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = stored === 'dark' || (!stored && systemDark) || (stored === 'system' && systemDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased transition-colors duration-200">
        <a href="#main-content" className="layout-skip-link">Skip to content</a>
        <div className="mesh-gradient" aria-hidden="true" />

        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <SocketProvider>
                <ToastProvider>
                  <OfflineBanner />
                  <Navbar />
                  <main id="main-content" className="relative flex-1 z-10">
                    {children}
                  </main>
                </ToastProvider>
              </SocketProvider>
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
