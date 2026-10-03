import type { GlobalConfig } from 'payload';

export const RecognitionPage: GlobalConfig = {
  slug: 'recognition-page',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/recognition`;
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { shouldSkipPublicRevalidation, revalidateRecognition } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateRecognition();
        }
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
          name: 'kicker',
          type: 'text',
          label: 'Kicker',
          localized: true,
          required: false,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          localized: true,
          defaultValue: 'Recognition',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          localized: true,
          required: true,
        },
      ],
    },
  ],
};
