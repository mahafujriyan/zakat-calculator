import type { Metadata } from "next";
import { Hind_Siliguri, Space_Grotesk } from "next/font/google";
import "./globals.css";

const banglaFont = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
});

const accentFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "যাকাত ক্যালকুলেটর (Bangladesh)",
  description: "বাংলাদেশের জন্য লাইভ প্রাইসসহ আধুনিক যাকাত ক্যালকুলেটর",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${banglaFont.variable} ${accentFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
