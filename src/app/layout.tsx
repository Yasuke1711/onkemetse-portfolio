import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onkemetse Khavara | Independent Developer",
  description: "The personal portfolio of Onkemetse Khavara, an independent developer in Botswana working across websites, applications and software.",
  applicationName: "Onkemetse Khavara",
  openGraph: {
    title: "Onkemetse Khavara | Independent Developer",
    description: "Websites, applications and software by Onkemetse Khavara.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f5fa",
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
