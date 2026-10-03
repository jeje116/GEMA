import type { GlobalConfig } from 'payload';

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
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
        const { revalidateEvents } = await import('@/lib/revalidation');
        await revalidateEvents();
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
          defaultValue: 'Events',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          localized: true,
          defaultValue: "Discover what's happening around the table.",
        },
      ],
    },
  ],
};
