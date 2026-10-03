import { Pool } from 'pg';

export interface SplashMediaRecord {
  key: string;
  mediaType: string;
  variant: 'desktop' | 'mobile' | string;
  assetPath: string;
  mimeType: string;
  isEnabled: boolean;
}

export interface SplashConfig {
  desktopVideoUrl: string | null;
  mobileVideoUrl: string | null;
}

export const EMPTY_SPLASH_CONFIG: SplashConfig = {
  desktopVideoUrl: null,
  mobileVideoUrl: null,
};

let pool: Pool | null = null;

function getDatabasePool(): Pool | null {
  const connectionString = process.env.DATABASE_URI;
  if (!connectionString) {
    console.warn('[SplashConfig] DATABASE_URI environment variable is not defined.');
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

/**
 * Server-side loader to retrieve authoritative Splash video asset paths from the database.
 * Strict rules (SPLASH-008A):
 * - If record exists and is_enabled = true, returns the asset_path from DB.
 * - If DB is unreachable, record is missing, or is_enabled = false, returns null.
 * - NO hardcoded fallback video URLs are substituted.
 * - Gateway will display the authoritative still reference image instead.
 */
export async function getSplashMediaConfig(): Promise<SplashConfig> {
  try {
    const dbPool = getDatabasePool();
    if (!dbPool) {
      return EMPTY_SPLASH_CONFIG;
    }

    const result = await dbPool.query<{
      key: string;
      mediaType: string;
      variant: string;
      assetPath: string;
      mimeType: string;
      isEnabled: boolean;
    }>(
      `SELECT key, media_type AS "mediaType", variant, asset_path AS "assetPath", mime_type AS "mimeType", is_enabled AS "isEnabled"
       FROM splash_media_config
       WHERE is_enabled = true AND asset_path IS NOT NULL AND asset_path != '';`
    );

    const config: SplashConfig = {
      desktopVideoUrl: null,
      mobileVideoUrl: null,
    };

    for (const row of result.rows) {
      if (row.variant === 'desktop' && row.assetPath) {
        config.desktopVideoUrl = row.assetPath;
      } else if (row.variant === 'mobile' && row.assetPath) {
        config.mobileVideoUrl = row.assetPath;
      }
    }

    return config;
  } catch (error) {
    console.error('[SplashConfig] Error querying splash media configuration from database, falling back to still image:', error);
    return EMPTY_SPLASH_CONFIG;
  }
}
