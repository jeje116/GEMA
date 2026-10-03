import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import config from '@/payload.config';

// Approved preview route patterns
const APPROVED_PATH_PATTERNS = [
  /^\/(en|id)$/,
  /^\/(en|id)\/journal(\/[a-zA-Z0-9_-]+)?$/,
  /^\/(en|id)\/events(\/[a-zA-Z0-9_-]+)?$/,
  /^\/(en|id)\/menu$/,
  /^\/(en|id)\/about$/,
  /^\/(en|id)\/experience$/,
  /^\/(en|id)\/occasions$/,
  /^\/(en|id)\/chef(\/[a-zA-Z0-9_-]+)?$/,
  /^\/(en|id)\/visit$/,
  /^\/(en|id)\/recognition$/,
  /^\/(en|id)\/private-dining$/,
];

export function isApprovedPreviewPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;

  // Must begin with a single slash, cannot begin with // (protocol-relative URL)
  if (!path.startsWith('/') || path.startsWith('//')) return false;

  // Reject URLs with protocols or javascript:
  if (path.includes('://') || path.toLowerCase().startsWith('javascript:')) return false;

  // Extract pathname without search/hash for pattern matching
  let pathname = path;
  try {
    const dummyUrl = new URL(path, 'http://localhost');
    pathname = dummyUrl.pathname;
  } catch {
    return false;
  }

  return APPROVED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // 1. Validate PREVIEW_SECRET
  const expectedSecret = process.env.PREVIEW_SECRET;
  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid or missing preview secret' },
      { status: 403 }
    );
  }

  // 2. Authenticate Payload User
  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: request.headers });

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Only logged-in admin or editor can enter preview.' },
        { status: 401 }
      );
    }

    // 3. Verify Role (admin or editor)
    const role = (user as any).role;
    if (role !== 'admin' && role !== 'editor') {
      return NextResponse.json(
        { error: 'Forbidden. User lacks preview privileges.' },
        { status: 403 }
      );
    }

    // 4. Validate destination path
    if (!path || !isApprovedPreviewPath(path)) {
      return NextResponse.json(
        { error: 'Invalid or unapproved preview destination path' },
        { status: 400 }
      );
    }

    // 5. Enable Draft Mode
    const draft = await draftMode();
    draft.enable();

    // 6. Redirect to validated destination
    const destinationUrl = new URL(path, request.nextUrl.origin);
    return NextResponse.redirect(destinationUrl);
  } catch (err: any) {
    console.error('[Preview API Error]:', err);
    return NextResponse.json(
      { error: 'Internal preview error' },
      { status: 500 }
    );
  }
}
