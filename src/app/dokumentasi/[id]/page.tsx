"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft, Calendar, Image as ImageIcon } from "lucide-react";

interface Dokumentasi {
  id: number;
  judul: string;
  deskripsi: string;
  image_url: string;
  image_urls: any; // PERBAIKAN: Diubah ke any agar tidak crash bila tipe data DB salah
  created_at: string;
}

export default function DetailDokumentasi() {
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<Dokumentasi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("dokumentasi")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) setItem(data);
      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  // PERBAIKAN: Menggabungkan logika foto lama dan baru dengan SAFE PARSING (Anti-Crash)
  const safeUrls = Array.isArray(item?.image_urls) ? item.image_urls : [];
  const photos = safeUrls.length > 0 ? safeUrls : (item?.image_url ? [item?.image_url] : []);
  const mainPhoto = photos.length > 0 ? photos[0] : null;
  const otherPhotos = photos.length > 1 ? photos.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Tombol Kembali */}
        <div className="mb-8">
          <Link href="/#dokumentasi" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl shadow-sm transition">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
            <div className="w-full h-96 sm:h-125 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>
        ) : item ? (
          <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
            <header className="mb-8 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                {item.judul}
              </h1>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm">
                <Calendar size={16} />
                {new Date(item.created_at).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </header>

            {/* FOTO UTAMA */}
            <div className="relative w-full h-80 sm:h-125 rounded-3xl overflow-hidden mb-6 bg-slate-100 border border-slate-200">
              {mainPhoto ? (
                <img src={mainPhoto} alt={item.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400"><ImageIcon size={48} /></div>
              )}
            </div>

            {/* FOTO-FOTO LAINNYA (SLIDER HORIZONTAL) */}
            {otherPhotos.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider pl-1">Foto Lainnya</h4>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  {otherPhotos.map((url, idx) => (
                    <div key={idx} className="relative w-64 sm:w-72 aspect-square flex-none snap-start rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:opacity-90 transition cursor-pointer group">
                       <img src={url} alt={`${item.judul} - foto ${idx+2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DESKRIPSI */}
            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white border-t border-slate-100 pt-8">
                <span className="w-8 h-1 bg-emerald-500 rounded-full inline-block"></span> Tentang Kegiatan Ini
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                {item.deskripsi || "Tidak ada deskripsi rinci untuk dokumentasi kegiatan ini."}
              </p>
            </div>
          </article>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Dokumentasi Tidak Ditemukan</h2>
            <Link href="/" className="text-emerald-600 font-bold hover:underline transition">Kembali ke Beranda</Link>
          </div>
        )}
      </div>
    </div>
  );
}