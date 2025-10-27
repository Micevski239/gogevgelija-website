import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GoGevgelija - Discover Gevgelija',
  description: 'Explore attractions, events, promotions, and local stories in Gevgelija, North Macedonia',
  keywords: ['Gevgelija', 'tourism', 'events', 'attractions', 'Macedonia', 'travel'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen`}>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
