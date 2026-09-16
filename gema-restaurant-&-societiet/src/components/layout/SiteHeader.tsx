import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useUI } from '../shared/UIContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { siteData } from '../../data/site';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { openReservation, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUI();

  // Determine if this route has a photographic hero at the top
  const hasHero = pathname === '/' || pathname === '/experience' || pathname.startsWith('/events/') || pathname.startsWith('/journal/');
  const isTransparent = hasHero && !scrolled && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  const navLinks = [
    { to: '/menu', label: t('nav.menu') },
    { to: '/experience', label: t('nav.experience') },
    { to: '/events', label: t('nav.events') },
    { to: '/about', label: t('nav.about') },
    { to: '/visit', label: t('nav.visit') }
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isTransparent 
            ? "bg-transparent text-white" 
            : "bg-[var(--ivory-50)]/95 backdrop-blur-sm text-[var(--espresso-900)] border-b border-[var(--ivory-200)]/50 py-2 shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="relative z-50 flex-shrink-0 flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm">
            <span className={cn(
              "font-serif text-2xl tracking-wide transition-colors duration-300",
              isTransparent ? "text-white" : "text-[var(--espresso-900)] group-hover:text-[var(--terracotta-dark)]"
            )}>
              GEMA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "font-condensed uppercase tracking-widest text-xs relative overflow-hidden group outline-none rounded-sm",
                  "focus-visible:ring-2 focus-visible:ring-focus"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-[1px] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out",
                  isTransparent ? "bg-white" : "bg-[var(--terracotta)]"
                )} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className={cn(
                "font-condensed uppercase tracking-widest text-xs hover:opacity-70 transition-opacity outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-focus",
              )}
            >
              {language === 'en' ? 'EN / id' : 'en / ID'}
            </button>
            <button
              onClick={openReservation}
              className={cn(
                "font-condensed uppercase tracking-widest text-xs px-6 py-2.5 border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus rounded-sm",
                isTransparent 
                  ? "border-white hover:bg-white hover:text-black" 
                  : "border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white"
              )}
            >
              {t('nav.reserve')}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
            className="lg:hidden relative z-50 p-2 -mr-2 outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={cn("w-6 h-6", isTransparent ? "text-[var(--espresso-900)]" : "")} /> // If open, it will be over the ivory menu bg
            ) : (
              <Menu className="w-6 h-6" />
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
            transition={{ duration: 0.3, ease: "easeOut" }}
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
                    to={link.to}
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
                <button onClick={toggleLanguage} className={language === 'en' ? 'text-[var(--ink)] font-bold' : ''}>EN</button>
                <span className="w-px h-4 bg-[var(--ivory-200)]"></span>
                <button onClick={toggleLanguage} className={language === 'id' ? 'text-[var(--ink)] font-bold' : ''}>ID</button>
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
