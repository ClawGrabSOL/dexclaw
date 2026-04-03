import './globals.css';
import Navbar from '@/components/Navbar';
import Ticker from '@/components/Ticker';

export const metadata = {
  title: 'DexClaw — Token Registry & DEX Hub',
  description: 'List your token, add DEX links, socials and let anyone buy in one click.',
  icons: { icon: '/dexclaw-logo.png' },
};

export const viewport = { themeColor: '#000000' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Ticker />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
