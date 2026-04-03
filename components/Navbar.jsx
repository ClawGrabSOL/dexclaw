'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Layers, Plus, Search, X } from 'lucide-react';

export default function Navbar() {
  const path = usePathname();
  const [user, setUser]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft]     = useState('');

  useEffect(() => {
    setUser(localStorage.getItem('dexclaw_user') || '');
  }, []);

  const save = () => {
    const clean = draft.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 25);
    if (!clean) return;
    localStorage.setItem('dexclaw_user', clean);
    setUser(clean);
    setShowModal(false);
    setDraft('');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 bg-tb-surface/80 backdrop-blur-sm border-b border-tb-border">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-tb-accent flex items-center justify-center">
              <Layers size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[15px] text-tb-text tracking-tight">DexClaw</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {[['/', 'Home'], ['/explore', 'Explore']].map(([href, label]) => (
              <Link key={href} href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  path === href ? 'text-tb-text bg-tb-card' : 'text-tb-dim hover:text-tb-text hover:bg-tb-card'
                }`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-xs text-tb-dim font-mono cursor-pointer hover:text-tb-text transition-colors"
                onClick={() => setShowModal(true)}>
                @{user}
              </span>
              <Link href="/submit" className="btn-primary flex items-center gap-1.5 py-2 px-3">
                <Plus size={13} strokeWidth={2.5} />
                <span>List Token</span>
              </Link>
            </>
          ) : (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 py-2 px-3">
              <Plus size={13} />
              List Token
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-tb-card border border-tb-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-tb-accent/15 border border-tb-accent/25 flex items-center justify-center">
                  <Layers size={15} className="text-tb-accent" />
                </div>
                <h2 className="font-bold text-tb-text">Welcome to DexClaw</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-tb-muted hover:text-tb-text transition-colors">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-tb-dim mb-4">Pick a username to list and manage tokens.</p>
            <label className="label">Username</label>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="e.g. trader99"
              className="input mb-1"
              autoFocus
            />
            <p className="text-[11px] text-tb-muted mb-4">Letters, numbers, _ and - · 2–25 chars</p>
            <button onClick={save} className="btn-primary w-full">Let's Go</button>
          </div>
        </div>
      )}
    </>
  );
}
