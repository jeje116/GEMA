import type { GlobalConfig } from 'payload';

export const Chef: GlobalConfig = {
  slug: 'chef',
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
        const { revalidateChef } = await import('@/lib/revalidation');
        await revalidateChef();
      },
    ],
  },
  fields: [
    {
      name: 'portrait',
      type: 'relationship',
      label: '01 — Portrait / Hero Media',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Portrait photo featured on the Chef page with grayscale-to-color reveal.',
      },
    },
    {
      name: 'name',
      type: 'text',
      label: '02 — Chef Name',
      required: true,
      defaultValue: 'Mandif Warokka',
    },
    {
      name: 'role',
      type: 'text',
      label: '02 — Chef Role',
      localized: true,
    },
    {
      name: 'biography',
      type: 'textarea',
      label: '03 — Biography',
      localized: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      label: '04 — Quote',
      localized: true,
    },
    {
      name: 'videoFile',
      type: 'relationship',
      label: '05 — Supporting Video File',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Supporting video used for the Homepage Chef Preview media blob.',
      },
    },
    {
      name: 'videoPoster',
      type: 'relationship',
      label: '05 — Supporting Video Poster',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Poster image for the supporting video.',
      },
    },
    {
      name: 'previewText',
      type: 'textarea',
      label: '06 — SEO / Preview Description',
      localized: true,
      admin: {
        description: 'Short editorial description used for Chef page metadata / preview context.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: '07 — CTA Label (Legacy)',
      localized: true,
      admin: {
        description: 'POTENTIALLY DEAD: Homepage reads homepage.chefPreview.ctaLabel. Preserved for backward compatibility.',
      },
    },
  ],
};
