import type { Metadata } from 'next';
import { Inter, Quicksand, Libre_Baskerville } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-display',
});

const serif = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Cozy Study Tracker',
  description: 'A warm and inviting study management app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${quicksand.variable} ${serif.variable}`}>
      <body suppressHydrationWarning className="bg-[#fdfbf7] text-[#4a3728] min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
