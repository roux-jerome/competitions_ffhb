import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {SpeedInsights} from "@vercel/speed-insights/next"

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Recherche sur ffhb",
    description: "Recherche ton équipe sur le site de la Fédération Française de handball ",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <SpeedInsights/>
        <body className={inter.className}>{children}</body>
        </html>
    );
}
