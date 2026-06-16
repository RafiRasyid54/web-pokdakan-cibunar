"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
// Tambahkan ArrowLeft dari lucide-react dan Link dari next/link
import { Fish, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      alert('Akses Ditolak: Kredensial tidak valid.');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors duration-300 relative">
      
      {/* TOMBOL KEMBALI KE BERANDA (POJOK KIRI ATAS) */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 font-medium bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Website</span>
        </Link>
      </div>

      <div className="mb-8 text-center mt-12">
        <div className="bg-emerald-700 dark:bg-emerald-600 w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
          <Fish size={32} />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cibunar Lestari</h1>
        <p className="text-emerald-700 dark:text-emerald-400 font-semibold tracking-widest text-xs uppercase mt-1">Admin Portal</p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={20} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Otorisasi Akses</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Terdaftar</label>
            <input 
              type="email" 
              required 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@cibunarlestari.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 p-3.5 pr-12 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-700 dark:bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 dark:hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md mt-4">
            {loading ? 'Memvalidasi Sesi...' : 'Masuk ke Sistem'}
          </button>
        </form>
      </div>
    </div>
  );
}