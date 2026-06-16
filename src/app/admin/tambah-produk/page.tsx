"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TambahProduk() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Lele Konsumsi (Pecel/Resto)',
    harga: '',
    deskripsi: '',
    image_url: '',
    ready: true,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('produk_ikan').insert([formData]);
    setLoading(false);

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
    } else {
      alert('Berhasil! Data telah masuk ke katalog.');
      router.push('/#produk');
    }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse font-semibold text-emerald-700">Memuat Sistem...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Navigation Admin */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 hover:text-emerald-700 transition" title="Ke Beranda">
              <ArrowLeft size={20} />
            </Link>
            <div className="font-bold text-slate-800 border-l border-slate-200 pl-4">Panel Pengurus</div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition bg-rose-50 px-4 py-2 rounded-lg">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* BANNER FOTO SEKRETARIAT */}
        <div className="mb-8 relative rounded-3xl overflow-hidden h-48 md:h-72 shadow-md border border-slate-200 group">
          <img 
            src="/foto-sekretariat.png" 
            alt="Sekretariat Pokdakan Cibunar Lestari" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                Sistem Internal
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              Dashboard Cibunar Lestari
            </h1>
            <p className="text-emerald-50 mt-1 md:text-lg font-medium drop-shadow-md">
              Sekretariat Kelompok Budidaya Ikan Lele
            </p>
          </div>
        </div>
        
        {/* FORM INPUT PRODUK */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tambah Produk Baru</h2>
          <p className="text-slate-500 mt-1">Kelola informasi stok benih dan lele konsumsi ke dalam sistem.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Informasi Utama (Lebar) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Informasi Umum</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Produk / Jenis</label>
                  <input type="text" required placeholder="Misal: Benih Lele Sangkuriang 5-7cm"
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    onChange={e => setFormData({...formData, nama: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi & Spesifikasi</label>
                  <textarea required rows={5} placeholder="Tuliskan keunggulan, standar pakan, isi per kg, dll..."
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pengaturan & Media (Sempit) */}
          <div className="space-y-6">
            
            {/* Kartu Detail Operasional */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Lele</label>
                <select className="w-full bg-slate-50 text-slate-900 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({...formData, kategori: e.target.value})}>
                  <option value="Lele Konsumsi (Pecel/Resto)">Lele Konsumsi (Pecel/Resto)</option>
                  <option value="Benih / Bibit Lele">Benih / Bibit Lele</option>
                  <option value="Indukan Lele">Indukan Lele</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Harga Estimasi</label>
                <input type="text" required placeholder="Rp 24.000 / kg"
                  className="w-full bg-slate-50 text-emerald-700 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-semibold"
                  onChange={e => setFormData({...formData, harga: e.target.value})} />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition-colors">
                  <input type="checkbox" checked={formData.ready} onChange={e => setFormData({...formData, ready: e.target.checked})}
                    className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300 cursor-pointer" />
                  <span className="text-sm font-bold text-slate-700 select-none">
                    Stok Tersedia (Ready)
                  </span>
                </label>
              </div>
            </div>

            {/* Kartu Media / Gambar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-bold text-slate-700 mb-2">Tautan URL Gambar Produk</label>
              <input type="url" placeholder="https://..."
                className="w-full bg-slate-50 text-slate-900 border border-slate-200 p-3.5 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all mb-4 text-sm"
                onChange={e => setFormData({...formData, image_url: e.target.value})} />
              
              {/* Image Preview Box */}
              <div className="w-full h-40 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-2">
                    <ImageIcon size={32} />
                    <span className="text-xs font-semibold">Preview Gambar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Simpan */}
            <button type="submit" disabled={loading} 
              className="w-full flex justify-center items-center gap-2 bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200/50">
              <Save size={20} />
              {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}