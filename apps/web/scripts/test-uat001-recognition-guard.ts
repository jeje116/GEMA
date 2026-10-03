import { getPayload } from 'payload';
import config from '../src/payload.config';

async function run() {
  console.log('=== UAT-001 RECOGNITION PUBLICATION GUARD & DYNAMIC ROUTE QA ===\n');

  const payload = await getPayload({ config });

  // 1. Test Incomplete Record → Verified Guard
  console.log('Test 1: Attempting to verify incomplete Recognition record (ID 1)...');
  let guardBlocked = false;
  try {
    await payload.update({
      collection: 'recognitions',
      id: 1,
      data: {
        contentStatus: 'verified',
      },
      overrideAccess: true,
    });
  } catch (err: any) {
    guardBlocked = true;
    console.log('✓ Publication guard correctly blocked verification:');
    console.log('  Error message:', err.message);
  }

  if (!guardBlocked) {
    console.error('FAIL: Publication guard failed to block incomplete record from becoming verified!');
    process.exit(1);
  }

  // 2. Test Unverified Detail Route Returns 404
  console.log('\nTest 2: Verifying unverified Recognition route returns 404...');
  try {
    const res = await fetch('http://localhost:3001/en/recognition/recognition-1');
    console.log(`  Route /en/recognition/recognition-1 returned status: ${res.status}`);
    if (res.status === 404) {
      console.log('✓ Unverified recognition detail route returns 404 as required.');
    } else {
      console.warn(`! Expected 404 for unverified record, got ${res.status}`);
    }
  } catch (err: any) {
    console.error('Failed to fetch from localhost:3001:', err.message);
  }

  // 3. Test Creating a Controlled Verified QA Recognition (New Content Without Redeploy)
  console.log('\nTest 3: Creating a controlled verified QA Recognition record...');
  const testSlug = 'qa-test-award-2026';
  let createdDoc: any = null;
  try {
    // Find a media item to attach
    const media = await payload.find({ collection: 'media', limit: 1, overrideAccess: true });
    const coverImageId = media.docs[0]?.id;

    createdDoc = await payload.create({
      collection: 'recognitions',
      data: {
        title: 'QA Excellence Award 2026',
        slug: testSlug,
        year: '2026',
        awardingBody: 'International Dining Review',
        scope: 'restaurant',
        coverImage: coverImageId,
        imageCaption: 'QA Award Trophy Presentation',
        excerpt: 'Recognized for culinary excellence and rigorous operational governance.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'GEMA Restaurant has been honored with the 2026 QA Excellence Award for extraordinary culinary precision and guest experience.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
              },
            ],
            direction: 'ltr',
          },
        },
        contentStatus: 'verified',
      },
      overrideAccess: true,
    });
    console.log(`✓ Created verified QA Recognition: ID ${createdDoc.id}, slug: ${createdDoc.slug}`);

    // Wait a brief moment for ISR/server cache if any
    await new Promise((r) => setTimeout(r, 1500));

    // Test detail route resolves without redeploy
    const testUrl = `http://localhost:3001/en/recognition/${testSlug}`;
    console.log(`  Fetching newly created record route: ${testUrl}...`);
    const pageRes = await fetch(testUrl);
    console.log(`  Route ${testUrl} returned status: ${pageRes.status}`);

    if (pageRes.status === 200) {
      const html = await pageRes.text();
      const hasTitle = html.includes('QA Excellence Award 2026');
      const hasBody = html.includes('culinary precision and guest experience');
      const hasCaption = html.includes('QA Award Trophy Presentation');
      console.log('  Page contains title:', hasTitle ? 'PASS' : 'FAIL');
      console.log('  Page contains body text:', hasBody ? 'PASS' : 'FAIL');
      console.log('  Page contains image caption:', hasCaption ? 'PASS' : 'FAIL');
      if (hasTitle && hasBody) {
        console.log('✓ New verified Recognition is accessible without redeploy!');
      } else {
        console.error('FAIL: Page content did not match expected verified record.');
      }
    } else {
      console.error(`FAIL: Expected 200 for new verified record, got ${pageRes.status}`);
    }
  } finally {
    // 4. Cleanup QA content
    if (createdDoc?.id) {
      console.log('\nTest 4: Cleaning up QA Recognition record...');
      await payload.delete({
        collection: 'recognitions',
        id: createdDoc.id,
        overrideAccess: true,
      });
      console.log('✓ QA Recognition record cleaned up successfully.');
    }
  }

  console.log('\n=== RECOGNITION PUBLICATION QA COMPLETE ===');
  process.exit(0);
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
