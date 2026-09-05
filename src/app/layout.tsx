import type { Metadata } from "next";
import { Bebas_Neue, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "@/theme/Providers";
import { SiteShell } from "@/components/layout/SiteShell";
import { BUSINESS } from "@/lib/constants";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BUSINESS.name} | ${BUSINESS.tagline}`,
  description: `Authentic Jamaican catering in ${BUSINESS.location}. Call ${BUSINESS.phone} to schedule trays, combos, and catering.`,
  openGraph: {
    title: `${BUSINESS.name} | ${BUSINESS.tagline}`,
    description: `Call ${BUSINESS.phone} for Jamaican catering in ${BUSINESS.location}.`,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
