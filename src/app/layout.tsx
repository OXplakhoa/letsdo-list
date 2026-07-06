import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's Do List — Neubrutalism Todo App",
  description:
    "A bold, feature-rich todo list application built with Next.js, Prisma, and PostgreSQL. Featuring Neubrutalism design, soft deletes, and optimistic updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              border: '3px solid #000',
              borderRadius: '0px',
              boxShadow: '4px 4px 0px #000',
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
