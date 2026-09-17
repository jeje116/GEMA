'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { useUI } from '@/components/shared/UIContext';
import { siteData } from '@/content/fixtures/site';
import { cn } from '@/lib/utils';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = getDictionary(locale);
  const { openReservation, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUI();

  const isHome = pathname === `/${locale}` || pathname === '/' || pathname === `/${locale}/`;
  const isDetail = pathname.includes('/events/') || pathname.includes('/journal/');
  const hasHero = isHome || isDetail;
  const isTransparent = hasHero && !scrolled && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'en' || segments[0] === 'id') {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  const navLinks = [
    { to: `/${locale}/menu`, label: t('nav.menu') },
    { to: `/${locale}/experience`, label: t('nav.experience') },
    { to: `/${locale}/events`, label: t('nav.events') },
    { to: `/${locale}/occasions`, label: t('nav.occasions') },
    { to: `/${locale}/about`, label: t('nav.about') },
    { to: `/${locale}/visit`, label: t('nav.visit') }
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isTransparent 
            ? 'bg-transparent text-white' 
            : 'bg-[var(--ivory-50)]/95 backdrop-blur-sm text-[var(--espresso-900)] border-b border-[var(--ivory-200)]/50 py-2 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href={`/${locale}`}
            aria-label="GEMA Home"
            className="relative z-50 flex-shrink-0 flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm h-14 w-24 sm:w-28 overflow-visible"
          >
            <div className="relative w-[140px] sm:w-[165px] h-[140px] sm:h-[165px] flex items-center justify-center -ml-7 sm:-ml-8 pointer-events-none">
              <Image
                src="/media/brand/gema-logo-light.png"
                alt="GEMA"
                width={165}
                height={165}
                priority
                className={cn(
                  "w-full h-full object-contain transition-all duration-300 group-hover:opacity-80",
                  !isTransparent && "brightness-0 opacity-90"
                )}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={cn(
                  'font-condensed uppercase tracking-widest text-xs relative overflow-hidden group outline-none rounded-sm',
                  'focus-visible:ring-2 focus-visible:ring-focus'
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={cn(
                    'absolute bottom-0 left-0 w-full h-[1px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out',
                    isTransparent ? 'bg-white' : 'bg-[var(--terracotta)]'
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => switchLocale(locale === 'en' ? 'id' : 'en')}
              className="font-condensed uppercase tracking-widest text-xs hover:opacity-70 transition-opacity outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
            >
              {locale === 'en' ? 'EN / id' : 'en / ID'}
            </button>
            <button
              onClick={openReservation}
              className={cn(
                'font-condensed uppercase tracking-widest text-xs px-6 py-2.5 border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus rounded-sm cursor-pointer inline-block text-center',
                isTransparent 
                  ? 'border-white text-white hover:bg-white hover:text-black' 
                  : 'border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white'
              )}
            >
              {t('nav.reserve')}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
            className="lg:hidden relative z-50 p-2 -mr-2 outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--espresso-900)]" />
            ) : (
              <Menu className={cn("w-6 h-6", isTransparent ? "text-white" : "text-[var(--espresso-900)]")} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[var(--ivory-50)] flex flex-col pt-24 px-6 pb-6 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.to}
                    onClick={closeMobileMenu}
                    className="font-serif text-3xl text-[var(--espresso-900)] block w-full outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-8 pt-12">
              <div className="flex items-center gap-6 text-[var(--muted)] font-condensed tracking-widest text-sm uppercase">
                <button
                  onClick={() => { switchLocale('en'); closeMobileMenu(); }}
                  className={locale === 'en' ? 'text-[var(--ink)] font-bold' : 'cursor-pointer'}
                >
                  EN
                </button>
                <span className="w-px h-4 bg-[var(--ivory-200)]" />
                <button
                  onClick={() => { switchLocale('id'); closeMobileMenu(); }}
                  className={locale === 'id' ? 'text-[var(--ink)] font-bold' : 'cursor-pointer'}
                >
                  ID
                </button>
              </div>
              
              <div className="flex flex-col gap-2 font-condensed tracking-wide text-sm text-[var(--muted)]">
                <p>{siteData.fullAddress}</p>
                <p>{siteData.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
