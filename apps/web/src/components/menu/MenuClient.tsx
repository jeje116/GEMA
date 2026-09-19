'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { menuAssets } from '@/content/media/menuAssets';
import { MenuCategory, MenuItem } from '@/content/types';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface MenuClientProps {
  locale: Locale;
  categories: MenuCategory[];
  items: MenuItem[];
}


export default function MenuClient({ locale, categories, items }: MenuClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const contentRef = useRef<HTMLDivElement>(null);
  const topSelectorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const [activeType, setActiveType] = useState<'food' | 'beverage'>('food');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);

  const currentCategories = categories
    .filter((c) => c.menuType === activeType)
    .sort((a, b) => a.order - b.order);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    currentCategories[0]?.id || ''
  );

  useEffect(() => {
    setMounted(true);
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Update active category when type switches
  useEffect(() => {
    if (currentCategories.length > 0) {
      setActiveCategoryId(currentCategories[0].id);
    }
  }, [activeType]);

  // Track category in view during scroll & update sticky bar visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!topSelectorRef.current) {
        setShowStickyBar(window.scrollY > 400);
        return;
      }
      const rect = topSelectorRef.current.getBoundingClientRect();
      // When bottom of top selector has reached or scrolled past the mobile header bottom
      setShowStickyBar(rect.bottom <= headerHeight + 5);

      // Active category tracking on scroll
      const isMobile = window.innerWidth < 1024;
      const navTotalHeight = isMobile ? headerHeight + 48 : 140;
      for (const cat of currentCategories) {
        const el = document.getElementById(cat.id);
        if (el) {
          const elRect = el.getBoundingClientRect();
          if (elRect.top <= navTotalHeight + 60 && elRect.bottom > navTotalHeight) {
            setActiveCategoryId(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight, currentCategories]);

  // Lock body scroll and listen for Escape key when bottom sheet is open
  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsBottomSheetOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isBottomSheetOpen]);

  const currentCategoryIds = new Set(currentCategories.map((c) => c.id));
  const currentItems = items.filter((i) => currentCategoryIds.has(i.categoryId));

  const handleSwitchType = (type: 'food' | 'beverage') => {
    if (type === activeType) return;
    setActiveType(type);
  };

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const el = document.getElementById(id);
    if (el) {
      const isMobile = window.innerWidth < 1024;
      // On mobile: header (80px) + sticky bar (48px) = 128px + 24px clearance = 152px
      const navOffset = isMobile ? headerHeight + 48 + 24 : 140;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    }
  };

  const handleSelectSectionFromSheet = (id: string) => {
    setIsBottomSheetOpen(false);
    scrollToCategory(id);
  };

  const activeCategory =
    currentCategories.find((c) => c.id === activeCategoryId) || currentCategories[0];
  const activeCategoryName = activeCategory ? l(activeCategory.name) : '';

  return (
    <PageReveal title={t('menu.title')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-[var(--muted)] max-w-md">
              {t('menu.philosophy')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {activeType === 'food' && (
              <div className="flex items-center gap-2 text-xs font-condensed tracking-widest uppercase text-[var(--muted)]">
                <span className="block w-2 h-2 rounded-full bg-[var(--terracotta)]" />
                {t('menu.signature')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Image — Baseline full-width slot with parallax (GEMA-017A restored) */}
      <div className="w-full h-[300px] md:h-[500px] overflow-hidden relative mb-16" ref={heroRef}>
        <motion.div style={{ y: prefersReduced ? 0 : yImage }} className="w-full h-[130%] -top-[15%] relative">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeType}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <ResponsiveImage
                src={menuAssets[activeType].src}
                alt={menuAssets[activeType].alt[locale]}
                imgClassName={menuAssets[activeType].objectPosition}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20 relative"
      >
        {/* Sticky Jump Links & Switcher (Desktop & Mobile) */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Desktop Sidebar */}
          <div className="sticky top-28 hidden lg:flex flex-col">
            {/* Desktop Food / Beverage Switcher — 1fr | divider | 1fr balanced across column */}
            <div className="mb-8 w-full">
              <MenuSwitcher
                activeType={activeType}
                onSwitch={handleSwitchType}
                foodLabel={t('menu.type.food')}
                beverageLabel={t('menu.type.beverage')}
              />
            </div>

            {/* Desktop Category Navigation — Baseline typography with uppercase presentation */}
            <nav
              aria-label="Menu categories"
              className="flex flex-col gap-3.5 border-l border-[var(--ivory-200)] pl-6"
            >
              <p className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-2">
                {t('menu.sections')}
              </p>
              {currentCategories.map((cat) => {
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => scrollToCategory(cat.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'text-left font-serif text-lg uppercase transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                      isActive
                        ? 'text-[var(--terracotta)] font-medium'
                        : 'text-[var(--espresso-900)] hover:text-[var(--terracotta)]'
                    )}
                  >
                    {l(cat.name)}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Top Selector (Non-sticky, visible at top portion only) */}
          <div ref={topSelectorRef} className="lg:hidden mb-10 pt-2">
            <div className="max-w-[280px] w-full mx-auto">
              <MenuSwitcher
                activeType={activeType}
                onSwitch={handleSwitchType}
                foodLabel={t('menu.type.food')}
                beverageLabel={t('menu.type.beverage')}
                underlineActive={true}
              />
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1">
          {currentCategories.map((cat, catIndex) => {
            const catItems = currentItems.filter((item) => item.categoryId === cat.id);
            let lastSubhead: string | null = null;

            return (
              <motion.div
                key={cat.id}
                id={cat.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                className={cn('mb-24 scroll-mt-36', catIndex === currentCategories.length - 1 ? 'mb-0' : '')}
              >
                {/* Category Heading & Straight Hairline Divider */}
                <div className="border-b border-[var(--espresso-900)]/20 pb-4 mb-8">
                  <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] uppercase tracking-tight">
                    {l(cat.name)}
                  </h2>
                  {cat.sectionNote && (
                    <p className="font-serif italic text-sm text-[var(--muted)] mt-2 leading-relaxed">
                      {l(cat.sectionNote)}
                    </p>
                  )}
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8">
                  {catItems.map((item) => {
                    const itemSubhead = item.subhead ? l(item.subhead) : null;
                    const showSubhead = itemSubhead && itemSubhead !== lastSubhead;
                    if (showSubhead) {
                      lastSubhead = itemSubhead;
                    }

                    return (
                      <React.Fragment key={item.id}>
                        {/* Subsection Heading (CARNE, SIDES ADD, SAUCES) */}
                        {showSubhead && (
                          <div className="col-span-full pt-8 pb-3 mt-4 border-b border-[var(--espresso-900)]/10">
                            <div className="pl-3 border-l-2 border-[var(--terracotta)]">
                              <h3 className="font-condensed uppercase tracking-widest text-xs sm:text-sm font-semibold text-[var(--espresso-900)]">
                                {itemSubhead}
                              </h3>
                              {item.subheadNote && (
                                <p className="font-serif italic text-xs text-[var(--muted)] mt-1">
                                  {l(item.subheadNote)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Chef's Cut: Editorial Moment */}
                        {item.isIntroBlock ? (
                          <div className="col-span-full py-4 my-2 border-b border-[var(--espresso-900)]/15 pb-6">
                            <h3 className="font-serif text-2xl md:text-3xl text-[var(--espresso-900)] tracking-tight">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="font-serif italic text-sm text-[var(--muted)] mt-1.5 max-w-xl leading-relaxed">
                                {l(item.description)}
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Standard Editorial Menu Item Row */
                          <MenuItemRow item={item} localeFn={l} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Menu Footnote */}
          <div className="mt-24 pt-12 pb-8 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-[1px] bg-[var(--espresso-900)]/20 mb-4" aria-hidden="true" />
            <p className="font-serif italic text-xs text-[var(--muted)] max-w-md leading-relaxed">
              {t('menu.taxService')}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Compact Sticky Section Bar (Portaled to document.body, fixed directly below header) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showStickyBar && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              style={{ top: `${headerHeight}px` }}
              className="lg:hidden fixed left-0 right-0 z-[35] bg-[var(--ivory-50)]/95 backdrop-blur-md border-b border-[var(--ivory-200)] shadow-xs h-12 flex items-center"
            >
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsBottomSheetOpen(true)}
                  className="w-full flex items-center justify-between py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus min-h-[44px]"
                  aria-haspopup="dialog"
                  aria-expanded={isBottomSheetOpen}
                  aria-label="Open menu sections"
                >
                  <span className="font-serif text-sm sm:text-base uppercase tracking-wider text-[var(--espresso-900)] font-medium truncate">
                    {activeCategoryName}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-condensed uppercase tracking-widest text-[var(--espresso-900)]/70 flex-shrink-0 ml-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[var(--espresso-900)]/60"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Mobile Bottom Sheet for Section Navigation (Portaled to document.body) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isBottomSheetOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex items-end">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsBottomSheetOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
                aria-hidden="true"
              />

              {/* Bottom Sheet Modal */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={t('menu.sections')}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full bg-[var(--ivory-50)] rounded-t-2xl border-t border-[var(--ivory-200)] shadow-2xl max-h-[85vh] flex flex-col pt-3 pb-6 z-10"
              >
                {/* Pull handle */}
                <div className="flex items-center justify-center py-2.5">
                  <div className="w-10 h-1 bg-[var(--espresso-900)]/20 rounded-full" aria-hidden="true" />
                </div>

                {/* Selector inside sheet */}
                <div className="mb-5 max-w-[280px] w-full mx-auto px-4">
                  <MenuSwitcher
                    activeType={activeType}
                    onSwitch={(type) => {
                      if (type === activeType) return;
                      setActiveType(type);
                    }}
                    foodLabel={t('menu.type.food')}
                    beverageLabel={t('menu.type.beverage')}
                    underlineActive={true}
                  />
                </div>

                {/* Sections Heading */}
                <p className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-2 px-6">
                  {t('menu.sections')}
                </p>

                {/* Category List */}
                <div className="flex flex-col gap-1 px-4 overflow-y-auto max-h-[50vh] pb-4">
                  {currentCategories.map((cat) => {
                    const isActive = activeCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectSectionFromSheet(cat.id)}
                        className={cn(
                          'w-full text-left py-3 px-3.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer min-h-[44px]',
                          isActive
                            ? 'bg-[var(--terracotta)]/10 text-[var(--terracotta)] font-medium'
                            : 'text-[var(--espresso-900)] hover:bg-[var(--espresso-900)]/5 font-normal'
                        )}
                      >
                        <span className="font-serif text-base uppercase tracking-wide">
                          {l(cat.name)}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </PageReveal>
  );
}

/* ==========================================================================
   SUBCOMPONENTS
   ========================================================================== */

/**
 * Food / Beverage Switcher
 * Quiet luxury pure-typography presentation with central vertical hairline separator.
 * Sits directly on page canvas with generous invisible interactive hit areas.
 */
function MenuSwitcher({
  activeType,
  onSwitch,
  foodLabel,
  beverageLabel,
  underlineActive = false,
}: {
  activeType: 'food' | 'beverage';
  onSwitch: (type: 'food' | 'beverage') => void;
  foodLabel: string;
  beverageLabel: string;
  underlineActive?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Menu type selector"
      className="w-full grid grid-cols-[1fr_auto_1fr] items-center"
    >
      {/* Food Button (Left 1fr zone, centered) */}
      <button
        type="button"
        onClick={() => onSwitch('food')}
        aria-pressed={activeType === 'food'}
        className={cn(
          'w-full min-h-[44px] py-2.5 px-2 flex flex-col items-center justify-center font-condensed tracking-widest uppercase text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus relative',
          activeType === 'food'
            ? 'font-semibold text-[var(--espresso-900)]'
            : 'font-normal text-[var(--espresso-900)]/60 hover:text-[var(--espresso-900)]'
        )}
      >
        <span>{foodLabel}</span>
        {underlineActive && activeType === 'food' && (
          <span
            className="w-8 h-[1.5px] bg-[var(--terracotta)] mt-1 rounded-full"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Static Central Hairline Separator (Mathematical True Center) */}
      <span
        className="w-[1px] h-6 sm:h-7 bg-[var(--espresso-900)]/25 flex-shrink-0 mx-auto"
        aria-hidden="true"
      />

      {/* Beverage Button (Right 1fr zone, centered) */}
      <button
        type="button"
        onClick={() => onSwitch('beverage')}
        aria-pressed={activeType === 'beverage'}
        className={cn(
          'w-full min-h-[44px] py-2.5 px-2 flex flex-col items-center justify-center font-condensed tracking-widest uppercase text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus relative',
          activeType === 'beverage'
            ? 'font-semibold text-[var(--espresso-900)]'
            : 'font-normal text-[var(--espresso-900)]/60 hover:text-[var(--espresso-900)]'
        )}
      >
        <span>{beverageLabel}</span>
        {underlineActive && activeType === 'beverage' && (
          <span
            className="w-8 h-[1.5px] bg-[var(--terracotta)] mt-1 rounded-full"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}

/**
 * Menu Item Row
 * Completely flat presentation (no cards, no background boxes, no shadows).
 * Editorial serif title, sans/condensed price, dotted leader, muted description.
 * Multiple variants supported with subtle left structural hairline.
 */
function MenuItemRow({
  item,
  localeFn,
}: {
  item: MenuItem;
  localeFn: (val: any) => string;
}) {
  const hasVariants = Boolean(item.priceVariants && item.priceVariants.length > 0);

  return (
    <div className="group relative py-1">
      {/* Single price / title row */}
      <div className="flex items-baseline justify-between gap-2">
        {/* Left: Indicator + Title + Optional Portion */}
        <div className="flex items-baseline gap-2 min-w-0">
          {/* Terracotta hover indicator (1.5px dot) */}
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] opacity-0 group-hover:opacity-100 -ml-2.5 transition-opacity duration-200 flex-shrink-0"
            aria-hidden="true"
          />

          <h3 className="font-serif text-lg md:text-xl text-[var(--espresso-900)] tracking-tight transition-transform duration-200 group-hover:translate-x-[2px] flex items-baseline gap-2 flex-wrap">
            <span>{item.name}</span>
            {/* Single portion next to title */}
            {item.portion && !hasVariants && (
              <span className="font-serif italic text-xs text-[var(--muted)] font-normal">
                ({item.portion})
              </span>
            )}
            {item.signature && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] flex-shrink-0 self-center"
                title="Signature Dish"
              />
            )}
          </h3>
        </div>

        {/* Dotted / micro-rule leader (for single price) */}
        {!hasVariants && (
          <>
            <span
              className="flex-1 mx-2 sm:mx-3 border-b border-dotted border-[var(--espresso-900)]/20 group-hover:border-[var(--espresso-900)]/40 transition-colors duration-200 mb-1 min-w-[16px]"
              aria-hidden="true"
            />
            <div className="font-condensed text-sm tracking-wider text-[var(--espresso-900)] flex-shrink-0 font-medium">
              {item.priceLabel}
            </div>
          </>
        )}
      </div>

      {/* Description underneath */}
      {item.description && (
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mt-1 group-hover:text-[var(--espresso-900)]/80 transition-colors duration-200 max-w-prose">
          {localeFn(item.description)}
        </p>
      )}

      {/* Multi-price variants (e.g. Steaks & Gelato) */}
      {hasVariants && (
        <div className="pl-3 border-l border-[var(--espresso-900)]/20 space-y-1.5 mt-2.5 pt-0.5">
          {item.priceVariants!.map((v, i) => (
            <div key={i} className="flex items-baseline justify-between text-xs sm:text-sm">
              <span className="font-serif italic text-[var(--espresso-900)]/85">
                {v.label ? `${v.label}${v.portion ? ` (${v.portion})` : ''}` : v.portion}
              </span>
              <span
                className="flex-1 mx-2 sm:mx-3 border-b border-dotted border-[var(--espresso-900)]/20 group-hover:border-[var(--espresso-900)]/40 transition-colors duration-200 mb-1 min-w-[12px]"
                aria-hidden="true"
              />
              <span className="font-condensed tracking-wider text-[var(--espresso-900)] font-medium">
                {v.priceLabel}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Additional Notes (e.g. Options: Coca Cola / Sprite) */}
      {item.additionalNotes && item.additionalNotes.length > 0 && (
        <div className="mt-1.5 text-xs font-condensed text-[var(--muted)] space-y-0.5">
          {item.additionalNotes.map((note, i) => (
            <p key={i} className="tracking-wide">
              {note.startsWith('Options:') ? note : `• ${note}`}
            </p>
          ))}
        </div>
      )}

      {/* Dietary Notes (if present) */}
      {item.dietaryNotes && item.dietaryNotes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1.5">
          {item.dietaryNotes.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-condensed uppercase tracking-widest bg-[var(--ivory-200)] px-2 py-0.5 text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
