'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Globe, Twitter, Send, MessageSquare, ChevronDown } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const CHAINS = ['solana','ethereum','base','bsc','polygon','avalanche','arbitrum','optimism','other'];

export default function SubmitPage() {
  const router = useRouter();
  const [user,    setUser]    = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    address: '', chain: 'solana', name: '', symbol: '',
    description: '', logo_url: null,
    website: '', twitter: '', telegram: '', discord: '',
  });
  const [dexLinks, setDexLinks] = useState([{ name: '', url: '' }]);

  useEffect(() => { setUser(localStorage.getItem('dexclaw_user') || ''); }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addDexLink    = () => setDexLinks(p => [...p, { name: '', url: '' }]);
  const removeDexLink = i  => setDexLinks(p => p.filter((_, idx) => idx !== i));
  const setDexLink    = (i, k, v) => setDexLinks(p => p.map((l, idx) => idx === i ? { ...l, [k]: v } : l));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { setError('Set a username first — click "List Token" in the navbar'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dex_links: dexLinks.filter(l => l.name && l.url), owner: user }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to list token'); return; }
      router.push(`/token/${data.token.address}`);
    } catch { setError('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-[11px] font-bold text-dc-muted uppercase tracking-widest mb-2">New Listing</p>
        <h1 className="text-3xl font-black text-white">List Your Token</h1>
        <p className="text-dc-dim text-sm mt-1">Add your token to the DexClaw registry. Free forever.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">

        {/* Logo */}
        <div className="card p-5">
          <h2 className="font-bold text-white text-sm mb-4">Token Logo</h2>
          <ImageUpload value={form.logo_url} onChange={v => set('logo_url', v)} label="Upload Logo" hint="PNG, JPG · 256×256 recommended" />
        </div>

        {/* Core info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-white text-sm">Token Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Contract Address *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="0x... or solana address" className="input" required />
            </div>
            <div>
              <label className="label">Chain *</label>
              <div className="relative">
                <select value={form.chain} onChange={e => set('chain', e.target.value)}
                  className="input appearance-none cursor-pointer pr-8">
                  {CHAINS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-dc-muted pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
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
              placeholder="What is your token about?" className="input resize-none h-24" maxLength={500} />
            <p className="text-[11px] text-dc-muted mt-1">{form.description.length}/500</p>
          </div>
        </div>

        {/* DEX Links */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-sm">DEX Buy Links</h2>
            <button type="button" onClick={addDexLink}
              className="text-[12px] text-dc-dim hover:text-white font-semibold flex items-center gap-1 transition-colors">
              <Plus size={12} /> Add
            </button>
          </div>
          <p className="text-[12px] text-dc-muted">Where can people buy? (Jupiter, Uniswap, Raydium…)</p>
          {dexLinks.map((l, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={l.name} onChange={e => setDexLink(i, 'name', e.target.value)}
                placeholder="DEX name" className="input w-32 shrink-0" />
              <input value={l.url} onChange={e => setDexLink(i, 'url', e.target.value)}
                placeholder="https://..." className="input flex-1" />
              {dexLinks.length > 1 && (
                <button type="button" onClick={() => removeDexLink(i)} className="text-dc-muted hover:text-red-400 transition-colors shrink-0">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Socials */}
        <div className="card p-5 space-y-3">
          <h2 className="font-bold text-white text-sm">Socials</h2>
          {[
            { key: 'website',  icon: Globe,         placeholder: 'https://yourtoken.xyz' },
            { key: 'twitter',  icon: Twitter,        placeholder: 'https://x.com/yourtoken' },
            { key: 'telegram', icon: Send,            placeholder: 'https://t.me/yourtoken' },
            { key: 'discord',  icon: MessageSquare,  placeholder: 'https://discord.gg/...' },
          ].map(({ key, icon: Icon, placeholder }) => (
            <div key={key} className="relative">
              <Icon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dc-muted pointer-events-none" />
              <input value={form[key]} onChange={e => set(key, e.target.value)}
                placeholder={placeholder} className="input pl-9" />
            </div>
          ))}
        </div>

        {error && (
          <div className="border border-red-500/30 bg-red-500/8 rounded-xl p-3 text-sm text-red-400">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-[15px]">
          {loading
            ? <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Listing...</>
            : <><Plus size={16} /> List Token</>
          }
        </button>
      </form>
    </div>
  );
}
