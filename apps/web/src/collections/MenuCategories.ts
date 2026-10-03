import type { CollectionConfig } from 'payload';

export const MenuCategories: CollectionConfig = {
  slug: 'menu-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'menuType', 'sortOrder', 'isActive'],
    group: 'CONTENT',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async () => {
        const { revalidateMenu } = await import('@/lib/revalidation');
        await revalidateMenu(false);
      },
    ],
    afterDelete: [
      async () => {
        const { revalidateMenu } = await import('@/lib/revalidation');
        await revalidateMenu(false);
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'sectionNote',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional editorial note displayed beneath the category title on the website.',
      },
    },
    {
      name: 'menuType',
      type: 'select',
      required: true,
      defaultValue: 'food',
      options: [
        { label: 'Food', value: 'food' },
        { label: 'Beverage', value: 'beverage' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
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
