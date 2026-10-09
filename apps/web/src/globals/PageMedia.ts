import type { GlobalConfig } from 'payload';

export const PageMedia: GlobalConfig = {
  slug: 'page-media',
  admin: {
    group: 'SITE',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { revalidatePageMedia } = await import('@/lib/revalidation');
        const menuChanged = JSON.stringify(doc?.menu) !== JSON.stringify(previousDoc?.menu);
        const aboutChanged = JSON.stringify(doc?.about) !== JSON.stringify(previousDoc?.about);
        const expChanged = JSON.stringify(doc?.experience) !== JSON.stringify(previousDoc?.experience);
        const occChanged = JSON.stringify(doc?.occasions) !== JSON.stringify(previousDoc?.occasions);

        if (menuChanged) await revalidatePageMedia('menu');
        if (aboutChanged) await revalidatePageMedia('about');
        if (expChanged) await revalidatePageMedia('experience');
        if (occChanged) await revalidatePageMedia('occasions');
        if (!menuChanged && !aboutChanged && !expChanged && !occChanged) {
          await revalidatePageMedia();
        }
      },
    ],
  },
  fields: [
    {
      name: 'menu',
      type: 'group',
      label: '01 — Menu Page Media',
      fields: [
        {
          name: 'foodImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Hero / Featured Food Image (Large banner shown when Food menu is selected).',
          },
        },
        {
          name: 'beverageImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Hero / Featured Beverage Image (Large banner shown when Beverage menu is selected).',
          },
        },
      ],
    },
    {
      name: 'experience',
      type: 'group',
      label: '02 — Experience Page Media',
      fields: [
        {
          name: 'heroImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'morningImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'eveningImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'detailsImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'craftImage',
          type: 'relationship',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'The Craft section photograph (Chef plating). Fallback used if unselected.',
          },
        },
        {
          name: 'materialImage01',
          type: 'relationship',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Select the image shown in Material slot 01 (Transitional color swatch shown if unselected).',
          },
        },
        {
          name: 'materialImage02',
          type: 'relationship',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Select the image shown in Material slot 02 (Transitional color swatch shown if unselected).',
          },
        },
        {
          name: 'materialImage03',
          type: 'relationship',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Select the image shown in Material slot 03 (Transitional color swatch shown if unselected).',
          },
        },
        {
          name: 'materialImage04',
          type: 'relationship',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Select the image shown in Material slot 04 (Transitional color swatch shown if unselected).',
          },
        },
      ],
    },
    {
      name: 'occasions',
      type: 'group',
      label: '03 — Occasions Page Media',
      fields: [
        {
          name: 'heroImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'privateDiningImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'weddingImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'birthdayImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'brandMondialImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'brandFrankCoImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'brandMaharvaImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: '04 — About Page Media',
      fields: [
        {
          name: 'originImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'philosophyImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'architectureImage',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
};
