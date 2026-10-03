import type { GlobalConfig } from 'payload';

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'SITE',
    preview: (_, { locale }) => {
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}`;
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return true; // Local API controls overrideAccess & published status
    },
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { shouldSkipPublicRevalidation, revalidateHomepage } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateHomepage();
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
        { name: 'headline', type: 'text', localized: true },
        { name: 'kicker', type: 'text', localized: true },
        { name: 'support', type: 'text', localized: true },
        { name: 'location', type: 'text', localized: true },
        { name: 'ctaPrimary', type: 'text', localized: true },
        { name: 'ctaSecondary', type: 'text', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'positioning',
      type: 'group',
      label: '02 — Positioning',
      fields: [
        { name: 'text', type: 'textarea', localized: true },
        { name: 'dietary', type: 'text', localized: true },
      ],
    },
    {
      name: 'cuisineTeaser',
      type: 'group',
      label: '03 — Cuisine / Menu Teaser',
      admin: {
        description: 'Controls the four category/course labels and background images in the Homepage Cuisine/Menu teaser. This is separate from Signature Dishes.',
      },
      fields: [
        {
          name: 'item01',
          type: 'group',
          label: '01 — Teaser Item',
          fields: [
            { name: 'label', type: 'text', label: '01 — Label', localized: true, required: true },
            { name: 'image', type: 'relationship', label: '01 — Image', relationTo: 'media', required: true, localized: false },
          ],
        },
        {
          name: 'item02',
          type: 'group',
          label: '02 — Teaser Item',
          fields: [
            { name: 'label', type: 'text', label: '02 — Label', localized: true, required: true },
            { name: 'image', type: 'relationship', label: '02 — Image', relationTo: 'media', required: true, localized: false },
          ],
        },
        {
          name: 'item03',
          type: 'group',
          label: '03 — Teaser Item',
          fields: [
            { name: 'label', type: 'text', label: '03 — Label', localized: true, required: true },
            { name: 'image', type: 'relationship', label: '03 — Image', relationTo: 'media', required: true, localized: false },
          ],
        },
        {
          name: 'item04',
          type: 'group',
          label: '04 — Teaser Item',
          fields: [
            { name: 'label', type: 'text', label: '04 — Label', localized: true, required: true },
            { name: 'image', type: 'relationship', label: '04 — Image', relationTo: 'media', required: true, localized: false },
          ],
        },
      ],
    },
    {
      name: 'signatureDishes',
      type: 'group',
      label: '04 — Signature Dishes',
      admin: {
        description: 'Controls the four individual dish cards in the Signature Dishes carousel. This is separate from the Cuisine / Menu Teaser section.',
      },
      fields: [
        { name: 'title', type: 'text', localized: true },
        {
          name: 'items',
          type: 'relationship',
          relationTo: 'menu-items',
          hasMany: true,
          localized: false, // Explicitly non-localized: shared structural curation between EN and ID
          required: true,
          minRows: 4,
          maxRows: 4,
          admin: {
            isSortable: true,
            allowCreate: false,
            description: 'Select exactly 4 dishes for the Homepage. Drag to control display order.',
          },
          filterOptions: {
            isAvailable: { equals: true },
          },
          validate: (val: any) => {
            if (!val || !Array.isArray(val) || val.length !== 4) {
              return 'Select exactly 4 dishes.';
            }
            const ids = val.map((item: any) => (typeof item === 'object' && item !== null ? item.id : item));
            const uniqueIds = new Set(ids);
            if (uniqueIds.size !== 4) {
              return 'Select exactly 4 unique dishes.';
            }
            return true;
          },
        },
      ],
    },
    {
      name: 'space',
      type: 'group',
      label: '05 — The Space',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'text', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
        {
          name: 'imagePrimary',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'imageSecondary',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'chefPreview',
      type: 'group',
      label: '06 — Chef',
      fields: [
        { name: 'text', type: 'textarea', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'eventsIntro',
      type: 'group',
      label: '07 — Events',
      fields: [
        { name: 'ctaLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'reviews',
      type: 'group',
      label: '08 — Guest Words / Reviews',
      admin: {
        description: 'Select verified guest reviews shown in the Homepage carousel. Review order here controls carousel order.',
      },
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'Section Kicker',
          localized: true,
          defaultValue: 'Selected Guest Words',
        },
        {
          name: 'items',
          type: 'relationship',
          label: 'Reviews',
          relationTo: 'reviews',
          hasMany: true,
          localized: false,
          admin: {
            isSortable: true,
            description: 'Select verified and active guest reviews. Drag to control display order.',
          },
          filterOptions: {
            and: [
              { verificationStatus: { equals: 'verified' } },
              { isActive: { equals: true } },
            ],
          },
        },
      ],
    },
    {
      name: 'journalIntro',
      type: 'group',
      label: '09 — Journal',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'ctaLabel', type: 'text', localized: true },
      ],
    },
    {
      name: 'visitIntro',
      type: 'group',
      label: '10 — Visit',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'locationHeading', type: 'text', label: 'Location Heading', localized: true, defaultValue: 'Location' },
        { name: 'servicesHeading', type: 'text', label: 'Services Heading', localized: true, defaultValue: 'Services' },
      ],
    },
  ],
};
