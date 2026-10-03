import type { GlobalConfig } from 'payload';

export const Navigation: GlobalConfig = {
  slug: 'navigation',
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
        const { revalidateNavigation } = await import('@/lib/revalidation');
        await revalidateNavigation();
      },
    ],
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      label: '01 — Header Navigation',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: '02 — Footer Navigation',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
};
