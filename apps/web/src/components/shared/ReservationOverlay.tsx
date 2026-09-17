'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useUI } from './UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { siteData } from '@/content/fixtures/site';
import { cn } from '@/lib/utils';

export default function ReservationOverlay({ locale }: { locale: Locale }) {
  const { isReservationOpen, closeReservation } = useUI();
  const { t } = getDictionary(locale);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    party: '',
    name: '',
    contact: '',
    occasion: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Required';
    if (!formData.time) newErrors.time = 'Required';
    if (!formData.party) newErrors.party = 'Required';
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.contact) newErrors.contact = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Build locale-aware WhatsApp reservation message from current form values.
   * CRITICAL: This must run BEFORE form reset / overlay close.
   */
  const buildWhatsAppMessage = (): string => {
    const optionalFields: string[] = [];
    if (formData.occasion) {
      optionalFields.push(
        locale === 'id'
          ? `Acara: ${formData.occasion}`
          : `Occasion: ${formData.occasion}`
      );
    }
    if (formData.notes) {
      optionalFields.push(
        locale === 'id'
          ? `Catatan: ${formData.notes}`
          : `Notes: ${formData.notes}`
      );
    }
    const optionalBlock = optionalFields.length > 0 ? '\n' + optionalFields.join('\n') : '';

    if (locale === 'id') {
      return `Halo GEMA, saya ingin melakukan reservasi.\nNama: ${formData.name}\nTanggal: ${formData.date}\nWaktu: ${formData.time}\nJumlah tamu: ${formData.party}\nKontak: ${formData.contact}${optionalBlock}\nTerima kasih.`;
    }
    return `Hello GEMA, I'd like to make a reservation.\nName: ${formData.name}\nDate: ${formData.date}\nTime: ${formData.time}\nParty Size: ${formData.party}\nContact: ${formData.contact}${optionalBlock}\nThank you.`;
  };

  const generatePreview = () => {
    return buildWhatsAppMessage();
  };

  /**
   * Handle form submission:
   * 1. Validate fields
   * 2. Build locale-aware message (form values still alive)
   * 3. Encode message + construct WhatsApp URL
   * 4. Attempt WhatsApp navigation (popup-block fallback)
   * 5. Close overlay + reset form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Build message BEFORE any state mutation
    const message = buildWhatsAppMessage();
    const whatsAppUrl = `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Attempt popup; fallback to same-window navigation if blocked
    const popup = window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = whatsAppUrl;
    }

    // Close overlay and reset form AFTER WhatsApp navigation attempt
    closeReservation();
    setTimeout(() => {
      setFormData({ date: '', time: '', party: '', name: '', contact: '', occasion: '', notes: '' });
      setErrors({});
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleClose = () => {
    closeReservation();
    setTimeout(() => {
      setFormData({ date: '', time: '', party: '', name: '', contact: '', occasion: '', notes: '' });
      setErrors({});
    }, 300);
  };

  return (
    <AnimatePresence>
      {isReservationOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-pointer"
            onClick={handleClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-[var(--ivory-50)] shadow-2xl z-50 flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-[var(--ivory-200)]">
              <h2 id="reservation-title" className="font-serif text-2xl text-[var(--espresso-900)]">
                {t('reservation.title')}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-[var(--ivory-100)] rounded-full transition-colors cursor-pointer"
                aria-label="Close reservation modal"
              >
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.date')} *</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={cn("px-3 py-2 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus", errors.date ? "border-red-500" : "border-[var(--ivory-200)]")}
                      aria-invalid={!!errors.date}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.time')} *</label>
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={cn("px-3 py-2 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus", errors.time ? "border-red-500" : "border-[var(--ivory-200)]")}
                    >
                      <option value="">Select</option>
                      <option value="11:30">11:30</option>
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="13:00">13:00</option>
                      <option value="18:00">18:00</option>
                      <option value="18:30">18:30</option>
                      <option value="19:00">19:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.party')} *</label>
                  <select 
                    name="party"
                    value={formData.party}
                    onChange={handleChange}
                    className={cn("px-3 py-2 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus", errors.party ? "border-red-500" : "border-[var(--ivory-200)]")}
                  >
                    <option value="">Select</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6+">6+ People (Requires Confirmation)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.name')} *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn("px-3 py-2 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus", errors.name ? "border-red-500" : "border-[var(--ivory-200)]")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.contact')} *</label>
                  <input 
                    type="text" 
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className={cn("px-3 py-2 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus", errors.contact ? "border-red-500" : "border-[var(--ivory-200)]")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.occasion')}</label>
                  <input 
                    type="text" 
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="px-3 py-2 border border-[var(--ivory-200)] rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--espresso-800)]">{t('reservation.form.notes')}</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="px-3 py-2 border border-[var(--ivory-200)] rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus resize-none"
                  />
                </div>
                
                <div className="mt-4 p-4 bg-[var(--ivory-100)] text-xs text-[var(--muted)] whitespace-pre-wrap font-mono">
                  <span className="block mb-2 font-bold uppercase tracking-wide">Message Preview</span>
                  {generatePreview()}
                </div>

                <button 
                  type="submit"
                  className="mt-4 bg-[var(--ink)] text-[var(--white)] py-4 font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors cursor-pointer"
                >
                  {t('reservation.form.submit')}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
