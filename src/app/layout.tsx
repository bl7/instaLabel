import type { Metadata } from "next";
import { Manrope, Oxygen } from 'next/font/google';
import './globals.css';
import og from './opengraph-image.png';
import { Toaster } from "sonner";

const base_font = Manrope({ subsets: ['latin'] });
const accent_font = Oxygen({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-accent',
});

export const metadata: Metadata = {
  title: { default: 'instaLabel', template: '%s - instaLabel' },
  metadataBase: new URL('https://instalabeldemo.vercel.app/'),
  description: 'Efficient Kitchen Labeling for Food Safety and Inventory Management',
  icons: {
    icon: [
      {
        url: '/public/icon.svg',
        href: '/icon.svg',
      },
    ],
  },
  openGraph: {
    type: 'website',
    url: 'https://instalabeldemo.vercel.app/',
    title: 'instaLabel',
    description:
      'Efficient Kitchen Labeling for Food Safety and Inventory Management',
    siteName: 'instaLabel',
    images: [og.src],
  },
  twitter: {
    title: 'instaLabel',
    description:
      'Efficient Kitchen Labeling for Food Safety and Inventory Management',
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${base_font.className} ${accent_font.variable}`}>
          {children}
          <Toaster/>
      </body>
    </html>
  );
}
