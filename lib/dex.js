const DEXSCREENER = 'https://api.dexscreener.com';

export async function fetchTokenPrice(address) {
  try {
    const res  = await fetch(`${DEXSCREENER}/latest/dex/tokens/${address}`, { next: { revalidate: 30 } });
    const data = await res.json();
    const pairs = (data.pairs || []).sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
    const top   = pairs[0];
    if (!top) return null;
    return {
      price_usd:        top.priceUsd,
      price_change_24h: top.priceChange?.h24,
      volume_24h:       top.volume?.h24,
      liquidity:        top.liquidity?.usd,
      market_cap:       top.marketCap,
      fdv:              top.fdv,
      dex:              top.dexId,
      chain:            top.chainId,
      pair_address:     top.pairAddress,
      dex_url:          top.url,
      txns_24h:         (top.txns?.h24?.buys || 0) + (top.txns?.h24?.sells || 0),
    };
  } catch {
    return null;
  }
}

export async function searchDex(query) {
  try {
    const res  = await fetch(`${DEXSCREENER}/latest/dex/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.pairs || []).slice(0, 5).map(p => ({
      name:         p.baseToken?.name,
      symbol:       p.baseToken?.symbol,
      address:      p.baseToken?.address,
      chain:        p.chainId,
      dex:          p.dexId,
      price_usd:    p.priceUsd,
      liquidity:    p.liquidity?.usd,
      volume_24h:   p.volume?.h24,
      market_cap:   p.marketCap,
      url:          p.url,
    }));
  } catch {
    return [];
  }
}

export function fmt(n, decimals = 2) {
  if (!n && n !== 0) return 'N/A';
  const num = parseFloat(n);
  if (isNaN(num)) return 'N/A';
  if (Math.abs(num) >= 1e9)   return '$' + (num / 1e9).toFixed(2) + 'B';
  if (Math.abs(num) >= 1e6)   return '$' + (num / 1e6).toFixed(2) + 'M';
  if (Math.abs(num) >= 1e3)   return '$' + (num / 1e3).toFixed(2) + 'K';
  if (Math.abs(num) < 0.0001) return '$' + num.toFixed(8);
  if (Math.abs(num) < 0.01)   return '$' + num.toFixed(6);
  return '$' + num.toFixed(decimals);
}
