"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ShieldCheck, Droplets, Scale, ArrowUpRight, MapPin, Phone, Search } from 'lucide-react';

export default function Home() {
  const [daftarProduk, setDaftarProduk] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mengambil data dari Supabase saat halaman pertama kali dimuat
  useEffect(() => {
    const fetchProduk = async () => {
      const { data } = await supabase
        .from('produk_ikan')
        .select('*')
        .order('created_at', { ascending: false });
      
      setDaftarProduk(data || []);
      setIsLoading(false); // Matikan loading setelah data didapat
    };

    fetchProduk();
  }, []);

  // Logika Filter: Mencocokkan ketikan dengan nama atau kategori produk
  const filteredProduk = daftarProduk.filter((produk) =>
    produk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produk.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-950 scroll-smooth transition-colors duration-300">
      
      {/* SECTION 1: HERO / BERANDA */}
      <section id="beranda" className="bg-emerald-50 dark:bg-slate-900 relative overflow-hidden pt-10 pb-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center pt-8">
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
              <CheckCircle2 size={16} />
              <span>Kelompok Budidaya Ikan Lele Cibunar Lestari</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors">
              Pusat Budidaya <span className="text-emerald-700 dark:text-emerald-500">Lele Unggulan</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
              Menyediakan benih dan lele konsumsi berkualitas tinggi. Daging padat, lincah, dan bebas bau lumpur dari kolam terstandarisasi.
            </p>
            <div className="pt-4">
              <a href="#produk" className="bg-emerald-700 dark:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-800 dark:hover:bg-emerald-500 transition duration-300 block text-center md:inline-block">
                Lihat Stok Lele
              </a>
            </div>
          </div>
          
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl dark:shadow-emerald-900/20 z-10">
            <img 
              src="/foto-sekretariat.png" 
              alt="Tim Pokdakan Cibunar Lestari" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2: KEUNGGULAN BUDIDAYA */}
      <section id="tentang" className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Sistem Budidaya Cibunar Lestari</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">Menerapkan Standar Operasional Prosedur (SOP) yang ketat untuk menghasilkan lele yang aman dikonsumsi dan berkualitas tinggi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-emerald-800 transition group">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Droplets size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Manajemen Air Terjaga</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Sistem sirkulasi dan pembuangan amoniak yang rutin. Menghasilkan lele yang sehat dan bebas dari aroma bau lumpur.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-emerald-800 transition group">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Benih Tahan Penyakit</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Menggunakan indukan varietas unggul yang menghasilkan benih lincah, rakus, dan memiliki daya tahan tubuh kuat.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-emerald-800 transition group">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Scale size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Grading Presisi</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">Penyortiran ukuran dilakukan secara berkala. Menjamin pembeli mendapatkan lele dengan ukuran yang seragam.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: KATALOG PRODUK DINAMIS */}
      <section id="produk" className="bg-gray-50 dark:bg-slate-950 py-24 border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Katalog Lele Unggulan</h2>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">Daftar stok bibit dan lele konsumsi yang diperbarui langsung oleh pengurus kelompok tani melalui sistem data internal.</p>
          </div>

          {/* FITUR PENCARIAN (SEARCH BAR) */}
          <div className="max-w-md mx-auto mb-12 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400 dark:text-slate-500" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama atau kategori lele..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* FITUR ANIMASI LOADING SKELETON */}
            {isLoading ? (
              // Menampilkan 3 kartu loading kosong yang berkedip
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 animate-pulse">
                  <div className="h-56 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 mb-8"></div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredProduk.length > 0 ? (
              // Menampilkan Data Asli
              filteredProduk.map((produk) => (
                <div key={produk.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col border border-gray-100 dark:border-slate-800 group">
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    {produk.image_url ? (
                      <img src={produk.image_url} alt={produk.nama} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <span className="text-gray-400 dark:text-slate-500 font-medium">Tanpa Gambar</span>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {produk.kategori}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight transition-colors">{produk.nama}</h3>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md shrink-0 ${produk.ready ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'}`}>
                        {produk.ready ? 'Ready Stok' : 'PO / Habis'}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 grow leading-relaxed transition-colors">{produk.deskripsi}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5 transition-colors">Harga Estimasi</p>
                        <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400 transition-colors">{produk.harga}</span>
                      </div>
                      <a 
                        href={`https://wa.me/6281234567890?text=Halo%20Admin%20Cibunar%20Lestari,%20saya%20tertarik%20dengan%20${encodeURIComponent(produk.nama)}`}
                        target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold transition-all ${produk.ready ? 'bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-800 dark:hover:bg-emerald-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 pointer-events-none'}`}
                      >
                        <span>Pesan</span>
                        {produk.ready && <ArrowUpRight size={16} />}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Menampilkan pesan jika pencarian tidak ditemukan
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Maaf, tidak ada produk yang cocok dengan pencarian "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 4: KONTAK & LOKASI */}
      <section id="kontak" className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 bg-emerald-900 dark:bg-emerald-950 rounded-3xl p-8 md:p-12 text-white overflow-hidden transition-colors duration-300">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Hubungi Pusat Pokdakan</h2>
            <p className="text-emerald-100 dark:text-emerald-200/80 leading-relaxed">
              Tertarik bekerja sama, menyuplai restoran, atau membeli benih lele dalam partai besar? Silakan hubungi kontak admin atau kunjungi langsung area kolam kami.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-800 dark:bg-emerald-900 p-3 rounded-lg"><MapPin size={24} className="text-emerald-300" /></div>
                <div>
                  <h4 className="font-bold text-lg">Lokasi Kolam</h4>
                  <p className="text-emerald-100 dark:text-emerald-200/80 text-sm mt-1">Desa Cibunar, Kecamatan Kadungora, Kabupaten Garut, Jawa Barat</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-800 dark:bg-emerald-900 p-3 rounded-lg"><Phone size={24} className="text-emerald-300" /></div>
                <div>
                  <h4 className="font-bold text-lg">WhatsApp Admin</h4>
                  <p className="text-emerald-100 dark:text-emerald-200/80 text-sm mt-1">0812-3456-7890 (Menerima pesanan grosir & eceran)</p>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition shadow-lg text-center w-full md:w-auto"
            >
              Chat Sekarang via WhatsApp
            </a>
          </div>

          <div className="h-64 md:h-auto rounded-2xl overflow-hidden bg-emerald-800 dark:bg-emerald-900 border border-emerald-700/50 dark:border-emerald-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7918.692606579027!2d107.98031191267803!3d-7.085793109631071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b500006e53e7%3A0x669146e4b756f9f2!2sSekretariat%20budidaya%20kelompok%20ikan%20lele%20cibunar%20lestari!5e0!3m2!1sid!2sid!4v1781458775746!5m2!1sid!2sid" 
              className="w-full h-full border-0 grayscale dark:opacity-80 transition-all" 
              allowFullScreen={false} 
              loading="lazy">
            </iframe>
          </div>
        </div>
      </section>

    </div>
  );
}