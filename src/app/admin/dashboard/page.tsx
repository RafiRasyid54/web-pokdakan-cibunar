"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Trash2, Home, Package, CheckCircle, XCircle, Pencil, X } from 'lucide-react';
import Link from 'next/link';

export default function DashboardAdmin() {
  const router = useRouter();
  const [produkList, setProdukList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // STATE UNTUK FITUR EDIT (MODAL)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    nama: '',
    kategori: 'Lele Konsumsi (Pecel/Resto)',
    harga: '',
    deskripsi: '',
    image_url: '',
    ready: true,
  });

  // 1. Proteksi Halaman & Ambil Data
  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setCheckingAuth(false);
      fetchProduk();
    };
    checkUserAndFetchData();
  }, [router]);

  // 2. Fungsi Read Data
  const fetchProduk = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produk_ikan')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Gagal mengambil data:', error);
    } else {
      setProdukList(data || []);
    }
    setLoading(false);
  };

  // 3. Fungsi Delete Data
  const handleDelete = async (id: number, nama: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${nama}"?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from('produk_ikan').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus data: ' + error.message);
    } else {
      setProdukList(produkList.filter(item => item.id !== id));
    }
  };

  // 4. BUKA MODAL EDIT DAN ISI DATA LAMA
  const openEditModal = (produk: any) => {
    setEditingId(produk.id);
    setEditFormData({
      nama: produk.nama,
      kategori: produk.kategori,
      harga: produk.harga,
      deskripsi: produk.deskripsi,
      image_url: produk.image_url || '',
      ready: produk.ready,
    });
    setIsEditModalOpen(true);
  };

  // 5. FUNGSI UPDATE DATA KE SUPABASE
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const { error } = await supabase
      .from('produk_ikan')
      .update(editFormData)
      .eq('id', editingId);

    setIsUpdating(false);

    if (error) {
      alert('Gagal mengupdate data: ' + error.message);
    } else {
      // Update data di tabel lokal tanpa perlu refresh halaman
      setProdukList(produkList.map(item => 
        item.id === editingId ? { ...item, ...editFormData } : item
      ));
      setIsEditModalOpen(false); // Tutup modal
      alert('Data produk berhasil diperbarui!');
    }
  };

  // 6. Fungsi Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Hitung Statistik
  const totalProduk = produkList.length;
  const stokReady = produkList.filter(p => p.ready).length;
  const stokKosong = totalProduk - stokReady;

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="animate-pulse font-semibold text-emerald-700 dark:text-emerald-400">Memuat Sistem...</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-300">
      
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition flex items-center gap-2 font-semibold" title="Lihat Website Publik">
              <Home size={18} /> <span className="hidden sm:inline">Lihat Website</span>
            </Link>
            <div className="font-bold text-slate-800 dark:text-white border-l border-slate-200 dark:border-slate-700 pl-4">Dashboard Pokdakan</div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition bg-rose-50 dark:bg-rose-900/30 px-4 py-2 rounded-lg">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Manajemen Katalog</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Pantau dan kelola seluruh daftar benih maupun lele konsumsi.</p>
          </div>
          <Link href="/admin/tambah-produk" className="inline-flex items-center gap-2 bg-emerald-700 dark:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-800 dark:hover:bg-emerald-500 transition shadow-md whitespace-nowrap">
            <Plus size={20} /> Tambah Produk Baru
          </Link>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ... (Statistik tetap sama) ... */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400"><Package size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Produk</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalProduk}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl text-emerald-600 dark:text-emerald-400"><CheckCircle size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Stok Tersedia</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stokReady}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-xl text-rose-600 dark:text-rose-400"><XCircle size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Stok Kosong / PO</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stokKosong}</p>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-sm">
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Info Produk</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Kategori</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Harga</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">Memuat data dari database...</td></tr>
                ) : produkList.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">Belum ada produk yang ditambahkan.</td></tr>
                ) : (
                  produkList.map((produk) => (
                    <tr key={produk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                            {produk.image_url ? (
                              <img src={produk.image_url} alt={produk.nama} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">No Img</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{produk.nama}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{produk.deskripsi}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-700 dark:text-slate-300">{produk.kategori}</td>
                      <td className="p-4 font-semibold text-emerald-700 dark:text-emerald-400">{produk.harga}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${produk.ready ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'}`}>
                          {produk.ready ? 'Ready' : 'Habis'}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* TOMBOL EDIT */}
                          <button 
                            onClick={() => openEditModal(produk)}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
                            title="Edit Produk"
                          >
                            <Pencil size={18} />
                          </button>
                          {/* TOMBOL DELETE */}
                          <button 
                            onClick={() => handleDelete(produk.id, produk.nama)}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"
                            title="Hapus Produk"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ================= MODAL EDIT PRODUK ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Informasi Produk</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Edit */}
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Produk</label>
                  <input type="text" required value={editFormData.nama}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                    onChange={e => setEditFormData({...editFormData, nama: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
                  <select value={editFormData.kategori}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={e => setEditFormData({...editFormData, kategori: e.target.value})}>
                    <option value="Lele Konsumsi (Pecel/Resto)">Lele Konsumsi (Pecel/Resto)</option>
                    <option value="Benih / Bibit Lele">Benih / Bibit Lele</option>
                    <option value="Indukan Lele">Indukan Lele</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harga</label>
                  <input type="text" required value={editFormData.harga}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 font-bold border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                    onChange={e => setEditFormData({...editFormData, harga: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi</label>
                  <textarea required rows={3} value={editFormData.deskripsi}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    onChange={e => setEditFormData({...editFormData, deskripsi: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">URL Gambar</label>
                  <input type="url" value={editFormData.image_url}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                    onChange={e => setEditFormData({...editFormData, image_url: e.target.value})} />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                    <input type="checkbox" checked={editFormData.ready} 
                      onChange={e => setEditFormData({...editFormData, ready: e.target.checked})}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 rounded border-slate-300" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 select-none">
                      Stok Tersedia (Centang jika ready)
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons Modal */}
              <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)}
                  className="w-1/3 py-3 font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                  Batal
                </button>
                <button type="submit" disabled={isUpdating}
                  className="w-2/3 py-3 font-bold text-white bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-500 rounded-xl shadow-lg transition disabled:opacity-50 flex justify-center items-center">
                  {isUpdating ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}