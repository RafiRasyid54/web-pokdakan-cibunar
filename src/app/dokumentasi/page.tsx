"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FolderKanban, Image as ImageIcon, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link"; // JANGAN LUPA IMPORT INI

interface Dokumentasi {
  id: number;
  judul: string;
  deskripsi?: string;
  image_url: string;
  image_urls?: any; // PERBAIKAN: Ditambahkan dukungan array untuk banyak foto
  created_at: string;
}

export default function DokumentasiPage() {
  const [listDokumentasi, setListDokumentasi] = useState<Dokumentasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDokumentasi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("dokumentasi")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setListDokumentasi(data || []);
      }
      setLoading(false);
    };

    fetchDokumentasi();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 pt-10 min-h-screen">
      <header className="py-16 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800">
          <FolderKanban size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">Galeri Dokumentasi</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
          Arsip visual seluruh kegiatan dan momen penting Pokdakan Cibunar Lestari. Klik pada foto untuk melihat detail kegiatan.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : listDokumentasi.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listDokumentasi.map((item) => {
            
            // PERBAIKAN: Logika Safe Parsing untuk Cover Gambar dan Jumlah Foto
            const safeUrls = Array.isArray(item.image_urls) ? item.image_urls : [];
            const thumbnail = safeUrls.length > 0 ? safeUrls[0] : item.image_url;
            const totalPhotos = safeUrls.length > 0 ? safeUrls.length : (item.image_url ? 1 : 0);

            return (
              <Link 
                href={`/dokumentasi/${item.id}`}
                key={item.id} 
                className="group relative aspect-square overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer block"
              >
                <img 
                  src={thumbnail || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"} 
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold mb-2 uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(item.created_at).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-white text-base font-bold leading-tight shadow-sm mb-2 line-clamp-2">
                    {item.judul}
                  </h3>
                  
                  {/* Indikator "Baca Selengkapnya" */}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-auto pt-2 border-t border-white/20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    Lihat Detail <ArrowRight size={14} />
                  </div>
                </div>

                {/* Indikator Jumlah Foto di Pojok Kanan Atas */}
                <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-xl text-white opacity-100 group-hover:opacity-0 transition-opacity flex items-center gap-1.5 shadow-sm">
                  <ImageIcon size={14} /> 
                  {totalPhotos > 1 && <span className="text-[10px] font-bold">+{totalPhotos}</span>}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-400 font-medium">Belum ada dokumentasi di database.</p>
        </div>
      )}
    </div>
  );
}