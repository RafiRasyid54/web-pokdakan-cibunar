"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Loader2, Image as ImageIcon, UploadCloud, X, Home, LogOut, Pencil, Save } from "lucide-react";
import Link from 'next/link';

interface Dokumentasi {
  id: number;
  judul: string;
  deskripsi: string;
  image_url: string;
  image_urls: any; 
  created_at: string;
}

export default function AdminDokumentasi() {
  const router = useRouter();
  const [list, setList] = useState<Dokumentasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // State Modal (Tambah)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // State Modal (Edit)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dokumentasi | null>(null);
  const [editJudul, setEditJudul] = useState("");
  const [editDeskripsi, setEditDeskripsi] = useState("");
  const [existingUrls, setExistingUrls] = useState<string[]>([]); // Foto yang sudah ada di DB
  const [newEditImageFiles, setNewEditImageFiles] = useState<File[]>([]); // Foto tambahan baru
  const [newEditPreviewUrls, setNewEditPreviewUrls] = useState<string[]>([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setCheckingAuth(false);
      fetchData();
    };
    checkUserAndFetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("dokumentasi").select("*").order("created_at", { ascending: false });
    if (!error) setList(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // ================= CREATE (TAMBAH) =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || imageFiles.length === 0) return alert("Judul dan minimal 1 Gambar wajib diisi!");
    setIsSubmitting(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('dokumentasi').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('dokumentasi').getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      const { error: dbError } = await supabase.from("dokumentasi").insert([{ 
        judul, 
        deskripsi, 
        image_url: uploadedUrls[0], 
        image_urls: uploadedUrls 
      }]);
      
      if (dbError) throw dbError;

      alert("Dokumentasi berhasil ditambahkan!");
      setJudul(""); setDeskripsi(""); setImageFiles([]); setPreviewUrls([]);
      setIsAddModalOpen(false);
      fetchData(); 
    } catch (error: any) {
      alert("Gagal memproses data: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= UPDATE (EDIT) =================
  const openEditModal = (item: Dokumentasi) => {
    setEditingItem(item);
    setEditJudul(item.judul);
    setEditDeskripsi(item.deskripsi || "");
    
    // Parse existing URLs safely
    const safeUrls = Array.isArray(item.image_urls) ? item.image_urls : (item.image_url ? [item.image_url] : []);
    setExistingUrls(safeUrls);
    
    setNewEditImageFiles([]);
    setNewEditPreviewUrls([]);
    setIsEditModalOpen(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewEditImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewEditPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (indexToRemove: number) => {
    setExistingUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeNewEditImage = (indexToRemove: number) => {
    setNewEditImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setNewEditPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJudul) return alert("Judul wajib diisi!");
    if (existingUrls.length === 0 && newEditImageFiles.length === 0) return alert("Minimal harus ada 1 foto!");
    
    setIsSubmitting(true);

    try {
      const newlyUploadedUrls: string[] = [];
      
      // Upload file baru (jika ada)
      for (const file of newEditImageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('dokumentasi').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('dokumentasi').getPublicUrl(filePath);
        newlyUploadedUrls.push(publicUrlData.publicUrl);
      }

      // Gabungkan foto lama yang disisakan + foto baru
      const finalUrls = [...existingUrls, ...newlyUploadedUrls];

      const { error: dbError } = await supabase.from("dokumentasi")
        .update({ 
          judul: editJudul, 
          deskripsi: editDeskripsi, 
          image_url: finalUrls[0], 
          image_urls: finalUrls 
        })
        .eq("id", editingItem!.id);
      
      if (dbError) throw dbError;

      alert("Dokumentasi berhasil diperbarui!");
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (error: any) {
      alert("Gagal memperbarui data: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE (HAPUS) =================
  const handleDelete = async (id: number, item: Dokumentasi) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus kegiatan dan seluruh fotonya?");
    if (!confirmDelete) return;

    try {
      const safeUrls = Array.isArray(item.image_urls) ? item.image_urls : [];
      const urlsToDelete = safeUrls.length > 0 ? safeUrls : (item.image_url ? [item.image_url] : []);
      
      const filePaths = urlsToDelete.map((url: string) => {
        const parts = url.split('/');
        return `galeri/${parts[parts.length - 1]}`;
      });

      if (filePaths.length > 0) {
        await supabase.storage.from('dokumentasi').remove(filePaths);
      }

      const { error } = await supabase.from("dokumentasi").delete().eq("id", id);
      if (error) throw error;
      fetchData(); 
    } catch (error: any) {
      alert("Gagal menghapus data: " + error.message);
    }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse font-semibold text-purple-700">Memuat Sistem...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-300">
      
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide">
            <Link href="/" className="text-slate-500 hover:text-emerald-700 transition flex items-center gap-2 font-bold shrink-0">
              <Home size={18} /> <span className="hidden sm:inline">Website</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 shrink-0"></div>
            <Link href="/admin/dashboard" className="font-bold text-slate-500 hover:text-emerald-600 py-5 shrink-0 transition">
              Katalog Produk
            </Link>
            <Link href="/admin/dokumentasi" className="font-bold text-purple-700 border-b-2 border-purple-700 py-5 shrink-0 transition">
              Galeri Dokumentasi
            </Link>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-lg shrink-0 ml-4">
            <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manajemen Galeri Kegiatan</h1>
            <p className="text-slate-500 mt-1">Pantau dan kelola seluruh arsip foto kegiatan Pokdakan.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition shadow-md whitespace-nowrap">
            <Plus size={20} /> Tambah Kegiatan
          </button>
        </div>

        {/* DESAIN CARD UI */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
        ) : list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {list.map((item) => {
              const safeUrls = Array.isArray(item.image_urls) ? item.image_urls : [];
              const thumbnail = safeUrls.length > 0 ? safeUrls[0] : item.image_url;
              const totalPhotos = safeUrls.length > 0 ? safeUrls.length : (item.image_url ? 1 : 0);

              return (
                <div key={item.id} className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                  
                  {/* Action Buttons (Edit & Delete) */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-transform hover:scale-105"
                      title="Edit Kegiatan"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, item)}
                      className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition-transform hover:scale-105"
                      title="Hapus Kegiatan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Gambar Full Lebar di Atas */}
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative">
                    {thumbnail ? (
                      <>
                        <img src={thumbnail} alt={item.judul} className="w-full h-full object-cover" />
                        {totalPhotos > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                            <ImageIcon size={14} /> +{totalPhotos} Foto
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={32} /></div>
                    )}
                  </div>

                  {/* Judul dan Deskripsi di Bawah */}
                  <div className="p-5 flex flex-col grow">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1">{item.judul}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                      {item.deskripsi || "Tidak ada deskripsi"}
                    </p>
                  </div>
                  
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
            <ImageIcon className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="font-semibold text-lg">Belum ada dokumentasi</p>
          </div>
        )}

      </div>

      {/* ================= MODAL TAMBAH ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Plus className="text-purple-600" /> Upload Kegiatan Baru</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Judul Kegiatan</label>
                  <input type="text" required value={judul} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setJudul(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi (Opsional)</label>
                  <textarea rows={3} value={deskripsi} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" onChange={e => setDeskripsi(e.target.value)} />
                </div>
                <div>
                  <label className="flex justify-between items-end text-sm font-bold text-slate-700 mb-2">
                    <span>Pilih Gambar (Bisa lebih dari 1)</span>
                    <span className="text-xs font-normal text-slate-400">Total: {previewUrls.length} foto</span>
                  </label>
                  
                  {previewUrls.length > 0 && (
                    <div className="flex overflow-x-auto gap-3 mb-4 pb-2 snap-x scroll-smooth scrollbar-none">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative w-28 flex-none aspect-square snap-start rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <UploadCloud className="w-6 h-6 text-slate-400" />
                      <p className="text-sm text-slate-500"><span className="font-bold text-purple-600">Klik untuk tambah foto</span></p>
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-1/3 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="w-2/3 py-3 font-bold text-white bg-purple-600 rounded-xl shadow-lg flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />} Upload {previewUrls.length > 0 ? `${previewUrls.length} Foto` : ''}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Pencil className="text-blue-500" /> Edit Kegiatan</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"><X size={20} /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Judul Kegiatan</label>
                  <input type="text" required value={editJudul} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setEditJudul(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi (Opsional)</label>
                  <textarea rows={3} value={editDeskripsi} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" onChange={e => setEditDeskripsi(e.target.value)} />
                </div>
                <div>
                  <label className="flex justify-between items-end text-sm font-bold text-slate-700 mb-2">
                    <span>Kelola Gambar</span>
                    <span className="text-xs font-normal text-slate-400">Total: {existingUrls.length + newEditPreviewUrls.length} foto</span>
                  </label>
                  
                  {/* Foto Tersimpan & Preview Foto Baru */}
                  {(existingUrls.length > 0 || newEditPreviewUrls.length > 0) && (
                    <div className="flex overflow-x-auto gap-3 mb-4 pb-2 snap-x scroll-smooth scrollbar-none p-1">
                      
                      {/* Foto Lama */}
                      {existingUrls.map((url, idx) => (
                        <div key={`old-${idx}`} className="relative w-28 flex-none aspect-square snap-start rounded-xl overflow-hidden border-2 border-emerald-100 group">
                          <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">Tersimpan</div>
                          <img src={url} alt="Existing" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                        </div>
                      ))}

                      {/* Foto Baru */}
                      {newEditPreviewUrls.map((url, idx) => (
                        <div key={`new-${idx}`} className="relative w-28 flex-none aspect-square snap-start rounded-xl overflow-hidden border-2 border-blue-200 group">
                          <div className="absolute top-0 left-0 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">Baru</div>
                          <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeNewEditImage(idx)} className="absolute top-1 right-1 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                        </div>
                      ))}

                    </div>
                  )}

                  <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                      <p className="text-sm text-slate-500"><span className="font-bold text-blue-600">Tambah foto baru</span></p>
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleEditFileChange} />
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-1/3 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="w-2/3 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-lg flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
// Note: Icon "Save" belum diimport di atas, mari kita tambahkan "Save" ke import lucide-react jika dibutuhkan, 
// namun untuk mencegah error, saya sudah mengubah tombol simpan menggunakan text saja atau icon yang sudah di-import. 
// Oops, let me just add it above conceptually: 
// import { Trash2, Plus, Loader2, Image as ImageIcon, UploadCloud, X, Home, LogOut, Pencil, Save } from "lucide-react";