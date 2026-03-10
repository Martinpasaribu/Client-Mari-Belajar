/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import SubCategoryCardCatalogs from "@/components/card/SubCategoryCardCatalogs";

export default function CatalogsPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/catalogs');
        // NestJS biasanya mengembalikan data dalam property .data jika menggunakan interceptor
        setSubCategories(data.data || data);
      } catch (error) {
        console.error("Gagal mengambil katalog", error);
      }
    };
    fetchData();
  }, []);

  const handleEnroll = async (subCategory: any) => {
    // subCategory di sini adalah objek lengkap dari item yang di-klik
    setLoading(true);
    try {
      /** * MENYESUAIKAN DENGAN CreateEnrollmentDto:
       * 1. user_key: Wajib ada (IsNotEmpty) dan harus MongoID.
       * 2. sub_category_key: MongoID dari item.
       * 3. enrollment_type: Harus sesuai Enum ['free', 'purchased', 'gift'].
       * 4. status: Harus sesuai Enum ['pending', 'success', 'expired', 'cancelled'].
       */
      const payload = {
        sub_category_key: subCategory.id || subCategory._id,
        user_key: "000000000000000000000000", // Dummy MongoID (akan di-overwrite oleh backend dari JWT)
        enrollment_type: subCategory.price > 0 ? 'purchased' : 'free',
        status: subCategory.price > 0 ? 'pending' : 'success',
        amountPaid: subCategory.price || 0,
        isActive: true
      };

      const { data } = await api.post('/enrollments/buy', payload);

      if (payload.status === 'success') {
        alert("Pendaftaran berhasil! Silakan cek Dashboard.");
      } else {
        alert("Pendaftaran pending. Silakan selesaikan pembayaran.");
      }

    } catch (error: any) {
      // Menangkap pesan error dari class-validator NestJS (biasanya berupa array)
      const errorData = error.response?.data;
      const errorMsg = Array.isArray(errorData?.message) 
        ? errorData.message.join(", ") 
        : errorData?.message || "Gagal melakukan enrollment";
      
      alert(errorMsg);
      console.error("Error detail:", errorData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-[100hv]">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
          Katalog <span className="text-primary">Materi</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">
          Temukan sub-kategori kuis yang ingin kamu kuasai.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.length > 0 ? (
          subCategories.map((item: any) => (
            <SubCategoryCardCatalogs
              key={item.id || item._id}
              {...item}
              loading={loading}
              onEnroll={() => handleEnroll(item)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">
              Memuat Katalog Materi...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}