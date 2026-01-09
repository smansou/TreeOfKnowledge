import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tree of Knowledge",
  description:
    "Personal knowledge organization system that automatically collects, summarizes, and categorizes content",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tree of Knowledge",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Tree of Knowledge",
    title: "Tree of Knowledge",
    description:
      "Personal knowledge organization system that automatically collects, summarizes, and categorizes content",
  },
  icons: {
    shortcut: "/favicon.ico",
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/AppImages/ios/16.png", sizes: "16x16", type: "image/png" },
      { url: "/AppImages/ios/32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/AppImages/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/AppImages/ios/57.png", sizes: "57x57", type: "image/png" },
      { url: "/AppImages/ios/60.png", sizes: "60x60", type: "image/png" },
      { url: "/AppImages/ios/72.png", sizes: "72x72", type: "image/png" },
      { url: "/AppImages/ios/76.png", sizes: "76x76", type: "image/png" },
      { url: "/AppImages/ios/114.png", sizes: "114x114", type: "image/png" },
      { url: "/AppImages/ios/120.png", sizes: "120x120", type: "image/png" },
      { url: "/AppImages/ios/144.png", sizes: "144x144", type: "image/png" },
      { url: "/AppImages/ios/152.png", sizes: "152x152", type: "image/png" },
      { url: "/AppImages/ios/167.png", sizes: "167x167", type: "image/png" },
      { url: "/AppImages/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/AppImages/ios/32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/AppImages/ios/16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/AppImages/ios/180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/AppImages/ios/152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/AppImages/ios/144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/AppImages/ios/120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/AppImages/ios/114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/AppImages/ios/76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/AppImages/ios/72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/AppImages/ios/60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/AppImages/ios/57.png"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tree of Knowledge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta
          name="msapplication-TileImage"
          content="/AppImages/android/android-launchericon-144-144.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
