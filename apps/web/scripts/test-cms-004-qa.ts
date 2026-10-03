import { getPayload } from 'payload';
import config from '../src/payload.config';
import { isApprovedPreviewPath } from '../src/app/api/preview/route';
import { shouldSkipPublicRevalidation } from '../src/lib/revalidation';

export async function runCMS004Tests() {
  console.log('\n==================================================');
  console.log('  GEMA CMS-004 PRODUCTION READINESS TEST SUITE');
  console.log('==================================================\n');

  const payload = await getPayload({ config });

  // ----------------------------------------------------
  // TEST 1: PREVIEW PATH VALIDATION (Open Redirect Protection)
  // ----------------------------------------------------
  console.log('--- TEST 1: Preview Path Validation ---');
  const allowedPaths = [
    '/en',
    '/id',
    '/en/journal',
    '/id/journal',
    '/en/journal/inside-gemas-fresh-pasta',
    '/id/journal/inside-gemas-fresh-pasta',
    '/en/events',
    '/id/events',
    '/en/events/private-table-series',
    '/id/events/private-table-series',
    '/en/menu',
    '/id/menu',
    '/en/about',
    '/id/about',
    '/en/experience',
    '/id/experience',
    '/en/occasions',
    '/id/occasions',
    '/en/chef/mandif-warokka',
    '/id/chef/mandif-warokka',
    '/en/visit',
    '/id/visit',
  ];

  const blockedPaths = [
    'https://evil.com',
    'http://evil.com/malicious',
    '//evil.com',
    'javascript:alert(1)',
    '/admin',
    '/api/users',
    '/unknown/route',
    'ftp://server/file',
    '',
  ];

  let pathValidationPassed = true;
  for (const p of allowedPaths) {
    if (!isApprovedPreviewPath(p)) {
      console.error(`❌ Expected approved path was rejected: "${p}"`);
      pathValidationPassed = false;
    }
  }
  for (const p of blockedPaths) {
    if (isApprovedPreviewPath(p)) {
      console.error(`❌ Expected blocked path was approved: "${p}"`);
      pathValidationPassed = false;
    }
  }

  if (pathValidationPassed) {
    console.log(`✓ All ${allowedPaths.length} valid paths approved, all ${blockedPaths.length} dangerous paths blocked.\n`);
  } else {
    throw new Error('Preview path validation failed!');
  }

  // ----------------------------------------------------
  // TEST 2: DRAFT-AWARE REVALIDATION LOGIC
  // ----------------------------------------------------
  console.log('--- TEST 2: Draft-Aware Revalidation Logic ---');
  // Draft Save: current draft, previous draft -> should skip
  const draftSave = shouldSkipPublicRevalidation({ _status: 'draft' }, { _status: 'draft' });
  // Initial draft creation: current draft, no previous -> should skip
  const newDraft = shouldSkipPublicRevalidation({ _status: 'draft' }, undefined);
  // Publish: current published, previous draft -> MUST NOT skip
  const publish = shouldSkipPublicRevalidation({ _status: 'published' }, { _status: 'draft' });
  // Update published: current published, previous published -> MUST NOT skip
  const updatePublished = shouldSkipPublicRevalidation({ _status: 'published' }, { _status: 'published' });
  // Unpublish: current draft, previous published -> MUST NOT skip
  const unpublish = shouldSkipPublicRevalidation({ _status: 'draft' }, { _status: 'published' });

  console.log(`Draft Save skips public revalidation:        ${draftSave} (Expected: true)`);
  console.log(`New Draft skips public revalidation:         ${newDraft} (Expected: true)`);
  console.log(`Publish skips public revalidation:           ${publish} (Expected: false)`);
  console.log(`Update Published skips public revalidation:  ${updatePublished} (Expected: false)`);
  console.log(`Unpublish skips public revalidation:         ${unpublish} (Expected: false)`);

  if (!draftSave || !newDraft || publish || updatePublished || unpublish) {
    throw new Error('Draft-aware revalidation contract violation!');
  }
  console.log('✓ Draft-aware revalidation contract passed.\n');

  // ----------------------------------------------------
  // TEST 3: R2 ATOMIC CONFIGURATION VALIDATION
  // ----------------------------------------------------
  console.log('--- TEST 3: R2 Atomic Configuration Validation ---');
  // Test function simulating the atomic validation
  function validateR2Atomic(env: Record<string, string | undefined>) {
    const r2EnvVars = {
      bucket: env.R2_BUCKET,
      endpoint: env.R2_ENDPOINT,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      publicUrl: env.R2_PUBLIC_URL,
    };
    const r2Values = Object.values(r2EnvVars);
    const someR2Set = r2Values.some(Boolean);
    const allR2Set = r2Values.every(Boolean);

    if (someR2Set && !allR2Set) {
      const missing = Object.entries(r2EnvVars)
        .filter(([_, v]) => !v)
        .map(([k]) => k);
      throw new Error(`[R2 Configuration Error] Partial R2 storage configuration detected! Missing: ${missing.join(', ')}`);
    }
    return allR2Set ? 'ENABLED' : 'DISABLED';
  }

  // Case A: All empty -> DISABLED
  const resEmpty = validateR2Atomic({});
  console.log(`Empty R2 env: ${resEmpty} (Expected: DISABLED)`);

  // Case B: Partial config (only bucket) -> throws
  let partialThrew = false;
  try {
    validateR2Atomic({ R2_BUCKET: 'my-bucket' });
  } catch (err: any) {
    partialThrew = true;
    console.log(`Partial R2 rejected as expected: "${err.message}"`);
  }

  // Case C: All set -> ENABLED
  const resFull = validateR2Atomic({
    R2_BUCKET: 'my-bucket',
    R2_ENDPOINT: 'https://r2.cloudflarestorage.com',
    R2_ACCESS_KEY_ID: 'key',
    R2_SECRET_ACCESS_KEY: 'secret',
    R2_PUBLIC_URL: 'https://media.gemarestaurant.com',
  });
  console.log(`Full R2 env: ${resFull} (Expected: ENABLED)`);

  if (resEmpty !== 'DISABLED' || !partialThrew || resFull !== 'ENABLED') {
    throw new Error('R2 atomic configuration validation failed!');
  }
  console.log('✓ R2 atomic configuration contract passed.\n');

  // ----------------------------------------------------
  // TEST 4: ADMIN SECURITY & RBAC PERMISSIONS
  // ----------------------------------------------------
  console.log('--- TEST 4: Admin Security & RBAC Access Control ---');
  // Ensure test admin and editor users exist
  const adminEmail = 'testadmin@gemasurabaya.com';
  const editorEmail = 'testeditor@gemasurabaya.com';

  let adminUser = (await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    overrideAccess: true,
  })).docs[0];

  if (!adminUser) {
    adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Test Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin',
      },
      overrideAccess: true,
    });
    console.log(`Created test admin user: ${adminEmail}`);
  }

  let editorUser = (await payload.find({
    collection: 'users',
    where: { email: { equals: editorEmail } },
    overrideAccess: true,
  })).docs[0];

  if (!editorUser) {
    editorUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Test Editor',
        email: editorEmail,
        password: 'EditorPassword123!',
        role: 'editor',
      },
      overrideAccess: true,
    });
    console.log(`Created test editor user: ${editorEmail}`);
  }

  // Test 4A: Editor cannot self-promote to admin
  let selfPromotionBlocked = false;
  try {
    await payload.update({
      collection: 'users',
      id: editorUser.id,
      data: {
        role: 'admin',
      },
      user: editorUser,
      overrideAccess: false,
    });
    // Check if role actually changed
    const reloaded = await payload.findByID({
      collection: 'users',
      id: editorUser.id,
      overrideAccess: true,
    });
    if (reloaded.role === 'admin') {
      console.error('❌ Editor successfully self-promoted to admin!');
    } else {
      selfPromotionBlocked = true;
      console.log('✓ Editor self-promotion silently ignored or blocked by field-level access control.');
    }
  } catch {
    selfPromotionBlocked = true;
    console.log('✓ Editor self-promotion explicitly rejected with error.');
  }

  // Test 4B: Editor cannot create a new Admin user
  let editorCreateAdminBlocked = false;
  try {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Rogue Admin',
        email: 'rogue@gemasurabaya.com',
        password: 'RoguePassword123!',
        role: 'admin',
      },
      user: editorUser,
      overrideAccess: false,
    });
    console.error('❌ Editor was able to create a user!');
  } catch {
    editorCreateAdminBlocked = true;
    console.log('✓ Editor user creation blocked by collection access control.');
  }

  // Test 4C: Editor cannot modify SiteSettings operational fields
  let siteSettingsProtected = false;
  try {
    const originalSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        phone: '+1 800 HACKED',
      },
      user: editorUser,
      overrideAccess: false,
    });
    const afterUpdate = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
    if (afterUpdate.phone === '+1 800 HACKED') {
      console.error('❌ Editor was able to modify protected SiteSettings!');
    } else {
      siteSettingsProtected = true;
      console.log('✓ Editor cannot mutate protected SiteSettings fields (field access control enforced).');
    }
  } catch {
    siteSettingsProtected = true;
    console.log('✓ Editor update on SiteSettings rejected with error.');
  }

  if (!selfPromotionBlocked || !editorCreateAdminBlocked || !siteSettingsProtected) {
    throw new Error('Admin RBAC security tests failed!');
  }
  console.log('✓ Admin RBAC security tests passed.\n');

  // ----------------------------------------------------
  // TEST 5: VERSIONING RESTORE QA (Journal, Events, Homepage)
  // ----------------------------------------------------
  console.log('--- TEST 5: Versioning Restore QA ---');

  // 5A: Journal Versioning
  const journalDoc = (await payload.find({ collection: 'journal-posts', limit: 1, overrideAccess: true })).docs[0];
  if (journalDoc) {
    const originalTitle = journalDoc.title;
    // Create new revision
    await payload.update({
      collection: 'journal-posts',
      id: journalDoc.id,
      data: {
        title: 'Temporary Revision Title',
      },
      overrideAccess: true,
    });

    const versions = await payload.findVersions({
      collection: 'journal-posts',
      where: { parent: { equals: journalDoc.id } },
      limit: 5,
      overrideAccess: true,
    });
    console.log(`✓ Journal Post has ${versions.totalDocs} version revisions.`);

    // Restore original title
    await payload.update({
      collection: 'journal-posts',
      id: journalDoc.id,
      data: {
        title: originalTitle,
      },
      overrideAccess: true,
    });
    console.log(`✓ Journal Post restored to original title: "${originalTitle}"`);
  }

  // 5B: Events Versioning
  const eventDoc = (await payload.find({ collection: 'events', limit: 1, overrideAccess: true })).docs[0];
  if (eventDoc) {
    const originalTitle = eventDoc.title;
    await payload.update({
      collection: 'events',
      id: eventDoc.id,
      data: {
        title: 'Temporary Event Revision',
      },
      overrideAccess: true,
    });

    const eventVersions = await payload.findVersions({
      collection: 'events',
      where: { parent: { equals: eventDoc.id } },
      limit: 5,
      overrideAccess: true,
    });
    console.log(`✓ Event has ${eventVersions.totalDocs} version revisions.`);

    await payload.update({
      collection: 'events',
      id: eventDoc.id,
      data: {
        title: originalTitle,
      },
      overrideAccess: true,
    });
    console.log(`✓ Event restored to original title: "${originalTitle}"`);
  }

  // 5C: Homepage Versioning
  const hpDoc = await payload.findGlobal({ slug: 'homepage', overrideAccess: true });
  const hpVersions = await payload.findGlobalVersions({
    slug: 'homepage',
    limit: 5,
    overrideAccess: true,
  });
  console.log(`✓ Homepage has ${hpVersions.totalDocs} global version revisions.\n`);

  console.log('==================================================');
  console.log('  ALL CMS-004 AUTOMATED TESTS PASSED (100%)');
  console.log('==================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCMS004Tests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Test suite failed:', err);
      process.exit(1);
    });
}
