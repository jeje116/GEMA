import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { isApprovedPreviewPath } from '../preview/route';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path') || '/';

  // Validate path to prevent open redirects
  let redirectPath = '/';
  if (path === '/' || isApprovedPreviewPath(path)) {
    redirectPath = path;
  }

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to public route
  const destinationUrl = new URL(redirectPath, request.nextUrl.origin);
  return NextResponse.redirect(destinationUrl);
}
