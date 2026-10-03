import type { GlobalConfig, FieldAccess } from 'payload';

const isAdmin: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin';
};

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'SITE',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async () => {
        const { revalidateSiteSettings } = await import('@/lib/revalidation');
        await revalidateSiteSettings();
      },
    ],
  },
  fields: [
    {
      name: 'restaurantName',
      type: 'text',
      label: '01 — Identity: Restaurant Name',
      defaultValue: 'GEMA Restaurant & Societiet',
      required: true,
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: '02 — Contact: Phone',
      defaultValue: '+62 811-3000-888',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: '02 — Contact: WhatsApp Number',
      defaultValue: '6281252200049',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'email',
      type: 'text',
      label: '02 — Contact: Email',
      defaultValue: 'reservations@gemasurabaya.com',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: '03 — Social: Instagram URL',
      defaultValue: 'https://instagram.com/gema.surabaya',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'tiktokUrl',
      type: 'text',
      label: '03 — Social: TikTok URL',
      defaultValue: 'https://www.tiktok.com/@gemarestaurant',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'fullAddress',
      type: 'textarea',
      label: '04 — Location: Full Address',
      defaultValue: 'Jl. Musi No.32, Darmo, Kec. Wonokromo, Surabaya, Jawa Timur 60241',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'locationLabel',
      type: 'text',
      label: '04 — Location: Presentation Label (e.g. Surabaya, Indonesia)',
      localized: true,
      defaultValue: 'Surabaya, Indonesia',
      admin: {
        description: 'Presentation text for footer/location badges; does not replace fullAddress.',
      },
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: '04 — Location: Google Maps URL',
      defaultValue: 'https://maps.google.com/?q=Jl.+Musi+No.+32,+Darmo,+Kec.+Wonokromo,+Surabaya,+Jawa+Timur+60241,+Indonesia',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'dietaryPolicy',
      type: 'text',
      label: '05 — Dietary Policy',
      localized: true,
      defaultValue: 'No Pork, No Lard',
      access: {
        update: isAdmin,
      },
    },
    {
      name: 'services',
      type: 'select',
      label: '05 — Services',
      hasMany: true,
      options: [
        { label: 'Dine-In', value: 'dine-in' },
      ],
      defaultValue: ['dine-in'],
      access: {
        update: isAdmin,
      },
    },
  ],
};
