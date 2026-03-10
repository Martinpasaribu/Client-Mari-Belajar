/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import SubCategoryCardCatalogs from "@/components/card/SubCategoryCardCatalogs";
import { FadeInContainer, FadeInItem, ScaleIn, BlurIn } from "@/components/animations/MotionWrapper";
import { BookOpen, Layers, LockOpen, Lock } from "lucide-react";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TakeCatalogsCard } from "@/components/card/TakeCatalogCard";

export default function CatalogsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- State untuk Modal Confirm ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/options');
        setCategories(res.data);
      } catch (error) {
        console.error("Gagal mengambil kategori", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const catalogUrl = selectedCategoryId === "all" 
        ? '/catalogs' 
        : `/catalogs/category/${selectedCategoryId}`;

      const [enrollRes, catalogRes] = await Promise.all([
        api.get('/enrollments/my-modules/all'),
        api.get(catalogUrl),
      ]);

      const enrolledIds = enrollRes.data.map((e: any) => e.sub_category_key?._id);
      const catalogData = catalogRes.data.data || catalogRes.data;
      const notOwned = catalogData.filter((c: any) => !enrolledIds.includes(c._id));
      
      setSubCategories(notOwned);
    } catch (error) {
      console.error("Gagal mengambil data katalog", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [selectedCategoryId]);

  // 1. Fungsi saat tombol di Card diklik
  const handleEnrollClick = (subCategory: any) => {
    setSelectedModule(subCategory);
    setShowConfirm(true);
  };

  // 2. Fungsi yang dijalankan saat tombol "Confirm" di Modal diklik
  const executeEnroll = async () => {
    if (!selectedModule) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        user_key: 'xxx',
        sub_category_key: selectedModule._id,
        enrollment_type: selectedModule.price > 0 ? 'purchased' : 'free',
        status: selectedModule.price > 0 ? 'pending' : 'success',
        amountPaid: selectedModule.price || 0,
        isActive: true
      };

      await api.post('/enrollments/buy', payload);
      
      setShowConfirm(false);
      
      // Jika gratis langsung refresh, jika berbayar arahkan ke invoice/dashboard
      if (payload.status === 'success') {
        alert("Pendaftaran Berhasil! Modul sudah tersedia di Dashboard.");
        fetchCatalogs(); // Refresh list
      } else {
        alert("Pendaftaran Pending. Silakan selesaikan pembayaran di Dashboard.");
        router.push('/dashboard/transactions'); 
      }
    } catch (error: any) {
      alert("Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* MODAL KONFIRMASI */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeEnroll}
        isLoading={isSubmitting}
        title={selectedModule?.price > 0 ? "Konfirmasi Pembelian?" : "Ambil Modul Gratis?"}
        description={
          selectedModule?.price > 0 
            ? `Anda akan mendaftar ke modul "${selectedModule?.name}". Lanjutkan ke pembayaran?`
            : `Apakah anda ingin mengambil modul "${selectedModule?.name}" secara gratis?`
        }
      />

      <div className="flex flex-col gap-4 mb-12">
        <FadeInItem>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1 mb-2">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Katalog Modul</span>
          </div>
          <BlurIn>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic">
              Pilih <span className="text-primary-1">Materi</span> Pelajaran
            </h1>
          </BlurIn>
        </FadeInItem>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-3 mb-12">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
            selectedCategoryId === "all" 
            ? "bg-slate-900 dark:bg-primary-1 text-white shadow-xl shadow-primary-1/20" 
            : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500"
          }`}
        >
          Semua
        </button>

        {categories.map((cat: any) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategoryId(cat._id)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              selectedCategoryId === cat._id
              ? "bg-slate-900 dark:bg-primary-1 text-white shadow-xl shadow-primary-1/20" 
              : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* GRID SECTION */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subCategories.length > 0 ? (
          subCategories.map((item: any) => (
            <ScaleIn key={item._id}>
              <TakeCatalogsCard
                item={item}
              />
            </ScaleIn>
          ))
        ) : (
          <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300">
              <BookOpen size={48} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic">
              {loading ? "Menyiapkan Materi..." : "Modul belum tersedia"}
            </p>
          </div>
        )}
      </div>

      )}
    </div>
  );
}