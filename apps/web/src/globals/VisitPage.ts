import type { GlobalConfig } from 'payload';

export const VisitPage: GlobalConfig = {
  slug: 'visit-page',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/visit`;
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
        const { shouldSkipPublicRevalidation, revalidateVisit } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateVisit();
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: '01 — Page Title',
      localized: true,
      required: true,
      defaultValue: 'Visit',
    },
    {
      name: 'contactHeading',
      type: 'text',
      label: '02 — Contact Heading',
      localized: true,
      required: true,
      defaultValue: 'Contact',
    },
    {
      name: 'reservationsHeading',
      type: 'text',
      label: '03 — Reservations Heading',
      localized: true,
      required: true,
      defaultValue: 'Reservations',
    },
    {
      name: 'reservationsNote',
      type: 'textarea',
      label: '03 — Reservations Note',
      localized: true,
      required: true,
    },
    {
      name: 'dietaryPolicy',
      type: 'group',
      label: '04 — Dietary Policy',
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
      name: 'dressCodePolicy',
      type: 'group',
      label: '05 — Dress Code Policy',
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
      name: 'parkingPolicy',
      type: 'group',
      label: '06 — Parking Policy',
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
  ],
};
