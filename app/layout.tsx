import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import Nav from '@/components/ui/Nav';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title:       'Ngige Growth Audit — Free Full-Funnel Growth Intelligence',
  description: 'Consultant-grade growth audits across 13 dimensions: social, app store, paid media, reputation, conversion, and more. By Patrick Ngige, Technical Growth Marketer.',
  keywords:    ['growth audit', 'marketing audit', 'SEO audit', 'conversion optimisation', 'Patrick Ngige', 'African fintech', 'MEA growth'],
  authors:     [{ name: 'Patrick Ngige', url: 'https://growth-portfolio.vercel.app' }],
  openGraph: {
    title:       'Ngige Growth Audit — Free Full-Funnel Growth Intelligence',
    description: '13-dimension growth audit. Social, app store, paid media, conversion, and more. Free.',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Nav />
          <main>{children}</main>
          <footer className="border-t border-[var(--border)] py-8 mt-16">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--text-3)]">
              <div className="flex items-center gap-1.5">
                <span>Ngige Growth Audit</span>
                <span className="text-[var(--brand)] font-medium">v6</span>
                <span>· by</span>
                <a href="https://growth-portfolio.vercel.app" target="_blank" rel="noopener noreferrer"
                  className="text-[var(--brand)] hover:opacity-80 transition-opacity font-medium">
                  Patrick Ngige
                </a>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://growth-portfolio.vercel.app" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors">Portfolio</a>
                <a href="https://calendly.com/patrick-ngige/growth-audit" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors">Book a call</a>
                <a href="https://linkedin.com/in/patrick-ngige" target="_blank" rel="noopener noreferrer"
                  className="hover:text-[var(--text)] transition-colors">LinkedIn</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
