'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Globe, Twitter, Send, MessageSquare, ExternalLink, Edit2, Check, X, Plus, TrendingUp, TrendingDown, Eye, Copy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

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
};

export default function TokenPage() {
  const { address } = useParams();
  const router = useRouter();
  const [token,   setToken]   = useState(null);
  const [price,   setPrice]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [user,    setUser]    = useState('');
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [copied,  setCopied]  = useState(false);
  const [draft,   setDraft]   = useState(null);

  useEffect(() => { setUser(localStorage.getItem('tokenbase_user') || ''); }, []);

  const load = useCallback(async () => {
    try {
      const [tr, pr] = await Promise.all([
        fetch(`/api/tokens/${address}`).then(r => r.ok ? r.json() : null),
        fetch(`/api/price/${address}`).then(r => r.ok ? r.json() : null),
      ]);
      if (!tr) { router.push('/'); return; }
      setToken(tr); setPrice(pr);
    } finally { setLoading(false); }
  }, [address]);

  useEffect(() => { load(); }, [load]);

  const startEdit = () => {
    setDraft({ ...token, dex_links: token.dex_links?.length ? [...token.dex_links] : [{ name: '', url: '' }] });
    setEditing(true); setError('');
  };

  const cancelEdit = () => { setEditing(false); setDraft(null); setError(''); };

  const saveEdit = async () => {
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/tokens/${address}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, dex_links: draft.dex_links.filter(l => l.name && l.url), owner: user }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      setToken(data.token); setEditing(false); setDraft(null);
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const setD = (k, v) => setDraft(p => ({ ...p, [k]: v }));
  const addDexLink    = () => setDraft(p => ({ ...p, dex_links: [...p.dex_links, { name: '', url: '' }] }));
  const removeDexLink = i  => setDraft(p => ({ ...p, dex_links: p.dex_links.filter((_, idx) => idx !== i) }));
  const setDexLink    = (i, k, v) => setDraft(p => ({ ...p, dex_links: p.dex_links.map((l, idx) => idx === i ? { ...l, [k]: v } : l) }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-tb-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!token) return null;

  const isOwner  = user && user === token.owner;
  const change   = price ? parseFloat(price.price_change_24h) : null;
  const isPos    = change !== null && change >= 0;
  const chainCls = CHAIN_COLORS[token.chain] || 'bg-tb-surface text-tb-dim border-tb-border';
  const t        = editing ? draft : token;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-tb-dim hover:text-tb-text transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Token header card */}
          <div className="card p-5">
            <div className="flex items-start gap-4">
              {/* Logo */}
              {editing ? (
                <ImageUpload value={draft.logo_url} onChange={v => setD('logo_url', v)} label="Logo" hint="" />
              ) : token.logo_url ? (
                <img src={token.logo_url} alt={token.symbol} className="w-16 h-16 rounded-2xl object-cover border border-tb-border shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-tb-accent/15 border border-tb-accent/25 flex items-center justify-center shrink-0">
                  <span className="text-tb-accent font-bold text-xl">{token.symbol?.slice(0,2)}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {editing ? (
                    <input value={draft.name} onChange={e => setD('name', e.target.value)}
                      className="input text-xl font-bold py-1 w-48" />
                  ) : (
                    <h1 className="text-xl font-extrabold text-tb-text">{token.name}</h1>
                  )}
                  <span className={`badge ${chainCls}`}>{token.chain}</span>
                  <span className="text-tb-dim font-mono text-sm">${editing
                    ? <input value={draft.symbol} onChange={e => setD('symbol', e.target.value.toUpperCase())} className="input py-0.5 w-20 inline font-mono" />
                    : token.symbol
                  }</span>
                </div>

                {/* Address */}
                <button onClick={copyAddress}
                  className="flex items-center gap-1.5 text-[11px] text-tb-muted hover:text-tb-text transition-colors font-mono mb-3">
                  {address.slice(0,8)}...{address.slice(-6)}
                  {copied ? <Check size={10} className="text-tb-green" /> : <Copy size={10} />}
                </button>

                {/* Description */}
                {editing ? (
                  <textarea value={draft.description} onChange={e => setD('description', e.target.value)}
                    className="input resize-none h-20 text-sm w-full" placeholder="Description..." maxLength={500} />
                ) : token.description ? (
                  <p className="text-sm text-tb-dim leading-relaxed">{token.description}</p>
                ) : null}
              </div>

              {/* Edit / Save buttons */}
              {isOwner && !editing && (
                <button onClick={startEdit} className="btn-ghost flex items-center gap-1.5 shrink-0">
                  <Edit2 size={13} /> Edit
                </button>
              )}
              {editing && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={cancelEdit} className="btn-ghost"><X size={14} /></button>
                  <button onClick={saveEdit} disabled={saving} className="btn-primary flex items-center gap-1.5 py-1.5 px-3">
                    {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={13} />}
                    Save
                  </button>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          </div>

          {/* DEX Links */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-tb-text">Buy on DEX</h2>
              {editing && (
                <button onClick={addDexLink} className="text-xs text-tb-accent font-semibold flex items-center gap-1 hover:text-tb-accent2 transition-colors">
                  <Plus size={12} /> Add
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-2">
                {draft.dex_links.map((l, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={l.name} onChange={e => setDexLink(i, 'name', e.target.value)}
                      placeholder="DEX name" className="input w-32 shrink-0" />
                    <input value={l.url} onChange={e => setDexLink(i, 'url', e.target.value)}
                      placeholder="https://..." className="input flex-1" />
                    <button onClick={() => removeDexLink(i)} className="text-tb-muted hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : token.dex_links?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {token.dex_links.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-tb-accent hover:bg-tb-accent2 transition-all text-white font-semibold text-sm active:scale-[.97]">
                    <span>Buy on {l.name}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
                {price?.dex_url && (
                  <a href={price.dex_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-tb-surface border border-tb-border hover:border-tb-border2 transition-all text-tb-dim hover:text-tb-text text-sm">
                    <span>View on DexScreener</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-tb-muted text-sm">
                {isOwner ? 'Click Edit to add DEX links.' : 'No DEX links added yet.'}
              </div>
            )}
          </div>

          {/* Socials edit */}
          {editing && (
            <div className="card p-5 space-y-3">
              <h2 className="font-semibold text-tb-text mb-2">Socials & Links</h2>
              {[
                { key: 'website',  icon: Globe,          placeholder: 'https://yourtoken.xyz' },
                { key: 'twitter',  icon: Twitter,         placeholder: 'https://x.com/yourtoken' },
                { key: 'telegram', icon: Send,             placeholder: 'https://t.me/yourtoken' },
                { key: 'discord',  icon: MessageSquare,   placeholder: 'https://discord.gg/...' },
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tb-muted pointer-events-none" />
                  <input value={draft[key] || ''} onChange={e => setD(key, e.target.value)}
                    placeholder={placeholder} className="input pl-9" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-5">

          {/* Price card */}
          <div className="card p-5">
            <p className="text-[11px] text-tb-muted uppercase tracking-wider mb-3">Live Price</p>
            {price ? (
              <div className="space-y-3">
                <div>
                  <p className="font-mono font-bold text-2xl text-tb-text">{fmt(price.price_usd)}</p>
                  {change !== null && (
                    <span className={`flex items-center gap-1 text-sm font-semibold font-mono mt-0.5 ${isPos ? 'positive' : 'negative'}`}>
                      {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isPos ? '+' : ''}{change.toFixed(2)}% (24h)
                    </span>
                  )}
                </div>
                <div className="space-y-2 border-t border-tb-border pt-3">
                  {[
                    ['Market Cap', fmt(price.market_cap)],
                    ['Volume 24h',  fmt(price.volume_24h)],
                    ['Liquidity',   fmt(price.liquidity)],
                    ['Txns 24h',    price.txns_24h?.toLocaleString() || '—'],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-tb-muted">{label}</span>
                      <span className="text-tb-text font-mono font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-tb-muted">No price data found on DexScreener.</p>
            )}
          </div>

          {/* Info */}
          <div className="card p-5 space-y-3">
            <p className="text-[11px] text-tb-muted uppercase tracking-wider">Info</p>
            <div className="flex justify-between text-sm">
              <span className="text-tb-muted">Chain</span>
              <span className={`badge ${chainCls}`}>{token.chain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tb-muted">Listed by</span>
              <span className="text-tb-text font-mono">@{token.owner}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tb-muted flex items-center gap-1"><Eye size={11} /> Views</span>
              <span className="text-tb-text">{token.views || 0}</span>
            </div>
          </div>

          {/* Socials (view mode) */}
          {!editing && (token.website || token.twitter || token.telegram || token.discord) && (
            <div className="card p-5 space-y-2">
              <p className="text-[11px] text-tb-muted uppercase tracking-wider mb-3">Community</p>
              {[
                { val: token.website,  icon: Globe,         label: 'Website' },
                { val: token.twitter,  icon: Twitter,        label: 'Twitter' },
                { val: token.telegram, icon: Send,            label: 'Telegram' },
                { val: token.discord,  icon: MessageSquare,  label: 'Discord' },
              ].filter(s => s.val).map(({ val, icon: Icon, label }) => (
                <a key={label} href={val} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-tb-dim hover:text-tb-text transition-colors py-1">
                  <Icon size={14} className="text-tb-muted" />
                  {label}
                  <ExternalLink size={10} className="ml-auto text-tb-muted" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
