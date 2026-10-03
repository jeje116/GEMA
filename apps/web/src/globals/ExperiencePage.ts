import type { GlobalConfig } from 'payload';

export const ExperiencePage: GlobalConfig = {
  slug: 'experience-page',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/experience`;
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
        const { shouldSkipPublicRevalidation, revalidateExperience } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateExperience();
        }
      },
    ],
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: '01 — Hero',
      fields: [
        {
          name: 'kicker',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'headline',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      label: '02 — Introduction / Quote',
      localized: true,
      required: true,
    },
    {
      name: 'dayToNight',
      type: 'group',
      label: '03 — Day to Night',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'morningHeading',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'morningDescription',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'transitionQuote',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'eveningHeading',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'eveningDescription',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'materials',
      type: 'group',
      label: '04 — Materials',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'body1',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'body2',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
  ],
};
