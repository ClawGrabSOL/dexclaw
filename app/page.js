import Link from 'next/link';
import { getAllTokens } from '@/lib/db';
import TokenCard from '@/components/TokenCard';
import { Plus, Layers, TrendingUp, Shield, Zap } from 'lucide-react';

export const revalidate = 30;

export default async function HomePage() {
  const tokens = await getAllTokens();
  const recent  = tokens.slice(0, 6);
  const popular = [...tokens].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-tb-border">
        <div className="absolute inset-0 bg-gradient-to-br from-tb-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-tb-accent bg-tb-accent/10 border border-tb-accent/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-tb-accent animate-pulse" />
                {tokens.length} tokens listed
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-tb-text leading-tight mb-4 tracking-tight">
              The open DEX registry for every token
            </h1>
            <p className="text-tb-dim text-lg leading-relaxed mb-8">
              List your token, add DEX links, socials, and a buy button. No gatekeeping. Anyone can list, anyone can buy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/submit" className="btn-primary flex items-center gap-2">
                <Plus size={15} />
                List Your Token
              </Link>
              <Link href="/explore" className="btn-secondary flex items-center gap-2">
                <TrendingUp size={15} />
                Explore All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-tb-border bg-tb-surface/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Layers, title: 'List in 60 seconds', desc: 'Submit your contract address, name, logo and go live instantly.' },
            { icon: Zap,    title: 'Live prices',         desc: 'Real-time price, volume, and market cap pulled from DexScreener.' },
            { icon: Shield, title: 'You own it',          desc: 'Update your DEX links, description, and socials any time.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-tb-accent/10 border border-tb-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-tb-accent" />
              </div>
              <div>
                <p className="font-semibold text-tb-text text-sm mb-1">{title}</p>
                <p className="text-[13px] text-tb-dim leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">

        {/* Popular */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-tb-text text-lg flex items-center gap-2">
                <TrendingUp size={17} className="text-tb-accent" /> Most Viewed
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popular.map(t => <TokenCard key={t.id} token={t} />)}
            </div>
          </section>
        )}

        {/* Recently listed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-tb-text text-lg">Recently Listed</h2>
            {tokens.length > 6 && (
              <Link href="/explore" className="text-sm text-tb-accent hover:text-tb-accent2 transition-colors font-medium">
                View all →
              </Link>
            )}
          </div>
          {tokens.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-tb-accent/10 border border-tb-accent/20 flex items-center justify-center mx-auto mb-4">
                <Layers size={24} className="text-tb-accent" />
              </div>
              <p className="font-semibold text-tb-text mb-2">No tokens yet</p>
              <p className="text-sm text-tb-dim mb-5">Be the first to list your token.</p>
              <Link href="/submit" className="btn-primary inline-flex items-center gap-2">
                <Plus size={14} /> List First Token
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map(t => <TokenCard key={t.id} token={t} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
