import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';
import { siteData } from '../../data/site';

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--ink)] text-[var(--ivory-100)] pt-16 md:pt-24 pb-8 md:pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16 md:mb-24">
          
          {/* Brand & Address */}
          <div className="md:col-span-2">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">{siteData.name}</h2>
            <address className="not-italic text-[var(--muted)] max-w-xs flex flex-col gap-2 text-sm leading-relaxed">
              <p>{siteData.fullAddress}</p>
              <p className="mt-4 text-white"><a href={`tel:${siteData.phone.replace(/[^0-9]/g, '')}`} className="hover:text-[var(--terracotta)] transition-colors">{siteData.phone}</a></p>
              <p><a href={siteData.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--terracotta)] transition-colors">Instagram</a></p>
            </address>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-6">{t('nav.menu')}</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/menu" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.menu')}</Link></li>
              <li><Link to="/experience" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.experience')}</Link></li>
              <li><Link to="/occasions" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.occasions')}</Link></li>
              <li><Link to="/events" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/about" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Connect & Editorial */}
          <div>
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-6">{t('footer.contact')}</h3>
            <ul className="flex flex-col gap-3 text-sm mb-8">
              <li><button className="hover:text-[var(--terracotta)] transition-colors text-left">{t('footer.reserve')}</button></li>
              <li><Link to="/visit" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.visit')}</Link></li>
            </ul>
            
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-6">Explore</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/journal" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.journal')}</Link></li>
              <li><Link to="/recognition" className="hover:text-[var(--terracotta)] transition-colors">{t('nav.recognition')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-[var(--muted)]">
          <p>&copy; {new Date().getFullYear()} {siteData.name}.</p>
          <p>{t('footer.demo.note')}</p>
        </div>
      </div>
    </footer>
  );
}
