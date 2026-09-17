import { Review } from './types';

export const reviews: Review[] = [
  {
    id: 'rev-1',
    theme: 'service',
    text: {
      en: 'The service is attentive without being intrusive. They knew exactly when to approach the table.',
      id: 'Layanannya penuh perhatian tanpa mengganggu. Mereka tahu persis kapan harus mendekati meja.'
    },
    contentStatus: 'demo'
  },
  {
    id: 'rev-2',
    theme: 'gnocchi',
    text: {
      en: 'The Gnocchi al Tartufo was extraordinary—pillowy soft with a perfectly balanced truffle cream.',
      id: 'Gnocchi al Tartufo-nya luar biasa—lembut seperti bantal dengan krim truffle yang seimbang sempurna.'
    },
    contentStatus: 'demo'
  },
  {
    id: 'rev-3',
    theme: 'steak',
    text: {
      en: 'We ordered the Bistecca alla Fiorentina to share. Cooked to absolute perfection.',
      id: 'Kami memesan Bistecca alla Fiorentina untuk berbagi. Dimasak dengan kesempurnaan mutlak.'
    },
    contentStatus: 'demo'
  },
  {
    id: 'rev-4',
    theme: 'tiramisu',
    text: {
      en: 'Do not leave without trying the Classic Tiramisu. The finest I have had in Surabaya.',
      id: 'Jangan pergi tanpa mencoba Tiramisu Klasiknya. Yang terbaik yang pernah saya rasakan di Surabaya.'
    },
    contentStatus: 'demo'
  },
  {
    id: 'rev-5',
    theme: 'anniversary',
    text: {
      en: 'We celebrated our anniversary here. The atmosphere, the lighting, and the warm hospitality made it unforgettable.',
      id: 'Kami merayakan hari jadi kami di sini. Suasana, pencahayaan, dan keramahtamahan yang hangat membuatnya tak terlupakan.'
    },
    contentStatus: 'demo'
  }
];
