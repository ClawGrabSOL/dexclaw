'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const path = usePathname();
  const [user, setUser]           = useState('');
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft]         = useState('');
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    setUser(localStorage.getItem('dexclaw_user') || '');
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const save = () => {
    const clean = draft.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 25);
    if (!clean) return;
    localStorage.setItem('dexclaw_user', clean);
    setUser(clean); setShowModal(false); setDraft('');
  };

  return (
    <>
      <nav className={`sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 transition-all duration-200 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-dc-border' : 'bg-dc-surface border-b border-dc-border'
      }`}>

        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <Image src="/dexclaw-logo.png" alt="DexClaw" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-black text-[15px] text-white tracking-tight">DexClaw</span>
          </Link>

          <div className="hidden sm:flex items-center gap-0.5">
            {[['/', 'Home'], ['/explore', 'Explore']].map(([href, label]) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  path === href
                    ? 'text-white bg-dc-card border border-dc-border'
                    : 'text-dc-dim hover:text-white hover:bg-dc-card'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/explore" className="btn-ghost sm:hidden p-2">
            <Search size={15} />
          </Link>
          {user ? (
            <>
              <button onClick={() => setShowModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dc-border text-[12px] text-dc-dim font-mono hover:border-dc-border2 hover:text-white transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                @{user}
              </button>
              <Link href="/submit" className="btn-primary py-2 px-3 text-[13px]">
                <Plus size={13} strokeWidth={2.5} />
                List Token
              </Link>
            </>
          ) : (
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-3 text-[13px]">
              <Plus size={13} />
              List Token
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-dc-card border border-dc-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                  <Image src="/dexclaw-logo.png" alt="DexClaw" width={26} height={26} className="object-contain" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-[15px]">Welcome to DexClaw</h2>
                  <p className="text-[11px] text-dc-dim">Token registry & DEX hub</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-dc-muted hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <label className="label">Username</label>
            <input value={draft} onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="e.g. cryptotrader" className="input mb-1" autoFocus />
            <p className="text-[11px] text-dc-muted mb-5">Letters, numbers, _ and - · 2–25 chars</p>
            <button onClick={save} className="btn-primary w-full justify-center">Let's Go</button>
          </div>
        </div>
      )}
    </>
  );
}
