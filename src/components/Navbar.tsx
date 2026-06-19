"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek untuk mengubah tampilan navbar saat di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang Kami', href: '#tentang' },
    { name: 'Produk', href: '#produk' },
    { name: 'Dokumentasi', href: '#dokumentasi' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800' 
          : 'bg-emerald-50 dark:bg-slate-900 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Judul (MENGGUNAKAN LOGO ASLI) */}
          <div className="shrink-0 flex items-center">
            <a href="#beranda" className="flex items-center gap-2.5 group">
              <img 
                src="/logo-cibunar.png" 
                alt="Logo Pokdakan Cibunar Lestari" 
                className="w-11 h-11 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                Cibunar <span className="text-emerald-600 dark:text-emerald-500">Lestari</span>
              </span>
            </a>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-700 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Order Sekarang
            </a>
          </div>

          {/* Tombol Hamburger Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div 
        className={`md:hidden absolute w-full bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-900 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 pb-2 px-4">
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center w-full bg-emerald-700 dark:bg-emerald-600 text-white px-5 py-3.5 rounded-xl font-bold hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors shadow-md"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}