import { getPayload } from 'payload';
import config from '../src/payload.config';
import { journalEntries } from '../src/content/fixtures/journal';

const COVER_MEDIA_MAP: Record<string, string> = {
  'inside-gemas-fresh-pasta': 'journal.fresh-pasta.cover',
  'from-dough-to-fire': 'shared.unsplash.1513104890138-7c749659a591',
  'a-table-for-two': 'shared.unsplash.1517248135467-4c7edcad34c4',
};

const BODY_IMAGE_MAP: Record<string, string> = {
  'inside-gemas-fresh-pasta': 'shared.unsplash.1551183053-bf91a1d81141',
};

function createLexicalDoc(blocks: any[], locale: 'en' | 'id', bodyMediaId?: number | string) {
  const children: any[] = [];

  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = block.content[locale] || block.content['en'] || '';
      children.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      });
    } else if (block.type === 'image') {
      if (bodyMediaId) {
        children.push({
          type: 'upload',
          version: 1,
          relationTo: 'media',
          value: bodyMediaId,
          fields: {
            caption: block.content[locale] || block.content['en'] || '',
          },
        });
      }
    } else if (block.type === 'quote') {
      const text = block.content[locale] || block.content['en'] || '';
      children.push({
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      });
    }
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  };
}

export async function seedJournal() {
  console.log('=== [CMS-003] SEEDING JOURNAL (3 ARTICLES WITH LEXICAL PARITY) ===');

  console.log(`Source Journal Entries: ${journalEntries.length} (Expected: 3)`);
  if (journalEntries.length !== 3) {
    throw new Error(`Expected 3 journal entries, got ${journalEntries.length}`);
  }

  const payload = await getPayload({ config });

  // 1. Fetch Media records
  console.log('Fetching media records for journal...');
  const allKeys = [...Object.values(COVER_MEDIA_MAP), ...Object.values(BODY_IMAGE_MAP)];
  const mediaRecords = await payload.find({
    collection: 'media',
    where: {
      sourceKey: {
        in: allKeys,
      },
    },
    limit: 20,
    overrideAccess: true,
  });

  const mediaByKey = new Map<string, number | string>();
  mediaRecords.docs.forEach((m: any) => {
    if (m.sourceKey) mediaByKey.set(m.sourceKey, m.id);
  });
  console.log(`Found ${mediaByKey.size} media records for journal.`);

  // 2. Seed each journal article
  for (const entry of journalEntries) {
    console.log(`Seeding article: ${entry.slug}...`);

    const coverKey = COVER_MEDIA_MAP[entry.slug];
    const coverMediaId = coverKey ? mediaByKey.get(coverKey) : undefined;
    if (!coverMediaId) {
      throw new Error(`Missing cover media record for journal slug: ${entry.slug}`);
    }

    const bodyKey = BODY_IMAGE_MAP[entry.slug];
    const bodyMediaId = bodyKey ? mediaByKey.get(bodyKey) : undefined;

    const lexicalEn = createLexicalDoc(entry.bodyBlocks, 'en', bodyMediaId);
    const lexicalId = createLexicalDoc(entry.bodyBlocks, 'id', bodyMediaId);

    const existing = await payload.find({
      collection: 'journal-posts',
      where: {
        slug: { equals: entry.slug },
      },
      limit: 1,
      overrideAccess: true,
    });

    const dataEn: any = {
      title: entry.title.en,
      slug: entry.slug,
      category: entry.category.en,
      excerpt: entry.excerpt.en,
      coverImage: coverMediaId,
      publishDate: entry.publishDate,
      authorLabel: entry.authorLabel,
      content: lexicalEn,
      _status: 'published',
    };

    const dataId: any = {
      title: entry.title.id || entry.title.en,
      category: entry.category.id || entry.category.en,
      excerpt: entry.excerpt.id || entry.excerpt.en,
      content: lexicalId,
      _status: 'published',
    };

    let docId: number | string;
    if (existing.docs.length > 0) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: 'journal-posts',
        id: docId,
        data: dataEn,
        locale: 'en',
        overrideAccess: true,
      });
      await payload.update({
        collection: 'journal-posts',
        id: docId,
        data: dataId,
        locale: 'id',
        overrideAccess: true,
      });
    } else {
      const created = await payload.create({
        collection: 'journal-posts',
        data: dataEn,
        locale: 'en',
        overrideAccess: true,
      });
      docId = created.id;
      await payload.update({
        collection: 'journal-posts',
        id: docId,
        data: dataId,
        locale: 'id',
        overrideAccess: true,
      });
    }
    console.log(`✓ Article "${entry.slug}" seeded and published.`);
  }

  // 3. Verification
  const verify = await payload.find({
    collection: 'journal-posts',
    where: { _status: { equals: 'published' } },
    overrideAccess: true,
  });
  console.log(`\nFinal DB Published Journal Posts: ${verify.totalDocs} (Expected: 3)`);
  if (verify.totalDocs !== 3) {
    throw new Error(`Expected 3 published journal posts, found ${verify.totalDocs}`);
  }

  console.log('=== [CMS-003] JOURNAL SEED COMPLETE & VERIFIED ===\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedJournal()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Journal seed failed:', err);
      process.exit(1);
    });
}
