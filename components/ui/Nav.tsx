'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Nav() {
  const [mounted,  setMounted]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Audit',     href: '/'          },
    { label: 'Portfolio', href: '/portfolio'  },
    { label: 'Services',  href: '/services'  },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 text-base font-semibold hover:opacity-80 transition-opacity">
          <span className="text-[var(--text)]">Ngige</span>
          <span className="text-[var(--brand)]">Audit</span>
          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-[var(--brand-bg)] text-[var(--brand)] font-mono">v6</span>
        </Link>

        {/* Links + actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map(({ label, href }) => (
            <Link key={href} href={href}
              className={`hidden sm:inline-flex px-3 py-1.5 text-sm rounded-lg transition-colors ${
                pathname === href
                  ? 'text-[var(--brand)] bg-[var(--brand-bg)]'
                  : 'text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]'
              }`}>
              {label}
            </Link>
          ))}

          {/* Theme toggle */}
          {mounted && (
            <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
              aria-label="Toggle theme">
              {resolvedTheme === 'dark'
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              }
            </button>
          )}

          <a href="https://calendly.com/patrick-ngige/growth-audit" target="_blank" rel="noopener noreferrer"
            className="btn-brand text-xs px-3 py-1.5 hidden sm:inline-flex">
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}
