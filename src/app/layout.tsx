import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = "https://onkemetse-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  authors: [{ name: "Onkemetse Khavara" }],
  creator: "Onkemetse Khavara",
  publisher: "Onkemetse Khavara",
  title: "Onkemetse Khavara | Independent Developer",
  description: "The personal portfolio of Onkemetse Khavara, an independent developer in Botswana working across websites, applications and software.",
  applicationName: "Onkemetse Khavara",
  openGraph: {
    title: "Onkemetse Khavara | Independent Developer",
    description: "Websites, applications and software by Onkemetse Khavara.",
    type: "website",
    url: siteUrl,
    images: [{ url: "/og-cover.svg", width: 1200, height: 630, alt: "Onkemetse Khavara, independent developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onkemetse Khavara | Independent Developer",
    description: "Websites, applications and software by Onkemetse Khavara.",
    images: ["/og-cover.svg"],
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Onkemetse Khavara",
              jobTitle: "Independent Developer",
              url: siteUrl,
              address: { "@type": "PostalAddress", addressLocality: "Francistown", addressCountry: "BW" },
              knowsAbout: ["Software development", "Web applications", "Artificial intelligence", "Computer science"]
            }).replace(/</g, "\\u003c")
          }}
        />
      </body>
    </html>
  );
}
