export const dynamic = 'force-static';

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'BisDig Buddy API (static)'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
