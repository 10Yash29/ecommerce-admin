import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import React from "react";
import {ModalProvider} from "@/providers/modal-provider";
import {ToastProvider} from "@/providers/toast-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider afterSignOutUrl='/sign-in'>
        <html lang="en">
        <body className={inter.className}>
            <ToastProvider/>
            <ModalProvider/>
            {children}
        </body>
        </html>
      </ClerkProvider>
  );
}
