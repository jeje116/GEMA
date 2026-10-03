const { Pool } = require('pg');

async function migrateSplashConfig() {
  const connectionString =
    process.env.DATABASE_URI ||
    'postgresql://postgres:postgres@127.0.0.1:5435/gema_payload';
  const pool = new Pool({ connectionString });

  try {
    console.log('Connecting to PostgreSQL database...');
    // 1. Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS splash_media_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(64) UNIQUE NOT NULL,
        media_type VARCHAR(32) NOT NULL DEFAULT 'video',
        variant VARCHAR(32) NOT NULL,
        asset_path VARCHAR(255) NOT NULL,
        mime_type VARCHAR(64) NOT NULL DEFAULT 'video/mp4',
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Table splash_media_config verified/created.');

    // 2. Seed / Upsert the authoritative records
    const records = [
      {
        key: 'splash_video_desktop',
        media_type: 'video',
        variant: 'desktop',
        asset_path: '/media/splash/gema-splash-desktop.mp4',
        mime_type: 'video/mp4',
        is_enabled: true,
      },
      {
        key: 'splash_video_mobile',
        media_type: 'video',
        variant: 'mobile',
        asset_path: '/media/splash/gema-splash-mobile.mp4',
        mime_type: 'video/mp4',
        is_enabled: true,
      },
    ];

    for (const r of records) {
      await pool.query(
        `
        INSERT INTO splash_media_config (key, media_type, variant, asset_path, mime_type, is_enabled)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (key) DO UPDATE SET
          media_type = EXCLUDED.media_type,
          variant = EXCLUDED.variant,
          asset_path = EXCLUDED.asset_path,
          mime_type = EXCLUDED.mime_type,
          is_enabled = EXCLUDED.is_enabled,
          updated_at = NOW();
      `,
        [r.key, r.media_type, r.variant, r.asset_path, r.mime_type, r.is_enabled]
      );
    }
    console.log('Deterministic splash media records seeded/updated successfully.');

    // 3. Query back and verify
    const { rows } = await pool.query(
      `SELECT key, media_type, variant, asset_path, mime_type, is_enabled, updated_at FROM splash_media_config ORDER BY id ASC;`
    );
    console.log('Current splash_media_config records:');
    console.table(rows);
  } finally {
    await pool.end();
  }
}

migrateSplashConfig().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
