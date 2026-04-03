import { fetchTokenPrice } from '@/lib/dex';

export async function GET(request, { params }) {
  const { address } = await params;
  const price = await fetchTokenPrice(address);
  if (!price) return Response.json({ error: 'No price data found' }, { status: 404 });
  return Response.json(price);
}
