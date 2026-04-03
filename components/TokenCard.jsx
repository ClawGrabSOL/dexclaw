'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, ExternalLink, Globe } from 'lucide-react';

function fmt(n) {
  if (!n && n !== 0) return '—';
  const num = parseFloat(n);
  if (isNaN(num)) return '—';
  if (Math.abs(num) >= 1e9)   return '$' + (num / 1e9).toFixed(2) + 'B';
  if (Math.abs(num) >= 1e6)   return '$' + (num / 1e6).toFixed(2) + 'M';
  if (Math.abs(num) >= 1e3)   return '$' + (num / 1e3).toFixed(2) + 'K';
  if (Math.abs(num) < 0.0001) return '$' + num.toFixed(8);
  if (Math.abs(num) < 0.01)   return '$' + num.toFixed(6);
  return '$' + num.toFixed(2);
}

const CHAIN_COLORS = {
  solana:   'bg-purple-500/15 text-purple-400 border-purple-500/25',
  ethereum: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  base:     'bg-sky-500/15 text-sky-400 border-sky-500/25',
  bsc:      'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  polygon:  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  avalanche:'bg-red-500/15 text-red-400 border-red-500/25',
};

export default function TokenCard({ token }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch(`/api/price/${token.address}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setPrice(d))
      .catch(() => {});
  }, [token.address]);

  const chainCls = CHAIN_COLORS[token.chain] || 'bg-tb-surface text-tb-dim border-tb-border';
  const change   = price ? parseFloat(price.price_change_24h) : null;
  const isPos    = change !== null && change >= 0;

  return (
    <Link href={`/token/${token.address}`}
      className="card p-4 hover:border-tb-border2 hover:bg-tb-card/80 transition-all group flex flex-col gap-3 cursor-pointer">

      {/* Header */}
      <div className="flex items-center gap-3">
        {token.logo_url ? (
          <img src={token.logo_url} alt={token.symbol}
            className="w-11 h-11 rounded-xl object-cover border border-tb-border shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-tb-accent/15 border border-tb-accent/25 flex items-center justify-center shrink-0">
            <span className="text-tb-accent font-bold text-sm">{token.symbol?.slice(0,2)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-tb-text text-[15px] leading-tight">{token.name}</span>
            <span className={`badge ${chainCls}`}>{token.chain}</span>
          </div>
          <span className="text-xs text-tb-dim font-mono">${token.symbol}</span>
        </div>
        <ExternalLink size={14} className="text-tb-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>

      {/* Price row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono font-bold text-tb-text text-base">
            {price ? fmt(price.price_usd) : <span className="text-tb-muted text-sm">Loading...</span>}
          </p>
          {change !== null && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold font-mono mt-0.5 ${isPos ? 'positive' : 'negative'}`}>
              {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPos ? '+' : ''}{change.toFixed(2)}%
            </span>
          )}
        </div>
        <div className="text-right">
          {price?.market_cap && <p className="text-[11px] text-tb-muted">MCap <span className="text-tb-dim">{fmt(price.market_cap)}</span></p>}
          {price?.volume_24h && <p className="text-[11px] text-tb-muted">Vol <span className="text-tb-dim">{fmt(price.volume_24h)}</span></p>}
        </div>
      </div>

      {/* Description */}
      {token.description && (
        <p className="text-xs text-tb-dim leading-relaxed line-clamp-2">{token.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-tb-border">
        <div className="flex items-center gap-1.5">
          {token.dex_links?.slice(0,3).map((l, i) => (
            <span key={i} className="text-[10px] bg-tb-surface border border-tb-border px-1.5 py-0.5 rounded text-tb-muted">{l.name}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-tb-muted">
          <Eye size={10} />
          {token.views || 0}
        </div>
      </div>
    </Link>
  );
}
