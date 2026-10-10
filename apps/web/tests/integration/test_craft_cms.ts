import { getPayload } from 'payload';
import config from '../../src/payload.config';
import { getPageMedia } from '../../src/content/provider';

function assertSafeTestDatabase() {
  if (process.env.TEST_DATABASE_URI) {
    process.env.DATABASE_URI = process.env.TEST_DATABASE_URI;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SAFETY GUARD: CMS mutating tests cannot run when NODE_ENV is "production"!');
  }

  if (process.env.ALLOW_CMS_MUTATING_TESTS !== 'true') {
    throw new Error(
      'SAFETY GUARD: CMS mutating tests are blocked by default to prevent accidental data modification.\n' +
      'To execute against an explicitly designated disposable test database, set ALLOW_CMS_MUTATING_TESTS=true.'
    );
  }

  const dbUri = process.env.DATABASE_URI || '';
  if (!dbUri) {
    throw new Error('SAFETY GUARD: DATABASE_URI is not defined.');
  }

  let parsed: URL;
  try {
    parsed = new URL(dbUri);
  } catch (err: any) {
    throw new Error(`SAFETY GUARD: Invalid DATABASE_URI format: ${err.message}`);
  }

  const hostname = parsed.hostname.toLowerCase();
  const dbName = parsed.pathname.replace(/^\//, '').toLowerCase();

  // 1. Production host / domain / DB name protection
  const isProdHost =
    hostname === '194.163.40.10' ||
    hostname.includes('gemagroup.id') ||
    hostname.includes('supabase.co') ||
    hostname.includes('neon.tech') ||
    hostname.includes('rds.amazonaws.com') ||
    dbName.includes('prod') ||
    dbName.includes('production');

  if (isProdHost) {
    throw new Error('SAFETY GUARD: CMS test blocked! DATABASE_URI targets a remote or production database.');
  }

  // 2. Hostname restriction: Must be local
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocal) {
    throw new Error(`SAFETY GUARD: CMS test blocked! DATABASE_URI host "${hostname}" is non-local.`);
  }

  // 3. Database Identity Isolation: Prevent execution against normal development database
  const isNormalDevDb = dbName === 'gema_payload' || dbName === 'postgres' || dbName === '';
  if (isNormalDevDb) {
    throw new Error(
      `SAFETY GUARD: CMS test blocked! Target database is "${dbName}".\n` +
      'Mutating tests MUST NOT run against the normal development database ("gema_payload").\n' +
      'A dedicated disposable test database (e.g. "gema_test" or "payload_test") is required.\n' +
      'Provide TEST_DATABASE_URI="postgresql://.../gema_test".'
    );
  }

  // 4. Positive Identification: Require dedicated test database naming pattern
  const isTestDb = /(?:^test_|_test$|^.*_test_.*$|disposable)/.test(dbName);
  if (!isTestDb) {
    throw new Error(
      `SAFETY GUARD: Database "${dbName}" is not positively identified as a disposable test database.\n` +
      'Database name must contain "_test" or "disposable" (e.g., "gema_test", "disposable_cms").'
    );
  }

  // 5. Port-forwarding / proxy safeguard: Explicit confirmation of disposable DB identity
  if (process.env.CONFIRM_DISPOSABLE_DB !== 'true' && !process.env.TEST_DATABASE_URI) {
    throw new Error(
      'SAFETY GUARD: To protect against local port forwarding (e.g., SSH tunnels to remote DBs),\n' +
      'state-mutating tests require explicit declaration of a test database via TEST_DATABASE_URI\n' +
      'or setting CONFIRM_DISPOSABLE_DB=true.'
    );
  }
}

async function verifyCraftCMS() {
  assertSafeTestDatabase();

  console.log('=== VERIFYING THE CRAFT CMS INTEGRATION ===\n');
  const payload = await getPayload({ config });

  // 1. Check page-media global
  const pageMedia = await payload.findGlobal({
    slug: 'page-media',
    depth: 1,
    overrideAccess: true,
  });

  const craftImage = pageMedia.experience?.craftImage as any;
  console.log('Craft Image in page-media:', {
    id: craftImage?.id,
    filename: craftImage?.filename,
    mimeType: craftImage?.mimeType,
    url: craftImage?.url,
    alt: craftImage?.alt
  });

  if (!craftImage || craftImage.filename !== 'experience-the-craft-chef-plating.webp') {
    throw new Error('FAIL: craftImage is not selected or filename does not match Photo B');
  }

  // 2. Test Content Provider integration
  const providerData = await getPageMedia('en');
  console.log('Content provider experience craftImage:', providerData?.experience?.craftImage);
  if (!providerData?.experience?.craftImage?.src.includes('experience-the-craft-chef-plating.webp')) {
    throw new Error('FAIL: Content Provider getPageMedia did not resolve craftImage src');
  }

  // 3. Test Delete Guard on Photo B (media ID 43)
  let deleteBlocked = false;
  try {
    await payload.delete({
      collection: 'media',
      id: craftImage.id,
      overrideAccess: true,
    });
  } catch (err: any) {
    deleteBlocked = true;
    console.log('✓ In-use delete guard blocked deletion of referenced Photo B:', err.message);
  }
  if (!deleteBlocked) {
    throw new Error('FAIL: In-use craftImage was deleted without being blocked by guard!');
  }

  // 4. Test Save and Persistence
  const updated = await payload.updateGlobal({
    slug: 'page-media',
    data: {
      experience: {
        ...pageMedia.experience,
        craftImage: craftImage.id,
      },
    },
    overrideAccess: true,
  });
  console.log('✓ Successfully saved and persisted page-media global with craftImage ID:', (updated.experience?.craftImage as any)?.id || updated.experience?.craftImage);

  console.log('\n=== ALL CRAFT CMS TESTS PASSED ===');
  process.exit(0);
}

verifyCraftCMS().catch((err) => {
  console.error('\n❌ CMS CRAFT VERIFICATION FAILED:', err);
  process.exit(1);
});
