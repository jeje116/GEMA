import { getPayload } from 'payload';
import config from '../src/payload.config';
import { sql } from '@payloadcms/db-postgres';

async function main() {
  const payload = await getPayload({ config });
  const hp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 1 });
  console.log('--- PAYLOAD HOMEPAGE CUISINETEASER ---');
  console.log(JSON.stringify(hp.cuisineTeaser, null, 2));

  console.log('\n--- DIRECT SQL QUERY: homepage_cuisine_teaser ---');
  const res = await payload.db.drizzle.execute(sql`SELECT * FROM "homepage_cuisine_teaser" ORDER BY "_order" ASC`);
  console.log('Rows in homepage_cuisine_teaser:', res.rows);

  console.log('\n--- DIRECT SQL QUERY: _homepage_v_version_cuisine_teaser ---');
  const resV = await payload.db.drizzle.execute(sql`SELECT * FROM "_homepage_v_version_cuisine_teaser" ORDER BY "_order" ASC`);
  console.log('Rows in _homepage_v_version_cuisine_teaser:', resV.rows);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
