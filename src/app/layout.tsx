import type { Metadata } from "next";
import { Inter, Alexandria } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Dars (درس) - Discover Islamic Lessons",
  description: "Dars (درس) helps you discover Islamic lessons and gatherings of knowledge in mosques around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${alexandria.variable} antialiased`}>
        <I18nProvider>
          <Navbar />
          {children}
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
