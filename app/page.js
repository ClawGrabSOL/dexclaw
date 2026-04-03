import Link from 'next/link';
import Image from 'next/image';
import { getAllTokens } from '@/lib/db';
import TokenCard from '@/components/TokenCard';
import { Plus, TrendingUp, Shield, Zap, ArrowRight, Layers } from 'lucide-react';

export const revalidate = 30;

export default async function HomePage() {
  const tokens  = await getAllTokens();
  const recent  = tokens.slice(0, 6);
  const popular = [...tokens].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative border-b border-dc-border overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dc-border bg-dc-card text-[11px] font-bold text-dc-sub tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {tokens.length} TOKENS LISTED
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tighter mb-6">
              List. Trade.<br />
              <span className="text-dc-dim">Get noticed.</span>
            </h1>
            <p className="text-dc-dim text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              The open token registry. Submit your contract, add DEX links, and let anyone buy with one click. No gatekeeping.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/submit" className="btn-primary text-[15px] px-6 py-3">
                <Plus size={16} strokeWidth={2.5} />
                List Your Token
              </Link>
              <Link href="/explore" className="btn-secondary text-[15px] px-6 py-3">
                Explore All
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Logo watermark */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 hidden lg:block pointer-events-none select-none">
            <Image src="/dexclaw-logo.png" alt="" width={280} height={280} className="object-contain" />
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-dc-border bg-dc-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 gap-4">
          {[
            { label: 'Tokens Listed', value: tokens.length },
            { label: 'Total Views',   value: tokens.reduce((a, t) => a + (t.views || 0), 0).toLocaleString() },
            { label: 'Chains',        value: [...new Set(tokens.map(t => t.chain))].length || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
              <p className="text-[11px] text-dc-muted uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-dc-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Zap,      n: '01', title: 'List in 60 seconds',  desc: 'Submit your contract address, name, logo and go live instantly. No approval needed.' },
            { icon: TrendingUp, n: '02', title: 'Live DEX prices',   desc: 'Real-time price, volume, and market cap pulled from DexScreener automatically.' },
            { icon: Shield,   n: '03', title: 'You own the listing', desc: 'Update your DEX links, description, socials, and logo any time you want.' },
          ].map(({ icon: Icon, n, title, desc }) => (
            <div key={title} className="group flex flex-col gap-3 p-5 rounded-2xl border border-dc-border hover:border-dc-border2 bg-dc-surface hover:bg-dc-card transition-all">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-dc-card border border-dc-border flex items-center justify-center group-hover:border-dc-border2 transition-colors">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-4xl font-black text-dc-border2 group-hover:text-dc-border transition-colors select-none">{n}</span>
              </div>
              <p className="font-bold text-white">{title}</p>
              <p className="text-[13px] text-dc-dim leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        {/* Most viewed */}
        {popular.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-white text-xl flex items-center gap-2">
                <TrendingUp size={18} className="text-dc-dim" /> Most Viewed
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {popular.map((t, i) => <TokenCard key={t.id} token={t} index={i} />)}
            </div>
          </section>
        )}

        {/* Recently listed */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-white text-xl">Recently Listed</h2>
            {tokens.length > 6 && (
              <Link href="/explore" className="flex items-center gap-1 text-sm text-dc-dim hover:text-white transition-colors font-semibold">
                View all <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {tokens.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-dc-surface border border-dc-border flex items-center justify-center mx-auto mb-5">
                <Image src="/dexclaw-logo.png" alt="" width={40} height={40} className="object-contain opacity-60" />
              </div>
              <p className="font-bold text-white text-lg mb-2">No tokens yet</p>
              <p className="text-sm text-dc-dim mb-6 max-w-xs mx-auto">Be the first to list your token on DexClaw.</p>
              <Link href="/submit" className="btn-primary inline-flex">
                <Plus size={14} /> List First Token
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((t, i) => <TokenCard key={t.id} token={t} index={i} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
