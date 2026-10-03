import type { CollectionConfig } from 'payload';
import { APIError } from 'payload';

async function isMenuItemInHomepage(payload: any, menuItemId: string | number, checkDraft: boolean = true): Promise<boolean> {
  try {
    const published = await payload.findGlobal({
      slug: 'homepage',
      draft: false,
      overrideAccess: true,
      depth: 0,
    });
    const publishedItems = (published?.signatureDishes?.items || []).map((item: any) =>
      typeof item === 'object' && item !== null ? String(item.id) : String(item)
    );
    if (publishedItems.includes(String(menuItemId))) {
      return true;
    }

    if (checkDraft) {
      const draft = await payload.findGlobal({
        slug: 'homepage',
        draft: true,
        overrideAccess: true,
        depth: 0,
      });
      const draftItems = (draft?.signatureDishes?.items || []).map((item: any) =>
        typeof item === 'object' && item !== null ? String(item.id) : String(item)
      );
      if (draftItems.includes(String(menuItemId))) {
        return true;
      }
    }
  } catch (err) {
    console.error('Error checking homepage signature dishes reference:', err);
  }
  return false;
}

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priceLabel', 'signature', 'featured', 'isAvailable'],
    group: 'CONTENT',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Guard: Prevent marking item unavailable if referenced in published or draft Homepage signature dishes
        if (originalDoc?.isAvailable === true && data.isAvailable === false) {
          const isReferenced = await isMenuItemInHomepage(req.payload, originalDoc.id, true);
          if (isReferenced) {
            throw new APIError(
              'Cannot mark this item unavailable because it is currently selected as a Homepage Signature Dish. Replace it in Homepage first.',
              400
            );
          }
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        // Guard: Prevent deleting item if referenced in published or draft Homepage signature dishes
        const isReferenced = await isMenuItemInHomepage(req.payload, id, true);
        if (isReferenced) {
          throw new APIError(
            'Cannot delete this item because it is currently selected as a Homepage Signature Dish. Replace it in Homepage first.',
            400
          );
        }
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const { revalidateMenu, revalidateHomepage } = await import('@/lib/revalidation');
        // Always revalidate menu
        await revalidateMenu(false);

        // Targeted revalidation: Only revalidate homepage if item is in published Homepage signature dishes and rendered fields changed
        const inPublishedHomepage = await isMenuItemInHomepage(req.payload, doc.id, false);
        if (inPublishedHomepage) {
          const nameChanged = doc.name !== previousDoc?.name;
          const descChanged = JSON.stringify(doc.description) !== JSON.stringify(previousDoc?.description);
          const imageChanged = doc.image !== previousDoc?.image;
          const priceChanged = doc.priceLabel !== previousDoc?.priceLabel;
          const portionChanged = doc.portion !== previousDoc?.portion;

          if (nameChanged || descChanged || imageChanged || priceChanged || portionChanged) {
            await revalidateHomepage();
          }
        }
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
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'priceLabel',
      type: 'text',
      required: false,
    },
    {
      name: 'portion',
      type: 'text',
    },
    {
      name: 'priceVariants',
      type: 'array',
      fields: [
        { name: 'portion', type: 'text' },
        { name: 'label', type: 'text' },
        { name: 'priceLabel', type: 'text', required: true },
      ],
    },
    {
      name: 'subhead',
      type: 'text',
      localized: true,
    },
    {
      name: 'subheadNote',
      type: 'text',
      localized: true,
    },
    {
      name: 'additionalNotes',
      type: 'array',
      fields: [
        { name: 'note', type: 'text', required: true },
      ],
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Dish image rendered when selected as a Homepage Signature Dish.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'menu-categories',
      required: true,
      index: true,
    },
    {
      name: 'isIntroBlock',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'signature',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'sourceKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Internal immutable migration identity',
        position: 'sidebar',
      },
    },
  ],
};
