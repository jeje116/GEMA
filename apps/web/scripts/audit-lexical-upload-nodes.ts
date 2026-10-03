import { getPayload } from 'payload';
import config from '../src/payload.config';

function findUploadNodes(node: any, results: any[] = []): any[] {
  if (!node || typeof node !== 'object') return results;

  if (node.type === 'upload') {
    results.push(node);
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      findUploadNodes(child, results);
    }
  }

  // Also check if there are sub-fields containing lexical trees
  for (const key of Object.keys(node)) {
    if (key !== 'children' && typeof node[key] === 'object' && node[key] !== null) {
      findUploadNodes(node[key], results);
    }
  }

  return results;
}

async function audit() {
  const payload = await getPayload({ config });

  console.log('========================================');
  console.log('AUDITING JOURNAL POSTS FOR UPLOAD NODES');
  console.log('========================================');

  const journalRes = await payload.find({
    collection: 'journal-posts',
    locale: 'all',
    limit: 100,
  });

  const journalAudit = [];
  const allMediaIds = new Set<string | number>();

  for (const doc of journalRes.docs as any[]) {
    const docTitle = doc.title?.en || doc.title || doc.slug;
    const contents = [
      { locale: 'en', root: doc.content?.en?.root || doc.content?.root },
      { locale: 'id', root: doc.content?.id?.root },
    ];

    const docUploads: any[] = [];
    for (const c of contents) {
      if (c.root) {
        const found = findUploadNodes(c.root);
        for (const f of found) {
          docUploads.push({ locale: c.locale, node: f });
          if (f.value !== undefined) {
            const id = typeof f.value === 'object' ? f.value.id : f.value;
            allMediaIds.add(id);
          }
        }
      }
    }

    if (docUploads.length > 0) {
      journalAudit.push({
        id: doc.id,
        slug: doc.slug,
        title: docTitle,
        uploadCount: docUploads.length,
        nodes: docUploads.map(u => ({
          locale: u.locale,
          value: u.node.value,
          relationTo: u.node.relationTo,
          caption: u.node.fields?.caption,
        })),
      });
    }
  }

  console.log(`Journal posts examined: ${journalRes.docs.length}`);
  console.log(`Journal posts containing legacy upload nodes: ${journalAudit.length}`);
  console.log(JSON.stringify(journalAudit, null, 2));
  console.log(`Total unique referenced Media IDs in Journal:`, Array.from(allMediaIds));

  console.log('\n========================================');
  console.log('AUDITING RECOGNITIONS FOR UPLOAD NODES');
  console.log('========================================');

  const recRes = await payload.find({
    collection: 'recognitions',
    locale: 'all',
    limit: 100,
  });

  const recAudit = [];
  const recMediaIds = new Set<string | number>();

  for (const doc of recRes.docs as any[]) {
    const docTitle = doc.title?.en || doc.title || doc.slug;
    const contents = [
      { locale: 'en', root: doc.content?.en?.root || doc.content?.root },
      { locale: 'id', root: doc.content?.id?.root },
    ];

    const docUploads: any[] = [];
    for (const c of contents) {
      if (c.root) {
        const found = findUploadNodes(c.root);
        for (const f of found) {
          docUploads.push({ locale: c.locale, node: f });
          if (f.value !== undefined) {
            const id = typeof f.value === 'object' ? f.value.id : f.value;
            recMediaIds.add(id);
          }
        }
      }
    }

    if (docUploads.length > 0) {
      recAudit.push({
        id: doc.id,
        slug: doc.slug,
        title: docTitle,
        uploadCount: docUploads.length,
        nodes: docUploads.map(u => ({
          locale: u.locale,
          value: u.node.value,
          relationTo: u.node.relationTo,
        })),
      });
    }
  }

  console.log(`Recognitions examined: ${recRes.docs.length}`);
  console.log(`Recognitions containing legacy upload nodes: ${recAudit.length}`);
  console.log(JSON.stringify(recAudit, null, 2));
  console.log(`Total unique referenced Media IDs in Recognitions:`, Array.from(recMediaIds));
}

audit().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
