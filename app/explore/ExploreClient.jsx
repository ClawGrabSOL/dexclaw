'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import TokenCard from '@/components/TokenCard';

const CHAINS = ['all','solana','ethereum','base','bsc','polygon','avalanche','arbitrum'];

export default function ExploreClient({ tokens }) {
  const [query,  setQuery]  = useState('');
  const [chain,  setChain]  = useState('all');

  const filtered = tokens.filter(t => {
    const q = query.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q) || t.address.toLowerCase().includes(q);
    const matchC = chain === 'all' || t.chain === chain;
    return matchQ && matchC;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-tb-text mb-1">Explore Tokens</h1>
        <p className="text-tb-dim text-sm">{tokens.length} tokens listed</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tb-muted pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, symbol, or address..."
            className="input pl-9 w-full" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CHAINS.map(c => (
            <button key={c} onClick={() => setChain(c)}
              className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors capitalize ${
                chain === c
                  ? 'bg-tb-accent text-white'
                  : 'bg-tb-surface border border-tb-border text-tb-dim hover:text-tb-text'
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-tb-muted">
          {query || chain !== 'all' ? 'No tokens match your search.' : 'No tokens listed yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => <TokenCard key={t.id} token={t} />)}
        </div>
      )}
    </div>
  );
}
