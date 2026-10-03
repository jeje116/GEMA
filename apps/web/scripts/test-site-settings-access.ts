import { getPayload } from 'payload';
import config from '../src/payload.config';

async function testSiteSettingsAccess() {
  console.log('=== TESTING SITE SETTINGS FIELD ACCESS SECURITY ===\n');
  const payload = await getPayload({ config });

  // 1. Ensure we have an admin user and an editor user for testing
  let adminUser = (await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@gema.test' } },
    overrideAccess: true,
  })).docs[0];

  if (!adminUser) {
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@gema.test',
        password: 'Password123!',
        role: 'admin',
        name: 'Test Admin',
      },
      overrideAccess: true,
    });
  }

  let editorUser = (await payload.find({
    collection: 'users',
    where: { email: { equals: 'editor@gema.test' } },
    overrideAccess: true,
  })).docs[0];

  if (!editorUser) {
    editorUser = await payload.create({
      collection: 'users',
      data: {
        email: 'editor@gema.test',
        password: 'Password123!',
        role: 'editor',
        name: 'Test Editor',
      },
      overrideAccess: true,
    });
  }

  const currentSettings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: true,
  });
  const originalPhone = currentSettings.phone;
  console.log(`Original phone: "${originalPhone}"`);

  // 2. Editor attempts to update protected field (phone) with overrideAccess: false
  console.log('\n2. Testing Editor update (should be BLOCKED):');
  let editorBlocked = false;
  try {
    const editorUpdateResult = await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: false,
      user: editorUser,
      data: {
        phone: '+62 999-HACKED-999',
      },
    });

    // In Payload, if field access returns false, the field update is either rejected or silently omitted
    if (editorUpdateResult.phone === originalPhone) {
      editorBlocked = true;
      console.log(`   PASS: Editor update was ignored. Phone remains: "${editorUpdateResult.phone}"`);
    } else {
      console.error(`   FAIL: Editor successfully modified phone to "${editorUpdateResult.phone}"!`);
      process.exit(1);
    }
  } catch (err: any) {
    editorBlocked = true;
    console.log(`   PASS: Editor update threw access error: ${err.message}`);
  }

  if (!editorBlocked) {
    console.error('FAIL: Editor was not blocked from updating operational field.');
    process.exit(1);
  }

  // 3. Admin attempts to update protected field with overrideAccess: false
  console.log('\n3. Testing Admin update (should be ALLOWED):');
  const testPhone = '+62 812-ADMIN-TEST';
  const adminUpdateResult = await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: false,
    user: adminUser,
    data: {
      phone: testPhone,
    },
  });

  if (adminUpdateResult.phone === testPhone) {
    console.log(`   PASS: Admin successfully updated phone to "${adminUpdateResult.phone}"`);
  } else {
    console.error(`   FAIL: Admin update failed. Phone is "${adminUpdateResult.phone}"`);
    process.exit(1);
  }

  // 4. Restore original phone
  console.log('\n4. Restoring original phone...');
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: false,
    user: adminUser,
    data: {
      phone: originalPhone,
    },
  });

  const restored = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
  console.log(`   Phone restored to: "${restored.phone}"`);

  console.log('\n=== SITE SETTINGS ACCESS AUDIT PASS ===');
  process.exit(0);
}

testSiteSettingsAccess().catch((err) => {
  console.error('Error during site settings access audit:', err);
  process.exit(1);
});
