import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'DexClaw — Token Registry & DEX Hub',
  description: 'List your token, add DEX links, socials and let anyone buy in one click.',
};

export const viewport = { themeColor: '#3b82f6' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
