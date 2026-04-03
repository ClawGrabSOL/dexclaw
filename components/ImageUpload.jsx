'use client';
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

export default function ImageUpload({ value, onChange, label = 'Logo', hint = 'PNG, JPG · Max 2MB' }) {
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setLoading(true); setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Logo" className="w-20 h-20 rounded-xl object-cover border border-tb-border" />
          <button onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-tb-card border border-tb-border flex items-center justify-center text-tb-muted hover:text-tb-text transition-colors">
            <X size={10} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragging ? 'border-tb-accent bg-tb-accent/10' : 'border-tb-border hover:border-tb-border2 bg-tb-surface hover:bg-tb-card'
          }`}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => upload(e.target.files[0])} />
          {loading ? (
            <div className="w-5 h-5 border-2 border-tb-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ImageIcon size={20} className="text-tb-muted mb-1.5" />
              <span className="text-[11px] text-tb-muted text-center px-2">{label}</span>
            </>
          )}
        </div>
      )}
      {hint && !value && <p className="text-[11px] text-tb-muted mt-1.5">{hint}</p>}
      {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
