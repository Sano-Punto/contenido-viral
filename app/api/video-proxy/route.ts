import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uri = searchParams.get('uri');

  if (!uri) {
    return new NextResponse('Missing uri parameter', { status: 400 });
  }

  const googleKey = process.env.GOOGLE_VERTEX_API_KEY || '';

  try {
    const fetchUrl = uri.includes('key=') ? uri : (uri + '&key=' + googleKey);
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      return new NextResponse('Failed to fetch video: ' + response.statusText, { status: response.status });
    }

    const videoBuffer = await response.arrayBuffer();

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Length': videoBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error proxying video:', error);
    return new NextResponse(error.message || 'Error streaming video', { status: 500 });
  }
}
