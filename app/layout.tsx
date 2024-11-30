import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { ClerkProvider } from '@clerk/nextjs';

import { cn } from '@/lib/utils';

import '../editor/styles/main.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apppify todo',
  description: 'Simple todo app',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const interRegular = localFont({
  src: './fonts/inter-Regular.woff2',
  variable: '--font-inter-regular',
  weight: '400',
});

const offBitDotBold = localFont({
  src: './fonts/OffBit-DotBold.woff2',
  variable: '--font-dots',
  weight: '900',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        `bg-white dark:bg-gray-950 text-black dark:text-white`,
        geistSans,
        geistMono,
        interRegular,
        offBitDotBold
      )}
    >
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
      </head> */}
      <body className="min-h-[100dvh] bg-gradient-to-br from-purple-50 to-blue-100">
        <ClerkProvider dynamic telemetry={false}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
