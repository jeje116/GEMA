import type { GlobalConfig } from 'payload';

export const OccasionsPage: GlobalConfig = {
  slug: 'occasions-page',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/occasions`;
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
        const { shouldSkipPublicRevalidation, revalidateOccasions } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateOccasions();
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
          name: 'title',
          type: 'text',
          label: 'Page Title',
          localized: true,
          required: true,
          defaultValue: 'Occasions',
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
    {
      name: 'privateDining',
      type: 'group',
      label: '02 — Private Dining',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'feature1',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature2',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature3',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'wedding',
      type: 'group',
      label: '03 — Wedding',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'feature1',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature2',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature3',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'birthday',
      type: 'group',
      label: '04 — Birthday',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'feature1',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature2',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'feature3',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'brandExclusives',
      type: 'group',
      label: '05 — Brand Exclusives (Overview)',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'brandEvents',
      type: 'group',
      label: '06 — Brand Exclusives (Events)',
      fields: [
        {
          name: 'mondial',
          type: 'group',
          fields: [
            {
              name: 'brand',
              type: 'text',
              required: true,
              defaultValue: 'Mondial',
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
        {
          name: 'frankCo',
          type: 'group',
          fields: [
            {
              name: 'brand',
              type: 'text',
              required: true,
              defaultValue: 'Frank & Co',
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
        {
          name: 'maharva',
          type: 'group',
          fields: [
            {
              name: 'brand',
              type: 'text',
              required: true,
              defaultValue: 'Maharva',
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '07 — Inquire / Reservation CTA — Code-owned',
      admin: {
        description: 'The closing reservation / inquiry CTA and modal are code-owned application features.',
        initCollapsed: true,
      },
      fields: [],
    },
  ],
};
