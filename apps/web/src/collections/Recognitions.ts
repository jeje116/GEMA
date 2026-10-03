import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const Recognitions: CollectionConfig = {
  slug: 'recognitions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'year', 'scope', 'contentStatus'],
    group: 'CONTENT',
    preview: (doc, { locale }) => {
      if (!doc?.slug) return null;
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/recognition/${doc.slug}`;
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        contentStatus: {
          equals: 'verified',
        },
      };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        // Publication-readiness guard: only allow contentStatus = 'verified' if all required editorial fields are valid
        const status = data.contentStatus ?? originalDoc?.contentStatus;
        if (status === 'verified') {
          const missing: string[] = [];

          const title = data.title ?? originalDoc?.title;
          if (!title || (typeof title === 'string' && !title.trim())) {
            missing.push('Title');
          }

          const slug = data.slug ?? originalDoc?.slug;
          if (!slug || (typeof slug === 'string' && (!slug.trim() || /^recognition-\d+$/.test(slug) || slug.startsWith('internal-')))) {
            missing.push('Publication-ready Slug (must not be an internal placeholder)');
          }

          const year = data.year ?? originalDoc?.year;
          if (!year || (typeof year === 'string' && !year.trim())) {
            missing.push('Year');
          }

          const awardingBody = data.awardingBody ?? originalDoc?.awardingBody;
          if (!awardingBody || (typeof awardingBody === 'string' && !awardingBody.trim())) {
            missing.push('Awarding Body');
          }

          const scope = data.scope ?? originalDoc?.scope;
          if (!scope) {
            missing.push('Scope');
          }

          const coverImage = data.coverImage ?? originalDoc?.coverImage;
          if (!coverImage) {
            missing.push('Cover Image');
          }

          const excerpt = data.excerpt ?? originalDoc?.excerpt;
          if (!excerpt || (typeof excerpt === 'string' && !excerpt.trim())) {
            missing.push('Excerpt / Introduction');
          }

          const content = data.content ?? originalDoc?.content;
          const hasContent = content && typeof content === 'object' && Array.isArray(content.root?.children) && content.root.children.length > 0;
          if (!hasContent) {
            missing.push('Content (Rich Text)');
          }

          if (missing.length > 0) {
            throw new Error(
              `[Publication Guard] Cannot mark Recognition as "verified": missing required editorial fields: ${missing.join(', ')}. All editorial fields must be populated with publication-ready content before verification.`
            );
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { shouldSkipPublicRevalidation, revalidateRecognition } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateRecognition(doc.slug);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const { revalidateRecognition } = await import('@/lib/revalidation');
        await revalidateRecognition(doc.slug);
      },
    ],
  },
  fields: [
    // 01 — Article Header
    {
      name: 'year',
      type: 'text',
      label: '01 — Year / Date',
      required: true,
      admin: {
        description: 'Year or date of recognition (e.g. "2024").',
      },
    },
    {
      name: 'awardingBody',
      type: 'text',
      label: '01 — Awarding Body / Organization',
      required: true,
      admin: {
        description: 'Name of the awarding body or publication.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '01 — Title',
      required: true,
      localized: true,
      admin: {
        description: 'Title of the recognition or award.',
      },
    },
    {
      name: 'scope',
      type: 'select',
      label: '01 — Scope',
      required: true,
      options: [
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Chef', value: 'chef' },
      ],
    },
    // 02 — Main Image
    {
      name: 'coverImage',
      type: 'relationship',
      label: '02 — Cover Image',
      relationTo: 'media',
      admin: {
        description: 'Single main editorial image positioned after header and before body content.',
      },
    },
    {
      name: 'imageCaption',
      type: 'text',
      label: '02 — Image Name / Caption',
      localized: true,
      admin: {
        description: 'Editorial caption rendered directly beneath the main cover image.',
      },
    },
    // 03 — Introduction
    {
      name: 'excerpt',
      type: 'textarea',
      label: '03 — Excerpt / Introduction',
      localized: true,
      admin: {
        description: 'Introduction / Lead paragraph displayed before the article body.',
      },
    },
    // 04 — Content
    {
      name: 'content',
      type: 'richText',
      label: '04 — Content',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures.filter((feature) => feature.key !== 'upload'),
      }),
      admin: {
        description: 'Main recognition body content (textual rich content only; no embedded images).',
      },
    },
    // 05 — SEO
    {
      name: 'seo',
      type: 'group',
      label: '05 — SEO Metadata',
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
      ],
    },
    // Sidebar
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Unique URL slug for recognition detail (e.g. "michelin-guide-2024").',
      },
    },
    {
      name: 'contentStatus',
      type: 'select',
      required: true,
      defaultValue: 'needs-confirmation',
      options: [
        { label: 'Verified', value: 'verified' },
        { label: 'Demo', value: 'demo' },
        { label: 'Needs Confirmation', value: 'needs-confirmation' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
};
