import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import ChatbotWidgetWrapper from "@/components/ChatbotWidgetWrapper";
import CookieConsent from "@/components/CookieConsent";
import PageTracker from "@/components/PageTracker";
import ScrollToTop from "@/components/ScrollToTop";
import { person } from "@/data/site";
import { getSiteUrl } from "@/lib/siteConfig";
import SessionProvider from "@/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: `${person.fullName}`,
    template: `%s • ${person.fullName}`
  },
  description: `${person.fullName} — ${person.primaryLocation}`,
  metadataBase: new URL(getSiteUrl()),
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-brown-950" suppressHydrationWarning>
        <SessionProvider>
          <div className="shell">
            <Header />
            <main id="main" className="shell-main">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
          <ChatbotWidgetWrapper />
          <CookieConsent />
          <PageTracker />
        </SessionProvider>
      </body>
    </html>
  );
}

