import { Client } from 'pg';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const webRoot = path.resolve(dirname, '..');

export async function rehearseFreshDb() {
  console.log('\n================================================================');
  console.log('  GEMA CMS — FRESH DATABASE MIGRATION & BOOTSTRAP REHEARSAL');
  console.log('================================================================\n');

  const baseUri = process.env.DATABASE_URI;
  if (!baseUri) {
    throw new Error('DATABASE_URI environment variable is missing.');
  }

  const parsedUrl = new URL(baseUri);
  const rehearsalDbName = 'gema_rehearsal_cms004';
  
  // 1. Connect to administrative DB and create rehearsal DB
  const adminUrl = new URL(baseUri);
  adminUrl.pathname = '/postgres';
  const adminClient = new Client({ connectionString: adminUrl.toString() });

  console.log(`Step 1: Creating fresh isolated rehearsal database "${rehearsalDbName}"...`);
  await adminClient.connect();
  // Terminate any existing connections to the rehearsal DB if present
  await adminClient.query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '${rehearsalDbName}'
      AND pid <> pg_backend_pid();
  `);
  await adminClient.query(`DROP DATABASE IF EXISTS ${rehearsalDbName};`);
  await adminClient.query(`CREATE DATABASE ${rehearsalDbName};`);
  console.log(`✓ Database "${rehearsalDbName}" created successfully.\n`);

  const rehearsalUrl = new URL(baseUri);
  rehearsalUrl.pathname = `/${rehearsalDbName}`;
  const rehearsalUri = rehearsalUrl.toString();

  const envOverrides = {
    ...process.env,
    DATABASE_URI: rehearsalUri,
  };

  try {
    // 2. Run committed migrations on fresh empty database
    console.log('Step 2: Executing all committed migrations on empty database...');
    const migrateOutput = execSync(
      `node ./node_modules/payload/bin.js migrate`,
      {
        cwd: webRoot,
        env: envOverrides,
        encoding: 'utf8',
      }
    );
    console.log(migrateOutput);

    // Verify migrations table
    const dbClient = new Client({ connectionString: rehearsalUri });
    await dbClient.connect();
    const migrationRows = await dbClient.query('SELECT name, batch FROM payload_migrations ORDER BY id ASC;');
    console.log('Committed migrations executed in rehearsal DB:');
    migrationRows.rows.forEach((r) => console.log(`  ✓ ${r.name} (Batch ${r.batch})`));
    await dbClient.end();

    if (migrationRows.rows.length !== 2) {
      throw new Error(`Expected 2 committed migrations to run, but found ${migrationRows.rows.length}`);
    }
    console.log('✓ Migration execution verified.\n');

    // 3. Initial Content Bootstrap (First Run)
    console.log('Step 3: Running content bootstrap in --initial mode (First Run)...');
    const bootstrapOutput1 = execSync(
      `node ./node_modules/.bin/tsx scripts/bootstrap-content.ts --initial`,
      {
        cwd: webRoot,
        env: envOverrides,
        encoding: 'utf8',
      }
    );
    console.log(bootstrapOutput1);

    // 4. Test Initial Mode Twice (Second Run - Must create 0 duplicates)
    console.log('Step 4: Running content bootstrap in --initial mode (Second Run - Idempotency Test)...');
    const bootstrapOutput2 = execSync(
      `node ./node_modules/.bin/tsx scripts/bootstrap-content.ts --initial`,
      {
        cwd: webRoot,
        env: envOverrides,
        encoding: 'utf8',
      }
    );
    console.log(bootstrapOutput2);

    // Check if second run created anything new
    if (bootstrapOutput2.includes('created') && !bootstrapOutput2.includes('0 created')) {
      // Check if non-zero created
      const nonZeroMatch = bootstrapOutput2.match(/[1-9]\d*\s+created/);
      if (nonZeroMatch) {
        throw new Error(`Second --initial run violated idempotency! Created new records: ${nonZeroMatch[0]}`);
      }
    }
    console.log('✓ Idempotency verified: Second run created 0 duplicates and preserved all data.\n');

    // 5. Verify Content Integrity
    console.log('Step 5: Verifying overall content integrity in --verify mode...');
    const verifyOutput = execSync(
      `node ./node_modules/.bin/tsx scripts/bootstrap-content.ts --verify`,
      {
        cwd: webRoot,
        env: envOverrides,
        encoding: 'utf8',
      }
    );
    console.log(verifyOutput);

    if (!verifyOutput.includes('[PASS]')) {
      throw new Error('Fresh DB rehearsal content integrity verification FAILED!');
    }
    console.log('✓ Content integrity PASS.\n');

    console.log('================================================================');
    console.log('  FRESH DATABASE REHEARSAL SUCCESSFUL (ALL STEPS PASSED)');
    console.log('================================================================\n');
  } finally {
    // 6. Cleanup: Drop rehearsal database
    console.log(`Step 6: Destroying rehearsal database "${rehearsalDbName}"...`);
    try {
      await adminClient.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${rehearsalDbName}'
          AND pid <> pg_backend_pid();
      `);
      await adminClient.query(`DROP DATABASE IF EXISTS ${rehearsalDbName};`);
      console.log(`✓ Rehearsal database "${rehearsalDbName}" destroyed cleanly.\n`);
    } catch (cleanupErr) {
      console.error(`Warning: Failed to cleanly drop ${rehearsalDbName}:`, cleanupErr);
    } finally {
      await adminClient.end();
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  rehearseFreshDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Rehearsal failed:', err);
      process.exit(1);
    });
}
