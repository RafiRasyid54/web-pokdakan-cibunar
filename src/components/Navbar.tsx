"use client";

import Link from 'next/link';
import { Phone, Lock, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-white dark:bg-slate-950 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/#beranda" className="flex items-center gap-3 text-emerald-800 dark:text-emerald-400 hover:text-emerald-600 transition">
          <img src="/logo-cibunar.png" alt="Logo Cibunar Lestari" className="w-12 h-12 object-contain drop-shadow-sm" />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900 dark:text-white">Cibunar Lestari</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1">
              Pokdakan Ikan Lele
            </span>
          </div>
        </Link>

        {/* Akses Admin, Toggle Tema, & Kontak */}
        <div className="flex items-center gap-4">
          
          {/* Tombol Toggle Tema */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              title="Ganti Tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <Link href="/admin/login" className="text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition p-1" title="Masuk Admin Panel">
            <Lock size={18} />
          </Link>
          <a href="/#kontak" className="hidden md:flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-800 transition shadow-sm">
            <Phone size={18} />
            <span>Hubungi Admin</span>
          </a>
        </div>
      </div>
    </nav>
  );
}