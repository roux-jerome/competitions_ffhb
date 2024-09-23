import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Analytics} from '@vercel/analytics/react';
import Script from "next/script";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    other: {"userreport:mediaId": "adb3fa7a-514b-48bb-b0b6-bafd45bac495"}
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <Script src="https://sak.userreport.com/pers1/launcher.js" async id="userreport-launcher-script"></Script>
        <Analytics/>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    );
}
