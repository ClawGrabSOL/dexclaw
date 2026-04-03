'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import TokenCard from '@/components/TokenCard';

const CHAINS = ['all','solana','ethereum','base','bsc','polygon','avalanche','arbitrum','optimism'];

const CHAIN_DOTS = {
  solana: '#9945FF', ethereum: '#627EEA', base: '#0052FF',
  bsc: '#F3BA2F', polygon: '#8247E5', avalanche: '#E84142',
  arbitrum: '#28A0F0', optimism: '#FF0420',
};

export default function ExploreClient({ tokens }) {
  const [query, setQuery] = useState('');
  const [chain, setChain] = useState('all');
  const [sort,  setSort]  = useState('newest');

  const filtered = tokens
    .filter(t => {
      const q = query.toLowerCase();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q) || t.address.toLowerCase().includes(q);
      const matchC = chain === 'all' || t.chain === chain;
      return matchQ && matchC;
    })
    .sort((a, b) => {
      if (sort === 'views')  return (b.views || 0) - (a.views || 0);
      if (sort === 'oldest') return a.created_at - b.created_at;
      return b.created_at - a.created_at;
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Explore Tokens</h1>
        <p className="text-dc-dim">{tokens.length} tokens listed across {[...new Set(tokens.map(t => t.chain))].length} chains</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-dc-muted pointer-events-none" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, symbol, or contract address..."
          className="input pl-11 h-12 text-[15px]" />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-dc-muted hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CHAINS.map(c => (
          <button key={c} onClick={() => setChain(c)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all capitalize ${
              chain === c
                ? 'bg-white text-black'
                : 'bg-dc-surface border border-dc-border text-dc-dim hover:text-white hover:border-dc-border2'
            }`}>
            {c !== 'all' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: chain === c ? '#000' : (CHAIN_DOTS[c] || '#888') }} />}
            {c}
          </button>
        ))}
        <div className="ml-auto">
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-dc-surface border border-dc-border text-dc-dim text-[12px] font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-dc-border2 hover:border-dc-border2 transition-colors cursor-pointer">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-bold text-white text-lg mb-2">No results</p>
          <p className="text-dc-dim text-sm">{query ? `Nothing matched "${query}"` : 'No tokens on this chain yet.'}</p>
          {query && <button onClick={() => setQuery('')} className="mt-4 btn-secondary">Clear search</button>}
        </div>
      ) : (
        <>
          <p className="text-[12px] text-dc-muted mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t, i) => <TokenCard key={t.id} token={t} index={i} />)}
          </div>
        </>
      )}
    </div>
  );
}
