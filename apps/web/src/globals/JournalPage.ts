import type { GlobalConfig } from 'payload';

export const JournalPage: GlobalConfig = {
  slug: 'journal-page',
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
        const { revalidateJournal } = await import('@/lib/revalidation');
        await revalidateJournal();
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
          defaultValue: 'Journal',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          localized: true,
          defaultValue: 'Stories from the kitchen, the farm, and the dining room.',
        },
      ],
    },
  ],
};
