/**
 * Single canonical production origin helper.
 * Derived from NEXT_PUBLIC_SERVER_URL with safe fallback to https://gemagroup.id.
 * Trailing slashes are stripped to ensure clean path composition.
 */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://gemagroup.id'
).replace(/\/+$/, '');
