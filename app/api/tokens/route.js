import { getAllTokens, createToken } from '@/lib/db';
import { v4 as uuid } from 'uuid';

export async function GET() {
  const tokens = await getAllTokens();
  return Response.json(tokens);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { address, chain, name, symbol, description, logo_url,
            website, twitter, telegram, discord, dex_links, owner } = body;

    if (!address || !chain || !name || !symbol) {
      return Response.json({ error: 'address, chain, name, symbol are required' }, { status: 400 });
    }

    // Check duplicate
    const existing = await getAllTokens();
    const dup = existing.find(t => t.address.toLowerCase() === address.toLowerCase());
    if (dup) return Response.json({ error: 'Token already listed' }, { status: 409 });

    const token = {
      id:          uuid(),
      address:     address.trim(),
      chain:       chain.trim(),
      name:        name.trim(),
      symbol:      symbol.trim().toUpperCase(),
      description: description?.trim() || '',
      logo_url:    logo_url || null,
      website:     website?.trim() || '',
      twitter:     twitter?.trim() || '',
      telegram:    telegram?.trim() || '',
      discord:     discord?.trim() || '',
      dex_links:   Array.isArray(dex_links) ? dex_links : [],
      owner:       owner?.trim() || 'anon',
      views:       0,
      created_at:  Date.now(),
    };

    await createToken(token);
    return Response.json({ token }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
