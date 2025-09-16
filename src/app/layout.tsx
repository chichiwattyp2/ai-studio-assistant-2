import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
// Fix: Import ReactNode to resolve the 'Cannot find namespace React' error.
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Unified Inbox",
  description: "Manage all customer conversations in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-gray-900 text-gray-100 antialiased`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
