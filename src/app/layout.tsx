import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pangia Schedule | Nomad Summit 2026",
  description: "Your guide to Nomad Summit 2026 in Chiang Mai. Main conference talks, Nomad Week side events, and real-time schedule updates.",
  keywords: ["Nomad Summit", "Chiang Mai", "Digital Nomad", "Conference", "2026"],
  authors: [{ name: "Pangia" }],
  openGraph: {
    title: "Pangia Schedule | Nomad Summit 2026",
    description: "Your guide to Nomad Summit 2026 in Chiang Mai",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pangia Schedule | Nomad Summit 2026",
    description: "Your guide to Nomad Summit 2026 in Chiang Mai",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pangia",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#042d4b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
