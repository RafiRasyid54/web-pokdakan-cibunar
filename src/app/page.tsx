"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ShieldCheck, Droplets, Scale, ArrowUpRight, MapPin, Phone, Search, Calendar, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [daftarProduk, setDaftarProduk] = useState<any[]>([]);
  const [listDokumentasi, setListDokumentasi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [keunggulanIndex, setKeunggulanIndex] = useState(0);

  // STATE & DATA UNTUK AUTO-SLIDE HERO SECTION
  const [heroIndex, setHeroIndex] = useState(0);
  
  // Memasukkan Profil, Visi, Misi, Tujuan, dan Legalitas
  const heroContent = [
    {
      tag: "Profil Pokdakan",
      text: "Kelompok Budidaya Ikan Lele Cibunar Lestari hadir untuk meningkatkan profit pembudidaya di wilayah Cibunar-Cibatu dengan menyediakan benih dan lele konsumsi berkualitas tinggi."
    },
    {
      tag: "Visi Cibunar Lestari",
      text: "Menjadi pembudidaya yang konsisten dan berdedikasi dalam memberikan kualitas ikan Lele terbaik bagi pelanggan."
    },
    {
      tag: "Misi Cibunar Lestari",
      text: "Budidaya modern/millenial, pakan berstandar nutrisi, menciptakan lapangan kerja, meningkatkan taraf hidup, mengedukasi masyarakat, dan inovasi olahan Lele."
    },
    {
      tag: "Tujuan Cibunar Lestari",
      text: "Meningkatkan hasil produksi & ekonomi anggota, menjaga kualitas benih agar pembeli puas, kembali lagi, dan menjadi pelanggan setia."
    },
    {
      tag: "Legalitas Resmi",
      text: "Kami beroperasi di bawah payung hukum dan legalitas usaha yang resmi, menjamin keamanan serta kenyamanan bagi seluruh mitra dan pelanggan kami."
    }
  ];

  // DATA UNTUK CAROUSEL KEUNGGULAN BUDIDAYA
  const keunggulanData = [
    {
      icon: <Droplets size={28} />,
      title: "Manajemen Air Terjaga",
      desc: "Sistem sirkulasi dan pembuangan amoniak yang rutin. Menghasilkan lele yang sehat dan bebas dari aroma bau lumpur."
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Benih Tahan Penyakit",
      desc: "Menggunakan indukan varietas unggul yang menghasilkan benih lincah, rakus, dan memiliki daya tahan tubuh kuat."
    },
    {
      icon: <Scale size={28} />,
      title: "Grading Presisi",
      desc: "Penyortiran ukuran dilakukan secara berkala. Menjamin pembeli mendapatkan lele dengan ukuran yang seragam."
    }
  ];

  // Efek untuk menjalankan pergantian teks Hero otomatis setiap 7 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroContent.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroContent.length]);

  // Mengambil data produk & dokumentasi dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Ambil Produk
      const { data: produkData } = await supabase
        .from('produk_ikan')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Ambil Dokumentasi (Dibatasi 8 terbaru agar beranda tidak berat)
      const { data: dokData } = await supabase
        .from('dokumentasi')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      
      setDaftarProduk(produkData || []);
      setListDokumentasi(dokData || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Logika Filter Pencarian Produk
  const filteredProduk = daftarProduk.filter((produk) =>
    produk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produk.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-950 scroll-smooth transition-colors duration-300">
      
      {/* SECTION 1: HERO / BERANDA DENGAN CAROUSEL TEXT */}
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

            <div className="min-h-40 border-l-4 border-emerald-600 pl-4 flex flex-col justify-center transition-opacity duration-500 ease-in-out">
              <span className="text-sm uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                {heroContent[heroIndex].tag}
              </span>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
                "{heroContent[heroIndex].text}"
              </p>
              
              <div className="flex gap-2 mt-4">
                {heroContent.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${heroIndex === idx ? "w-6 bg-emerald-600" : "w-1.5 bg-gray-300 dark:bg-slate-700"}`} />
                ))}
              </div>
            </div>

            <div className="pt-2">
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

        <div className="relative max-w-2xl mx-auto">
          <div 
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-4"
            onScroll={(e) => setKeunggulanIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth))}
          >
            {keunggulanData.map((item, idx) => (
              <div key={idx} className="min-w-full snap-center px-1">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-emerald-800 transition group h-full flex flex-col items-center text-center">
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2.5 mt-4">
            {keunggulanData.map((_, idx) => (
              <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${keunggulanIndex === idx ? "w-7 bg-emerald-600" : "w-2 bg-gray-300 dark:bg-slate-700"}`} />
            ))}
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
            {isLoading ? (
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
              filteredProduk.map((produk) => (
                <div key={produk.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col border border-gray-100 dark:border-slate-800 group">
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    {produk.image_url && produk.image_url.trim() !== "" ? (
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
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Maaf, tidak ada produk yang cocok dengan pencarian "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3.5: CUPLIKAN DOKUMENTASI DENGAN DUKUNGAN BANYAK FOTO */}
      <section id="dokumentasi" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Galeri Kegiatan</h2>
            <p className="text-slate-600 dark:text-slate-400 transition-colors">Dokumentasi momen penting dan aktivitas budidaya di kelompok kami.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : listDokumentasi.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listDokumentasi.map((item) => {
              
              // LOGIKA BANYAK FOTO DI SINI
              const thumbnail = item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : item.image_url;
              const totalPhotos = item.image_urls ? item.image_urls.length : (item.image_url ? 1 : 0);

              return (
                <Link 
                  href={`/dokumentasi/${item.id}`}
                  key={item.id} 
                  className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                >
                  
                  {/* Bagian Atas: Gambar */}
                  <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    
                    {/* Badge Tanggal */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString("id-ID", { month: 'short', year: 'numeric' })}
                    </div>

                    {/* Badge Jumlah Foto (Muncul jika lebih dari 1 foto) */}
                    {totalPhotos > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1 shadow-sm">
                        <ImageIcon size={12} /> +{totalPhotos} Foto
                      </div>
                    )}
                  </div>

                  {/* Bagian Bawah: Teks */}
                  <div className="p-5 flex flex-col grow relative">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.judul}
                    </h3>
                    {item.deskripsi ? (
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {item.deskripsi}
                      </p>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-600 text-sm italic">
                        Tidak ada deskripsi.
                      </p>
                    )}
                    
                    {/* Tambahan Teks "Lihat Detail" agar lebih jelas bisa diklik */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat Selengkapnya <ArrowUpRight size={14} />
                    </div>
                  </div>

                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Belum ada dokumentasi.</p>
          </div>
        )}
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