import { Locale } from './config';

type TranslationDictionary = {
  [key: string]: string;
};

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    'nav.menu': 'Menu',
    'nav.experience': 'Experience',
    'nav.events': 'Events',
    'nav.occasions': 'Occasions',
    'nav.about': 'About',
    'nav.visit': 'Visit',
    'nav.reserve': 'Reserve a Table',
    'nav.journal': 'Journal',
    'nav.recognition': 'Recognition',
    
    'home.hero.kicker': 'GEMA RESTAURANT & SOCIETIET',
    'home.hero.headline': 'The Gateway to Taste',
    'home.hero.support': 'Italian classics, served with a touch of art.',
    'home.hero.location': 'Surabaya, Indonesia',
    'home.hero.cta.primary': 'Reserve a Table',
    'home.hero.cta.secondary': 'Explore the Menu',
    
    'home.positioning.text': 'A deep respect for ingredients, elevated by modern Italian technique. Every dish at GEMA is a balance of comfort and artistry, crafted for the table.',
    'home.positioning.dietary': 'No Pork, No Lard',
    
    'home.signature.title': 'Signature Dishes',
    'home.space.title': 'The Space',
    'home.space.text': 'Where warm ivory meets lush greenery. A room designed for conversation, connection, and culinary discovery.',
    'home.space.cta': 'Discover the Experience',
    
    'home.chef.text': 'More than 20 years cooking across the world. One new vision in Surabaya.',
    'home.chef.cta': 'Meet Chef Mandif',
    
    'home.recognition.title': 'Recognition',
    'home.recognition.cta': 'View Archive',
    
    'home.events.now': 'Happening Now',
    'home.events.upcoming': 'Upcoming at GEMA',
    'home.events.cta': 'View All Events',
    
    'home.reviews.title': 'Selected guest words',
    'home.reviews.note': 'Concept content',
    
    'home.journal.title': 'Latest from GEMA',
    
    'footer.reserve': 'Reserve',
    'footer.contact': 'Contact',
    'footer.social': 'Social',
    'footer.demo.note': 'Concept MVP - placeholder content requires verification before production',
    
    'gateway.enter.pointer': 'Click anywhere to enter',
    'gateway.enter.touch': 'Tap anywhere to enter',
    
    'menu.title': 'The Menu',
    'menu.philosophy': 'Honest ingredients, prepared with precision and a touch of art.',
    'menu.featured': 'Featured',
    'menu.signature': 'Signature',
    'menu.type.food': 'Food',
    'menu.type.beverage': 'Beverage',
    'menu.sections': 'Sections',
    'menu.taxService': 'All prices are subject to 10% government tax and 10% service charges.',
    
    'events.title': 'Discover what\'s happening around the table.',
    'events.now': 'Now',
    'events.upcoming': 'Upcoming',
    'events.past': 'Past Stories',
    
    'reservation.title': 'Reserve a Table',
    'reservation.form.date': 'Preferred Date',
    'reservation.form.area': 'Dining Area',
    'reservation.form.time': 'Preferred Time',
    'reservation.form.party': 'Party Size',
    'reservation.form.name': 'Full Name',
    'reservation.form.contact': 'WhatsApp or Email',
    'reservation.form.occasion': 'Occasion (Optional)',
    'reservation.form.notes': 'Special Notes or Dietary Requirements',
    'reservation.form.selectDateAreaFirst': 'Select a date and area first',
    'reservation.form.noSlots': 'No reservation times are available for this date and area. Please choose another date or area.',
    'reservation.area.indoor': 'Indoor',
    'reservation.area.indoorGarden': 'Indoor Garden',
    'reservation.area.indoorGardenHelper': 'Smoking area available from 9 PM',
    'reservation.smoking.before': 'Indoor Garden is non-smoking at this time.',
    'reservation.smoking.after': 'Smoking is permitted from 9 PM.',
    'reservation.form.submit': 'Send via WhatsApp',
    'reservation.date.placeholder': '18 September 2026',
    'reservation.date.errorInvalid': 'Enter a valid reservation date.',
    'reservation.date.errorPast': 'Past dates are not available.',
    'reservation.time.searchPlaceholder': 'Search time',
    'reservation.time.noMatch': 'No matching reservation time.',
    
    'audio.on': 'Sound on',
    'audio.off': 'Sound off',
    
    '404.title': 'Page Not Found',
    '404.text': 'The page you are looking for does not exist or has been moved.',
    '404.back': 'Return Home',
    
    'general.loading': 'Loading...',
    'general.details.tbc': 'Details to be confirmed'
  },
  id: {
    'nav.menu': 'Menu',
    'nav.experience': 'Pengalaman',
    'nav.events': 'Acara',
    'nav.occasions': 'Acara Khusus',
    'nav.about': 'Tentang',
    'nav.visit': 'Kunjungi',
    'nav.reserve': 'Pesan Meja',
    'nav.journal': 'Jurnal',
    'nav.recognition': 'Pengakuan',
    
    'home.hero.kicker': 'GEMA RESTAURANT & SOCIETIET',
    'home.hero.headline': 'Gerbang Menuju Rasa',
    'home.hero.support': 'Klasik Italia, disajikan dengan sentuhan seni.',
    'home.hero.location': 'Surabaya, Indonesia',
    'home.hero.cta.primary': 'Pesan Meja',
    'home.hero.cta.secondary': 'Jelajahi Menu',
    
    'home.positioning.text': 'Rasa hormat yang mendalam terhadap bahan-bahan, ditingkatkan dengan teknik Italia modern. Setiap hidangan di GEMA adalah keseimbangan antara kenyamanan dan seni, dibuat untuk dinikmati bersama.',
    'home.positioning.dietary': 'Tanpa Babi, Tanpa Lemak Babi',
    
    'home.signature.title': 'Hidangan Khas',
    'home.space.title': 'Ruang',
    'home.space.text': 'Di mana warna gading yang hangat bertemu dengan tanaman hijau subur. Ruang yang dirancang untuk percakapan, koneksi, dan penemuan kuliner.',
    'home.space.cta': 'Temukan Pengalaman',
    
    'home.chef.text': 'Lebih dari 20 tahun memasak di seluruh dunia. Satu visi baru di Surabaya.',
    'home.chef.cta': 'Kenali Chef Mandif',
    
    'home.recognition.title': 'Pengakuan',
    'home.recognition.cta': 'Lihat Arsip',
    
    'home.events.now': 'Sedang Berlangsung',
    'home.events.upcoming': 'Akan Datang di GEMA',
    'home.events.cta': 'Lihat Semua Acara',
    
    'home.reviews.title': 'Kata-kata tamu pilihan',
    'home.reviews.note': 'Konten konsep',
    
    'home.journal.title': 'Terbaru dari GEMA',
    
    'footer.reserve': 'Reservasi',
    'footer.contact': 'Kontak',
    'footer.social': 'Sosial',
    'footer.demo.note': 'Konsep MVP - konten placeholder memerlukan verifikasi sebelum produksi',
    
    'gateway.enter.pointer': 'Klik di mana saja untuk masuk',
    'gateway.enter.touch': 'Ketuk di mana saja untuk masuk',
    
    'menu.title': 'Menu',
    'menu.philosophy': 'Bahan-bahan jujur, disiapkan dengan presisi dan sentuhan seni.',
    'menu.featured': 'Pilihan',
    'menu.signature': 'Khas',
    'menu.type.food': 'Makanan',
    'menu.type.beverage': 'Minuman',
    'menu.sections': 'Bagian',
    'menu.taxService': 'Semua harga dikenakan pajak pemerintah 10% dan biaya layanan 10%.',
    
    'events.title': 'Temukan apa yang terjadi di sekitar meja.',
    'events.now': 'Sekarang',
    'events.upcoming': 'Akan Datang',
    'events.past': 'Cerita Lalu',
    
    'reservation.title': 'Pesan Meja',
    'reservation.form.date': 'Tanggal Pilihan',
    'reservation.form.area': 'Area Bersantap',
    'reservation.form.time': 'Waktu Pilihan',
    'reservation.form.party': 'Jumlah Orang',
    'reservation.form.name': 'Nama Lengkap',
    'reservation.form.contact': 'WhatsApp atau Email',
    'reservation.form.occasion': 'Acara (Opsional)',
    'reservation.form.notes': 'Catatan Khusus atau Kebutuhan Diet',
    'reservation.form.selectDateAreaFirst': 'Pilih tanggal dan area terlebih dahulu',
    'reservation.form.noSlots': 'Tidak ada waktu reservasi yang tersedia untuk tanggal dan area ini. Silakan pilih tanggal atau area lain.',
    'reservation.area.indoor': 'Indoor',
    'reservation.area.indoorGarden': 'Indoor Garden',
    'reservation.area.indoorGardenHelper': 'Area smoking tersedia mulai pukul 9 malam',
    'reservation.smoking.before': 'Indoor Garden merupakan area non-smoking pada jam ini.',
    'reservation.smoking.after': 'Smoking diperbolehkan mulai pukul 9 malam.',
    'reservation.form.submit': 'Kirim via WhatsApp',
    'reservation.date.placeholder': '18 September 2026',
    'reservation.date.errorInvalid': 'Masukkan tanggal reservasi yang valid.',
    'reservation.date.errorPast': 'Tanggal yang sudah lewat tidak tersedia.',
    'reservation.time.searchPlaceholder': 'Cari jam',
    'reservation.time.noMatch': 'Tidak ada jam reservasi yang sesuai.',
    
    'audio.on': 'Suara nyala',
    'audio.off': 'Suara mati',
    
    '404.title': 'Halaman Tidak Ditemukan',
    '404.text': 'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
    '404.back': 'Kembali ke Beranda',
    
    'general.loading': 'Memuat...',
    'general.details.tbc': 'Detail akan dikonfirmasi'
  }
};
