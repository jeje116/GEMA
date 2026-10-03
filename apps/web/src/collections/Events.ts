import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'startDateTime', '_status'],
    group: 'CONTENT',
    preview: (doc, { locale }) => {
      if (!doc?.slug) return null;
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/events/${doc.slug}`;
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { shouldSkipPublicRevalidation, revalidateEvents } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateEvents(doc.slug);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const { revalidateEvents } = await import('@/lib/revalidation');
        await revalidateEvents(doc.slug);
      },
    ],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        _status: {
          equals: 'published',
        },
      };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Event hero cover image displayed at the top of the event detail page.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: {
        description: 'Event category/kicker displayed above the title on the detail page.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'startDateTime',
      type: 'date',
      required: true,
    },
    {
      name: 'endDateTime',
      type: 'date',
    },
    {
      name: 'priceLabel',
      type: 'text',
      localized: true,
    },
    {
      name: 'fullDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Main body copy for the event detail page.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Listing & Card Content: Summary copy displayed on event cards in listings.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Listing & Card Content: Highlight this event on listing cards.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
