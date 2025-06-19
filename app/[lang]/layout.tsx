import type { Metadata } from "next";
import Providers from "../providers";
import { i18n, type Locale } from "../../i18n-config";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talent Connect",
  description: "Talent Connect",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
