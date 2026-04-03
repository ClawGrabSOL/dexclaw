'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Globe, Twitter, Send, MessageSquare, Link2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const CHAINS = ['solana','ethereum','base','bsc','polygon','avalanche','arbitrum','optimism','other'];

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser]   = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    address: '', chain: 'solana', name: '', symbol: '',
    description: '', logo_url: null,
    website: '', twitter: '', telegram: '', discord: '',
  });
  const [dexLinks, setDexLinks] = useState([{ name: '', url: '' }]);

  useEffect(() => { setUser(localStorage.getItem('dexclaw_user') || ''); }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addDexLink   = () => setDexLinks(p => [...p, { name: '', url: '' }]);
  const removeDexLink = i => setDexLinks(p => p.filter((_, idx) => idx !== i));
  const setDexLink   = (i, k, v) => setDexLinks(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { setError('Set a username first (click List Token in the navbar)'); return; }
    setLoading(true); setError('');
    try {
      const validLinks = dexLinks.filter(l => l.name && l.url);
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dex_links: validLinks, owner: user }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to list token'); return; }
      router.push(`/token/${data.token.address}`);
    } catch { setError('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-tb-text mb-1">List Your Token</h1>
        <p className="text-tb-dim text-sm">Add your token to the registry. Provide DEX links so anyone can buy.</p>
      </div>

      <form onSubmit={submit} className="space-y-6">

        {/* Logo */}
        <div className="card p-5">
          <h2 className="font-semibold text-tb-text mb-4">Token Logo</h2>
          <ImageUpload value={form.logo_url} onChange={v => set('logo_url', v)} label="Upload Logo" hint="PNG, JPG, GIF · 256×256 recommended" />
        </div>

        {/* Core info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-tb-text">Token Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Contract Address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="0x... or solana address" className="input" required />
            </div>
            <div>
              <label className="label">Chain *</label>
              <select value={form.chain} onChange={e => set('chain', e.target.value)} className="input">
                {CHAINS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Token Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Pepe Coin" className="input" required />
            </div>
            <div>
              <label className="label">Symbol *</label>
              <input value={form.symbol} onChange={e => set('symbol', e.target.value.toUpperCase())}
                placeholder="e.g. PEPE" className="input" required maxLength={12} />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Tell people what your token is about..."
              className="input resize-none h-24" maxLength={500} />
            <p className="text-[11px] text-tb-muted mt-1">{form.description.length}/500</p>
          </div>
        </div>

        {/* DEX Links */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-tb-text">DEX Links</h2>
            <button type="button" onClick={addDexLink}
              className="text-xs text-tb-accent hover:text-tb-accent2 font-semibold flex items-center gap-1 transition-colors">
              <Plus size={12} /> Add Link
            </button>
          </div>
          <p className="text-[12px] text-tb-dim">Add where people can buy your token (Jupiter, Uniswap, Raydium, etc.)</p>
          {dexLinks.map((l, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={l.name} onChange={e => setDexLink(i, 'name', e.target.value)}
                placeholder="DEX name e.g. Jupiter" className="input w-36 shrink-0" />
              <input value={l.url} onChange={e => setDexLink(i, 'url', e.target.value)}
                placeholder="https://jup.ag/swap/..." className="input flex-1" />
              {dexLinks.length > 1 && (
                <button type="button" onClick={() => removeDexLink(i)}
                  className="text-tb-muted hover:text-red-400 transition-colors shrink-0">
                  <X size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-tb-text">Socials & Links</h2>
          {[
            { key: 'website',  icon: Globe,          placeholder: 'https://yourtoken.xyz' },
            { key: 'twitter',  icon: Twitter,         placeholder: 'https://x.com/yourtoken' },
            { key: 'telegram', icon: Send,             placeholder: 'https://t.me/yourtoken' },
            { key: 'discord',  icon: MessageSquare,   placeholder: 'https://discord.gg/...' },
          ].map(({ key, icon: Icon, placeholder }) => (
            <div key={key} className="relative">
              <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tb-muted pointer-events-none" />
              <input value={form[key]} onChange={e => set(key, e.target.value)}
                placeholder={placeholder} className="input pl-9" />
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Listing...</>
          ) : (
            <><Plus size={16} /> List Token</>
          )}
        </button>
      </form>
    </div>
  );
}
