import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    // Verify database connectivity through Payload count
    await payload.count({
      collection: 'users',
    });

    return NextResponse.json(
      { status: 'ok' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch {
    // Fail safely without exposing internal database errors, connection strings, or credentials
    return NextResponse.json(
      { status: 'unavailable' },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
