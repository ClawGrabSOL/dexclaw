'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, ExternalLink, Zap } from 'lucide-react';

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

const CHAIN_STYLES = {
  solana:    { dot: '#9945FF', label: 'SOL' },
  ethereum:  { dot: '#627EEA', label: 'ETH' },
  base:      { dot: '#0052FF', label: 'BASE' },
  bsc:       { dot: '#F3BA2F', label: 'BSC' },
  polygon:   { dot: '#8247E5', label: 'POLY' },
  avalanche: { dot: '#E84142', label: 'AVAX' },
  arbitrum:  { dot: '#28A0F0', label: 'ARB' },
  optimism:  { dot: '#FF0420', label: 'OP' },
};

export default function TokenCard({ token, index = 0 }) {
  const [price,   setPrice]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    fetch(`/api/price/${token.address}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setPrice(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token.address]);

  const chain  = CHAIN_STYLES[token.chain] || { dot: '#888', label: token.chain?.toUpperCase() };
  const change = price ? parseFloat(price.price_change_24h) : null;
  const isPos  = change !== null && change >= 0;

  return (
    <Link href={`/token/${token.address}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block card glow-hover animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 40}ms` }}>

      {/* Top gradient line on hover */}
      <div className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)' }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {token.logo_url ? (
            <img src={token.logo_url} alt={token.symbol}
              className="w-10 h-10 rounded-xl object-cover border border-dc-border shrink-0 transition-transform group-hover:scale-105" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-dc-surface border border-dc-border flex items-center justify-center shrink-0 transition-all group-hover:border-dc-border2">
              <span className="text-white font-black text-sm">{token.symbol?.slice(0, 2)}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm truncate">{token.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: chain.dot }} />
                <span className="text-[9px] font-bold text-dc-dim tracking-wider">{chain.label}</span>
              </div>
            </div>
            <span className="text-[11px] text-dc-muted font-mono">${token.symbol}</span>
          </div>
          <ExternalLink size={13} className="text-dc-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -translate-y-px" />
        </div>

        {/* Price */}
        <div className="mb-3">
          {loading ? (
            <div className="space-y-1.5">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-3 w-16" />
            </div>
          ) : price ? (
            <>
              <p className="font-mono font-black text-white text-lg leading-none">{fmt(price.price_usd)}</p>
              {change !== null && (
                <span className={`flex items-center gap-0.5 text-[11px] font-bold font-mono mt-1 ${isPos ? 'positive' : 'negative'}`}>
                  {isPos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {isPos ? '+' : ''}{change.toFixed(2)}%
                </span>
              )}
            </>
          ) : (
            <p className="text-[12px] text-dc-muted">No price data</p>
          )}
        </div>

        {/* Stats */}
        {price && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              ['MCap',    fmt(price.market_cap)],
              ['Vol 24h', fmt(price.volume_24h)],
            ].map(([l, v]) => (
              <div key={l} className="bg-dc-surface rounded-lg px-2.5 py-1.5">
                <p className="text-[9px] text-dc-muted uppercase tracking-wider">{l}</p>
                <p className="text-[12px] text-white font-mono font-semibold">{v}</p>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {token.description && (
          <p className="text-[11px] text-dc-dim leading-relaxed line-clamp-2 mb-3">{token.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-dc-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            {token.dex_links?.slice(0, 3).map((l, i) => (
              <span key={i} className="text-[9px] bg-dc-surface border border-dc-border px-1.5 py-0.5 rounded-md text-dc-dim font-semibold uppercase tracking-wide">
                {l.name}
              </span>
            ))}
            {!token.dex_links?.length && (
              <span className="text-[10px] text-dc-muted">No DEX links</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-dc-muted">
            <Eye size={9} /> {token.views || 0}
          </div>
        </div>
      </div>

      {/* Hover buy overlay */}
      {token.dex_links?.length > 0 && (
        <div className={`absolute inset-x-0 bottom-0 flex transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {token.dex_links.slice(0, 2).map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold transition-colors ${
                i === 0 ? 'bg-white text-black hover:bg-dc-white2' : 'bg-dc-card2 border-t border-l border-dc-border text-white hover:bg-dc-card'
              }`}>
              <Zap size={10} strokeWidth={2.5} />
              Buy on {l.name}
            </a>
          ))}
        </div>
      )}
    </Link>
  );
}
