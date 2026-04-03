import { getToken, updateToken, incrementViews } from '@/lib/db';

export async function GET(request, { params }) {
  const { address } = await params;
  const token = await getToken(address);
  if (!token) return Response.json({ error: 'Not found' }, { status: 404 });
  await incrementViews(address);
  return Response.json(token);
}

export async function PUT(request, { params }) {
  const { address } = await params;
  try {
    const body = await request.json();
    const { owner, ...updates } = body;

    const token = await getToken(address);
    if (!token) return Response.json({ error: 'Not found' }, { status: 404 });

    // Basic ownership check — owner field must match
    if (token.owner && owner && token.owner !== owner) {
      return Response.json({ error: 'Not authorized' }, { status: 403 });
    }

    const allowed = ['name','symbol','description','logo_url','website','twitter','telegram','discord','dex_links'];
    const safe    = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    safe.updated_at = Date.now();

    const updated = await updateToken(address, safe);
    return Response.json({ token: updated });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
