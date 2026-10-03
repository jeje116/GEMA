import type { GlobalConfig } from 'payload';

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/about`;
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
        const { shouldSkipPublicRevalidation, revalidateAbout } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateAbout();
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
          name: 'headline',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'origin',
      type: 'group',
      label: '02 — The Origin',
      fields: [
        {
          name: 'title',
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
    {
      name: 'philosophy',
      type: 'group',
      label: '03 — The Philosophy',
      fields: [
        {
          name: 'title',
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
          name: 'dietaryPrefix',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'dietarySuffix',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'architecture',
      type: 'group',
      label: '04 — The Architecture',
      fields: [
        {
          name: 'title',
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
