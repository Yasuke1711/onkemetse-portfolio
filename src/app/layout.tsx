import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onkemetse Khavara · Independent Developer",
  description: "Websites, applications and thoughtful digital experiences by Onkemetse Khavara, independent developer based in Botswana and working worldwide.",
  openGraph: {
    title: "Onkemetse Khavara · Independent Developer",
    description: "Design, development and software. Building useful digital experiences for businesses around the world.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
