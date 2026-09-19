'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useUI } from './UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { siteData } from '@/content/fixtures/site';
import { cn } from '@/lib/utils';
import {
  ReservationAreaId,
  getJakartaDateString,
  getAvailableReservationSlots,
  formatTimeSlotDisplay,
  formatDateDisplay,
  isSmokingPermittedAtTime,
} from '@/lib/reservationConfig';
import ReservationDatePicker from './ReservationDatePicker';
import ReservationTimePicker from './ReservationTimePicker';
import ReservationSelect from './ReservationSelect';

interface ReservationFormData {
  date: string;
  area: ReservationAreaId | '';
  time: string;
  party: string;
  name: string;
  contact: string;
  occasion: string;
  notes: string;
}

const initialFormData: ReservationFormData = {
  date: '',
  area: '',
  time: '',
  party: '',
  name: '',
  contact: '',
  occasion: '',
  notes: '',
};

export default function ReservationOverlay({ locale }: { locale: Locale }) {
  const { isReservationOpen, closeReservation } = useUI();
  const { t } = getDictionary(locale);

  const [formData, setFormData] = useState<ReservationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const todayDateStr = useMemo(() => getJakartaDateString(), []);

  // Compute available slots based on selected date & area
  const availableSlots = useMemo(() => {
    if (!formData.date || !formData.area) return [];
    return getAvailableReservationSlots({
      date: formData.date,
      area: formData.area,
    });
  }, [formData.date, formData.area]);

  // Determine time field state & helper message
  const isTimeDisabled = !formData.date || !formData.area || availableSlots.length === 0;

  let timeHelperText = '';
  if (!formData.date || !formData.area) {
    timeHelperText = t('reservation.form.selectDateAreaFirst');
  } else if (availableSlots.length === 0) {
    timeHelperText = t('reservation.form.noSlots');
  }

  // Handle Date change with automatic time revalidation
  const handleDateChange = (newDate: string) => {
    setFormData((prev) => {
      let newTime = prev.time;
      if (prev.area && newTime) {
        const slots = getAvailableReservationSlots({
          date: newDate,
          area: prev.area,
        });
        if (!slots.includes(newTime)) {
          newTime = '';
        }
      }
      return { ...prev, date: newDate, time: newTime };
    });
    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
  };

  // Handle Area change with automatic time revalidation
  const handleAreaChange = (newArea: ReservationAreaId) => {
    setFormData((prev) => {
      let newTime = prev.time;
      if (prev.date && newTime) {
        const slots = getAvailableReservationSlots({
          date: prev.date,
          area: newArea,
        });
        if (!slots.includes(newTime)) {
          newTime = '';
        }
      }
      return { ...prev, area: newArea, time: newTime };
    });
    if (errors.area) setErrors((prev) => ({ ...prev, area: '' }));
  };

  const handleTimeChange = (newTime: string) => {
    setFormData((prev) => ({ ...prev, time: newTime }));
    if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
  };

  const handlePartyChange = (newParty: string) => {
    setFormData((prev) => ({ ...prev, party: newParty }));
    if (errors.party) setErrors((prev) => ({ ...prev, party: '' }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const todayStr = getJakartaDateString();

    if (!formData.date) {
      newErrors.date = locale === 'id' ? 'Tanggal wajib diisi' : 'Date is required';
    } else if (formData.date < todayStr) {
      newErrors.date =
        locale === 'id' ? 'Tanggal masa lalu tidak diperbolehkan' : 'Past dates are not allowed';
    }

    if (!formData.area) {
      newErrors.area = locale === 'id' ? 'Area wajib dipilih' : 'Area is required';
    }

    if (!formData.time) {
      newErrors.time = locale === 'id' ? 'Waktu wajib dipilih' : 'Time is required';
    } else if (formData.date && formData.area) {
      const validSlots = getAvailableReservationSlots({
        date: formData.date,
        area: formData.area,
      });
      if (!validSlots.includes(formData.time)) {
        newErrors.time =
          locale === 'id' ? 'Waktu yang dipilih tidak tersedia' : 'Selected time is not available';
      }
    }

    if (!formData.party) {
      newErrors.party = locale === 'id' ? 'Jumlah tamu wajib dipilih' : 'Party size is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = locale === 'id' ? 'Nama lengkap wajib diisi' : 'Name is required';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = locale === 'id' ? 'Kontak wajib diisi' : 'Contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Build locale-aware WhatsApp reservation request message.
   * Uses clean display time (e.g. 1:15 PM) and clearly states as request.
   */
  const buildWhatsAppMessage = (): string => {
    const optionalFields: string[] = [];
    if (formData.occasion) {
      optionalFields.push(
        locale === 'id' ? `Acara: ${formData.occasion}` : `Occasion: ${formData.occasion}`
      );
    }
    if (formData.notes) {
      optionalFields.push(
        locale === 'id' ? `Catatan: ${formData.notes}` : `Notes: ${formData.notes}`
      );
    }
    const optionalBlock = optionalFields.length > 0 ? '\n' + optionalFields.join('\n') : '';

    const areaDisplay =
      formData.area === 'indoorGarden'
        ? t('reservation.area.indoorGarden')
        : formData.area === 'indoor'
        ? t('reservation.area.indoor')
        : '-';

    const formattedDate = formData.date ? formatDateDisplay(formData.date, locale) : '-';
    const formattedTime = formData.time ? formatTimeSlotDisplay(formData.time) : '-';

    if (locale === 'id') {
      return `Halo GEMA, saya ingin meminta reservasi meja.\nNama: ${formData.name}\nTanggal: ${formattedDate}\nArea: ${areaDisplay}\nWaktu: ${formattedTime}\nJumlah tamu: ${formData.party}\nKontak: ${formData.contact}${optionalBlock}\nMohon konfirmasi ketersediaan meja. Terima kasih.`;
    }
    return `Hello GEMA, I would like to request a reservation.\nName: ${formData.name}\nDate: ${formattedDate}\nArea: ${areaDisplay}\nTime: ${formattedTime}\nParty Size: ${formData.party}\nContact: ${formData.contact}${optionalBlock}\nPlease confirm availability. Thank you.`;
  };

  const generatePreview = () => {
    return buildWhatsAppMessage();
  };

  /**
   * Handle form submission:
   * 1. Validate full combination
   * 2. Build message with Area & formatted Time
   * 3. Open WhatsApp in new tab synchronously
   * 4. Close overlay & reset form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = buildWhatsAppMessage();
    const whatsAppUrl = `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open new tab synchronously inside user gesture
    const whatsappWindow = window.open('', '_blank');
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.location.href = whatsAppUrl;
      closeReservation();
    } else {
      window.location.assign(whatsAppUrl);
    }

    setTimeout(() => {
      setFormData(initialFormData);
      setErrors({});
    }, 300);
  };

  const handleClose = () => {
    closeReservation();
    setTimeout(() => {
      setFormData(initialFormData);
      setErrors({});
    }, 300);
  };

  const partyOptions = [
    { value: '1', label: locale === 'id' ? '1 Orang' : '1 Person' },
    { value: '2', label: locale === 'id' ? '2 Orang' : '2 People' },
    { value: '3', label: locale === 'id' ? '3 Orang' : '3 People' },
    { value: '4', label: locale === 'id' ? '4 Orang' : '4 People' },
    { value: '5', label: locale === 'id' ? '5 Orang' : '5 People' },
    {
      value: '6+',
      label:
        locale === 'id'
          ? '6+ Orang (Perlu Konfirmasi)'
          : '6+ People (Requires Confirmation)',
    },
  ];

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
            {/* Header */}
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

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* 1. DATE (Custom GEMA Date Picker) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="res-date" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.date')} *
                  </label>
                  <ReservationDatePicker
                    id="res-date"
                    value={formData.date}
                    onChange={handleDateChange}
                    minDate={todayDateStr}
                    locale={locale}
                    placeholder={t('reservation.date.placeholder')}
                    hasError={!!errors.date}
                  />
                  {errors.date && (
                    <span id="date-error" className="text-xs text-red-500">
                      {errors.date}
                    </span>
                  )}
                </div>

                {/* 2. AREA (LOCKED order: DATE -> AREA -> TIME) */}
                <div className="flex flex-col gap-1.5">
                  <label id="area-label" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.area')} *
                  </label>
                  <div
                    role="radiogroup"
                    aria-labelledby="area-label"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {/* Indoor Option */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.area === 'indoor'}
                      onClick={() => handleAreaChange('indoor')}
                      className={cn(
                        'flex items-center gap-3 p-3 text-left transition-all duration-200 cursor-pointer border rounded-none min-h-[48px]',
                        formData.area === 'indoor'
                          ? 'border-[var(--terracotta)] bg-[#FAF6F0] shadow-xs'
                          : 'border-[var(--ivory-200)] bg-transparent hover:border-[var(--espresso-900)]/30'
                      )}
                    >
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors',
                          formData.area === 'indoor'
                            ? 'border-[var(--terracotta)] bg-transparent'
                            : 'border-[var(--ivory-300)]'
                        )}
                      >
                        {formData.area === 'indoor' && (
                          <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'text-sm font-sans leading-tight',
                            formData.area === 'indoor'
                              ? 'text-[var(--espresso-900)] font-medium'
                              : 'text-[var(--espresso-800)]'
                          )}
                        >
                          {t('reservation.area.indoor')}
                        </span>
                      </div>
                    </button>

                    {/* Indoor Garden Option */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={formData.area === 'indoorGarden'}
                      onClick={() => handleAreaChange('indoorGarden')}
                      className={cn(
                        'flex items-start gap-3 p-3 text-left transition-all duration-200 cursor-pointer border rounded-none min-h-[48px]',
                        formData.area === 'indoorGarden'
                          ? 'border-[var(--terracotta)] bg-[#FAF6F0] shadow-xs'
                          : 'border-[var(--ivory-200)] bg-transparent hover:border-[var(--espresso-900)]/30'
                      )}
                    >
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5',
                          formData.area === 'indoorGarden'
                            ? 'border-[var(--terracotta)] bg-transparent'
                            : 'border-[var(--ivory-300)]'
                        )}
                      >
                        {formData.area === 'indoorGarden' && (
                          <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'text-sm font-sans leading-tight',
                            formData.area === 'indoorGarden'
                              ? 'text-[var(--espresso-900)] font-medium'
                              : 'text-[var(--espresso-800)]'
                          )}
                        >
                          {t('reservation.area.indoorGarden')}
                        </span>
                        <span className="text-[11px] font-sans text-[var(--muted)] mt-0.5">
                          {t('reservation.area.indoorGardenHelper')}
                        </span>
                      </div>
                    </button>
                  </div>
                  {errors.area && <span className="text-xs text-red-500">{errors.area}</span>}
                </div>

                {/* 3. TIME (Custom GEMA Time Picker) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="res-time" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.time')} *
                  </label>
                  <ReservationTimePicker
                    id="res-time"
                    value={formData.time}
                    onChange={handleTimeChange}
                    slots={availableSlots}
                    disabled={isTimeDisabled}
                    disabledMessage={timeHelperText}
                    placeholder={locale === 'id' ? 'Pilih waktu' : 'Select a time'}
                    hasError={!!errors.time}
                    locale={locale}
                  />

                  {/* Informational helper copy if disabled */}
                  {timeHelperText && (
                    <p id="time-helper" className="text-xs text-[var(--muted)]">
                      {timeHelperText}
                    </p>
                  )}

                  {/* Indoor Garden Smoking Notice (only at/after 9 PM) */}
                  {formData.area === 'indoorGarden' &&
                    formData.time &&
                    isSmokingPermittedAtTime('indoorGarden', formData.time) && (
                      <p className="text-xs italic font-sans text-[var(--terracotta)] transition-colors">
                        {t('reservation.smoking.after')}
                      </p>
                    )}

                  {errors.time && <span className="text-xs text-red-500">{errors.time}</span>}
                </div>

                {/* 4. PARTY SIZE (Custom GEMA Select) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="res-party" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.party')} *
                  </label>
                  <ReservationSelect
                    id="res-party"
                    value={formData.party}
                    onChange={handlePartyChange}
                    options={partyOptions}
                    placeholder={locale === 'id' ? 'Pilih jumlah orang' : 'Select party size'}
                    hasError={!!errors.party}
                  />
                  {errors.party && <span className="text-xs text-red-500">{errors.party}</span>}
                </div>

                {/* 5. NAME / CONTACT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="res-name" className="text-sm font-medium text-[var(--espresso-800)]">
                      {t('reservation.form.name')} *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        'px-3 py-2.5 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus text-sm text-[var(--espresso-900)]',
                        errors.name ? 'border-red-500' : 'border-[var(--ivory-200)]'
                      )}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="res-contact" className="text-sm font-medium text-[var(--espresso-800)]">
                      {t('reservation.form.contact')} *
                    </label>
                    <input
                      id="res-contact"
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className={cn(
                        'px-3 py-2.5 border rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus text-sm text-[var(--espresso-900)]',
                        errors.contact ? 'border-red-500' : 'border-[var(--ivory-200)]'
                      )}
                      aria-invalid={!!errors.contact}
                    />
                    {errors.contact && <span className="text-xs text-red-500">{errors.contact}</span>}
                  </div>
                </div>

                {/* 6. OCCASION */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="res-occasion" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.occasion')}
                  </label>
                  <input
                    id="res-occasion"
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="px-3 py-2.5 border border-[var(--ivory-200)] rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus text-sm font-sans text-[var(--espresso-900)] placeholder:text-[var(--muted)]"
                  />
                </div>

                {/* 7. NOTES */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="res-notes" className="text-sm font-medium text-[var(--espresso-800)]">
                    {t('reservation.form.notes')}
                  </label>
                  <textarea
                    id="res-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="px-3 py-2.5 border border-[var(--ivory-200)] rounded-none bg-transparent focus:outline-none focus:ring-1 focus:ring-focus resize-none text-sm text-[var(--espresso-900)]"
                  />
                </div>

                {/* MESSAGE PREVIEW */}
                <div className="mt-2 p-4 bg-[var(--ivory-100)] text-xs text-[var(--muted)] whitespace-pre-wrap font-mono border border-[var(--ivory-200)]/60">
                  <span className="block mb-2 font-bold uppercase tracking-wide">Message Preview</span>
                  {generatePreview()}
                </div>

                {/* 8. CONTINUE TO WHATSAPP */}
                <button
                  type="submit"
                  className="mt-2 bg-[var(--ink)] text-[var(--white)] py-4 font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors cursor-pointer"
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
