'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/utils';
import { MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface ResDiaryWidgetProps {
  isOpen: boolean;
  locale: Locale;
  whatsappNumber?: string;
}

type WidgetStatus = 'idle' | 'loading' | 'loaded' | 'slow' | 'error';

export default function ResDiaryWidget({ isOpen, locale, whatsappNumber }: ResDiaryWidgetProps) {
  const { t } = getDictionary(locale);
  const [status, setStatus] = useState<WidgetStatus>('idle');
  const frameRef = useRef<HTMLDivElement>(null);
  const officialWidgetUrl = 'https://booking.resdiary.com/widget/Standard/GemaSurabaya/2025?includeJquery=false';

  useEffect(() => {
    const frame = frameRef.current || document.getElementById('rd-widget-frame');
    if (frame && frame.children.length > 0) {
      setStatus('loaded');
      return;
    }

    setStatus('loading');

    const checkLoaded = () => {
      const el = frameRef.current || document.getElementById('rd-widget-frame');
      if (el && el.children.length > 0) {
        setStatus('loaded');
        return true;
      }
      return false;
    };

    let observer: MutationObserver | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    if (frame) {
      observer = new MutationObserver(() => {
        if (checkLoaded()) {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      });
      observer.observe(frame, { childList: true, subtree: true });
    }

    pollInterval = setInterval(() => {
      if (checkLoaded()) {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }, 200);

    const slowTimer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'slow' : current));
    }, 8000);

    return () => {
      clearTimeout(slowTimer);
      if (pollInterval) clearInterval(pollInterval);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const waNumber = whatsappNumber || '6281252200049';
  const waMessage =
    locale === 'id'
      ? 'Halo GEMA, saya ingin melakukan reservasi meja. Mohon bantuan informasi ketersediaan. Terima kasih.'
      : 'Hello GEMA, I would like to reserve a table. Please assist with availability. Thank you.';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="w-full flex flex-col relative"
      inert={!isOpen ? true : undefined}
      aria-hidden={!isOpen}
    >
      {/* 1. Loading Skeleton / Spinner (while initial load is in progress) */}
      {status === 'loading' && (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--espresso-900)] border-t-transparent animate-spin mb-4" />
          <p className="font-serif text-lg text-[var(--espresso-900)] mb-1">
            {locale === 'id' ? 'Memuat Sistem Reservasi...' : 'Loading Reservation System...'}
          </p>
          <p className="text-xs font-sans text-[var(--muted)]">
            {locale === 'id' ? 'Menghubungkan ke layanan meja resmi GEMA' : 'Connecting to GEMA official table service'}
          </p>
        </div>
      )}

      {/* 2. Slow Loading Notice (offered after 8 seconds without destroying widget frame) */}
      {status === 'slow' && (
        <div className="mb-6 p-4 border border-[var(--terracotta)]/40 bg-[#FAF6F0] flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-[var(--terracotta)] animate-spin flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-serif text-sm text-[var(--espresso-900)] font-medium">
                {locale === 'id' ? 'Koneksi Memerlukan Waktu Lebih Lama' : 'Connection is taking longer than expected'}
              </span>
              <span className="text-xs text-[var(--muted)] mt-0.5">
                {locale === 'id'
                  ? 'Sistem reservasi sedang dimuat. Anda juga dapat langsung menghubungi kami via WhatsApp.'
                  : 'The booking widget is still loading. You can also contact our concierge directly via WhatsApp.'}
              </span>
            </div>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--ink)] text-white text-xs font-condensed tracking-widest uppercase hover:bg-[var(--espresso-800)] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {locale === 'id' ? 'Reservasi via WhatsApp' : 'Reserve via WhatsApp'}
          </a>
        </div>
      )}

      {/* 3. Hard Error Fallback (if script fails to load from CDN) */}
      {status === 'error' && (
        <div className="p-6 border border-red-200 bg-red-50/50 flex flex-col gap-4 text-center my-8">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <div>
            <h3 className="font-serif text-lg text-[var(--espresso-900)] mb-1">
              {locale === 'id' ? 'Layanan Reservasi Online Sedang Terkendala' : 'Online Booking Temporarily Unavailable'}
            </h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
              {locale === 'id'
                ? 'Kami mohon maaf atas ketidaknyamanan ini. Silakan langsung menghubungi tim reservasi kami melalui WhatsApp.'
                : 'We apologize for the inconvenience. Please contact our reservations desk directly via WhatsApp.'}
            </p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--ink)] text-white text-xs font-condensed tracking-widest uppercase hover:bg-[var(--espresso-800)] transition-colors mx-auto"
          >
            <MessageSquare className="w-4 h-4" />
            {locale === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
          </a>
        </div>
      )}

      {/* 4. Official ResDiary Embed Elements (Kept mounted once initialized) */}
      <div
        id="rd-widget-frame"
        ref={frameRef}
        className={cn(
          'w-full transition-opacity duration-300',
          status === 'loaded' || status === 'slow' ? 'opacity-100 min-h-[500px]' : 'opacity-0 h-0 overflow-hidden'
        )}
        style={{ maxWidth: '600px', margin: 'auto' }}
      />
      <input type="hidden" id="rdwidgeturl" value={officialWidgetUrl} />
    </div>
  );
}
