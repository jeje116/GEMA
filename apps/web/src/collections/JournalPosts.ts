import type { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const JournalPosts: CollectionConfig = {
  slug: 'journal-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'publishDate', '_status'],
    group: 'CONTENT',
    preview: (doc, { locale }) => {
      if (!doc?.slug) return null;
      return `/api/preview?secret=${process.env.PREVIEW_SECRET}&path=/${locale || 'en'}/journal/${doc.slug}`;
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const { shouldSkipPublicRevalidation, revalidateJournal } = await import('@/lib/revalidation');
        if (!shouldSkipPublicRevalidation(doc, previousDoc)) {
          await revalidateJournal(doc.slug);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const { revalidateJournal } = await import('@/lib/revalidation');
        await revalidateJournal(doc.slug);
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
    // 01 — Article Header
    {
      name: 'category',
      type: 'text',
      label: '01 — Category',
      required: true,
      localized: true,
      admin: {
        description: 'Article category displayed at the top of the article header.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '01 — Title',
      required: true,
      localized: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      label: '01 — Publish Date',
      required: true,
    },
    {
      name: 'authorLabel',
      type: 'text',
      label: '01 — Author / Source Label',
    },
    // 02 — Main Image
    {
      name: 'coverImage',
      type: 'relationship',
      label: '02 — Cover Image',
      relationTo: 'media',
      required: true,
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
        description: 'Main article body content (textual rich content only; no embedded images).',
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
      },
    },
  ],
};
