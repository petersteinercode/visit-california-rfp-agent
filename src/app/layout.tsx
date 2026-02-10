import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const aeonikFono = localFont({
  src: './fonts/AeonikFono-Medium.otf',
  variable: '--font-aeonik-fono',
  weight: '500',
});

const beausite = localFont({
  src: './fonts/BeausiteClassicRegular.ttf',
  variable: '--font-beausite',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Visit California RFP Agent',
  description: "Deep-dive into Stagwell's proposal for Visit California.",
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Visit California RFP Agent',
    description: "Deep-dive into Stagwell's proposal for Visit California.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aeonikFono.variable} ${beausite.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
