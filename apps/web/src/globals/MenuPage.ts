import type { GlobalConfig } from 'payload';

export const MenuPage: GlobalConfig = {
  slug: 'menu-page',
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
        const { revalidateMenu } = await import('@/lib/revalidation');
        await revalidateMenu(false);
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: '01 — Page Header',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          localized: true,
          defaultValue: 'The Menu',
        },
        {
          name: 'philosophy',
          type: 'textarea',
          label: 'Philosophy',
          localized: true,
          defaultValue: 'Honest ingredients, prepared with precision and a touch of art.',
        },
      ],
    },
    {
      type: 'collapsible',
      label: '02 — Menu Content — Managed in Collections',
      admin: {
        description: 'Menu categories and items are edited under CONTENT → Menu Categories and Menu Items.',
        initCollapsed: true,
      },
      fields: [],
    },
    {
      name: 'taxServiceFootnote',
      type: 'textarea',
      label: '03 — Footer / Tax & Service Footnote',
      localized: true,
      defaultValue: 'All prices are subject to 10% government tax and 10% service charges.',
    },
  ],
};
