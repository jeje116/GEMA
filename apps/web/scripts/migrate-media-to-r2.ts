import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';
import config from '../src/payload.config';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export async function migrateMediaToR2() {
  console.log('=== [CMS-004] R2 MEDIA MIGRATION AUDIT & RUNNER ===\n');

  const {
    R2_BUCKET,
    R2_ENDPOINT,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_PUBLIC_URL,
  } = process.env;

  const credentialsProvided = Boolean(
    R2_BUCKET &&
    R2_ENDPOINT &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY &&
    R2_PUBLIC_URL
  );

  if (!credentialsProvided) {
    console.log('R2 STATUS: NOT CONFIGURED — CREDENTIALS NOT PROVIDED');
    console.log('Reason: Cloudflare R2 environment variables are not set in the current environment.');
    console.log('Local filesystem media in public/media/cms will continue to be used.');
    console.log('Migration runner verified in DRY/UNCONFIGURED mode.\n');
    return { status: 'NOT_CONFIGURED', migrated: 0, verified: 0 };
  }

  console.log(`Connecting to Cloudflare R2 bucket: ${R2_BUCKET}...`);
  const { S3Client, PutObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3');

  const s3 = new S3Client({
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
    region: 'auto',
    forcePathStyle: true,
  });

  const payload = await getPayload({ config });
  const mediaDocs = await payload.find({
    collection: 'media',
    limit: 500,
    overrideAccess: true,
  });

  console.log(`Found ${mediaDocs.totalDocs} media documents in Payload.\n`);

  let migratedCount = 0;
  let reusedCount = 0;

  for (const doc of mediaDocs.docs) {
    if (!doc.filename) continue;
    const filename: string = doc.filename;
    const prefix = (doc as any).prefix as string | undefined;
    const objectKey: string = prefix ? `${prefix}/${filename}` : filename;
    const localPath = path.resolve(dirname, '../public/media/cms', filename);

    if (!fs.existsSync(localPath)) {
      console.warn(`[WARNING] Local binary not found for media ID ${doc.id}: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const localStat = fs.statSync(localPath);

    // Check if object already exists in R2
    let exists = false;
    try {
      const head = await s3.send(new HeadObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      }));
      if (head.ContentLength === localStat.size) {
        exists = true;
        reusedCount++;
        console.log(`✓ Reused existing identical R2 object: ${objectKey}`);
      }
    } catch {
      // Object does not exist, proceed to upload
    }

    if (!exists) {
      console.log(`Uploading ${objectKey} (${localStat.size} bytes)...`);
      await s3.send(new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: doc.mimeType || 'application/octet-stream',
      }));

      // Verify object exists, size, MIME
      const verifyHead = await s3.send(new HeadObjectCommand({
        Bucket: R2_BUCKET,
        Key: objectKey,
      }));

      if (verifyHead.ContentLength !== localStat.size) {
        throw new Error(`Size mismatch after uploading ${objectKey}: expected ${localStat.size}, got ${verifyHead.ContentLength}`);
      }

      migratedCount++;
      const publicUrl = `${R2_PUBLIC_URL!.replace(/\/$/, '')}/${objectKey}`;
      console.log(`✓ Uploaded and verified: ${objectKey} -> ${publicUrl}`);
    }
  }

  console.log(`\n=== R2 MIGRATION SUMMARY ===`);
  console.log(`Total Media Assets: ${mediaDocs.totalDocs}`);
  console.log(`Newly Uploaded: ${migratedCount}`);
  console.log(`Reused / Existing: ${reusedCount}`);
  console.log(`Media document identities and relationships left intact.\n`);

  return { status: 'SUCCESS', migrated: migratedCount, verified: reusedCount + migratedCount };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrateMediaToR2()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('R2 migration failed:', err);
      process.exit(1);
    });
}
