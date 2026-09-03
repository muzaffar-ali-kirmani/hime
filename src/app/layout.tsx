import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/locale-provider";
import { StoreProvider } from "@/lib/store-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hime — Just Made For You | Premium Personalised Jewellery",
  description:
    "Handcrafted personalised jewellery made for her story. Necklaces, bracelets, rings and earrings in 18K gold and 925 sterling silver. Ships across the Gulf.",
  keywords: [
    "personalised jewellery",
    "custom necklace",
    "engraved jewellery",
    "birthstone jewellery",
    "Gulf jewellery",
    "UAE jewellery",
    "Saudi Arabia jewellery",
    "Doha jewellery",
    "18K gold jewellery",
  ],
  openGraph: {
    title: "Hime — Just Made For You",
    description:
      "Premium personalised jewellery for the women who matter. Handcrafted in 18K gold and sterling silver.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}
      >
        <LocaleProvider>
          <StoreProvider>
            <TooltipProvider>
              <Toaster position="top-center" richColors />
              {children}
            </TooltipProvider>
          </StoreProvider>
        </LocaleProvider>
        {/* WARNING FOR AGENT: DO NOT REMOVE THIS SCRIPT */}
        <Script src="https://cdn.jsdelivr.net/gh/IdeavoAI/ideavo-scripts@latest/scripts/ideavo.min.js" />
      </body>
    </html>
  );
}