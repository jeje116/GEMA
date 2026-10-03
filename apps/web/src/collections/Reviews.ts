import type { CollectionConfig, CollectionBeforeDeleteHook, CollectionBeforeChangeHook, Where } from 'payload';
import { APIError } from 'payload';

async function isReviewInHomepage(payload: any, reviewId: string | number, checkDraft: boolean = true): Promise<boolean> {
  try {
    const published = await payload.findGlobal({
      slug: 'homepage',
      draft: false,
      overrideAccess: true,
      depth: 0,
    });
    const publishedItems = (published?.reviews?.items || []).map((item: any) =>
      typeof item === 'object' && item !== null ? String(item.id) : String(item)
    );
    if (publishedItems.includes(String(reviewId))) {
      return true;
    }

    if (checkDraft) {
      const draft = await payload.findGlobal({
        slug: 'homepage',
        draft: true,
        overrideAccess: true,
        depth: 0,
      });
      const draftItems = (draft?.reviews?.items || []).map((item: any) =>
        typeof item === 'object' && item !== null ? String(item.id) : String(item)
      );
      if (draftItems.includes(String(reviewId))) {
        return true;
      }
    }
  } catch (err) {
    console.error('Error checking homepage reviews reference:', err);
  }
  return false;
}

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'quote',
    defaultColumns: ['quote', 'attribution', 'sourceType', 'verificationStatus', 'isActive'],
    group: 'CONTENT',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      const where: Where = {
        and: [
          {
            verificationStatus: {
              equals: 'verified',
            },
          },
          {
            isActive: {
              equals: true,
            },
          },
        ],
      };
      return where;
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Guard: Prevent deactivating or unverifying if referenced in published or draft Homepage reviews
        const willBeInactive = data.isActive === false && originalDoc?.isActive === true;
        const willBeUnverified = data.verificationStatus === 'unverified' && originalDoc?.verificationStatus === 'verified';

        if (willBeInactive || willBeUnverified) {
          const isReferenced = await isReviewInHomepage(req.payload, originalDoc.id, true);
          if (isReferenced) {
            throw new APIError(
              'Cannot unverify or deactivate this review because it is currently selected on the Homepage. Remove it from Homepage first.',
              400
            );
          }
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        // Guard: Prevent deleting if referenced in published or draft Homepage reviews
        const isReferenced = await isReviewInHomepage(req.payload, id, true);
        if (isReferenced) {
          throw new APIError(
            'Cannot delete this review because it is currently selected on the Homepage. Remove it from Homepage first.',
            400
          );
        }
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const { revalidateHomepage } = await import('@/lib/revalidation');
        const inPublishedHomepage = await isReviewInHomepage(req.payload, doc.id, false);
        if (inPublishedHomepage) {
          await revalidateHomepage();
        }
      },
    ],
    afterDelete: [
      async () => {
        const { revalidateHomepage } = await import('@/lib/revalidation');
        await revalidateHomepage();
      },
    ],
  },
  fields: [
    {
      type: 'collapsible',
      label: '01 — Review',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Quote',
          required: true,
          admin: {
            description: 'The exact quote text from the guest.',
          },
        },
        {
          name: 'attribution',
          type: 'text',
          label: 'Attribution / Guest Name',
          admin: {
            description: 'Name or public identifier of the guest (e.g. John D., @foodie_surabaya).',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: '02 — Provenance',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sourceType',
          type: 'select',
          label: 'Source Type',
          defaultValue: 'direct',
          required: true,
          options: [
            { label: 'Direct Guest Feedback', value: 'direct' },
            { label: 'Google Maps Review', value: 'google' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Press / Editorial', value: 'press' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'sourceLabel',
          type: 'text',
          label: 'Source Label',
          admin: {
            description: 'Display label or context for the source (e.g. Google Review, Table 4 Feedback).',
          },
        },
        {
          name: 'sourceUrl',
          type: 'text',
          label: 'Source Reference / URL',
          admin: {
            description: 'Direct link to the public review or post where applicable.',
          },
        },
        {
          name: 'verificationStatus',
          type: 'select',
          label: 'Verification Status',
          defaultValue: 'unverified',
          required: true,
          options: [
            { label: 'Unverified (Concept / Research)', value: 'unverified' },
            { label: 'Verified (Approved Customer Testimonial)', value: 'verified' },
          ],
          admin: {
            description: 'Only verified reviews can be selected for public display on the Homepage.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: '03 — Publishing',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
          admin: {
            description: 'Set to inactive to temporarily withdraw this review without deleting it.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: '04 — Internal',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'internalNotes',
          type: 'textarea',
          label: 'Internal Notes',
          admin: {
            description: 'Editorial or provenance notes for internal admin use only.',
          },
        },
      ],
    },
  ],
};
