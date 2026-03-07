"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

interface IBab {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  question_keys: string[];
  sub_category_key?: { name: string };
}

export default function BabListPage() {
  const [listBab, setListBab] = useState<IBab[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllBab = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/v1/bab');
      const res = await response.json();
      setListBab(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error('Error fetching bab:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBab();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <FadeInContainer>
        <FadeInItem>
          <header className="mb-12">
            <div className="h-1 w-12 bg-blue-600 rounded-full mb-4" />
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Kumpulan <span className="text-blue-600">Bab Soal</span>
            </h1>
            <p className="text-slate-500 mt-4 font-medium text-lg">
              Pilih bab untuk mengelola atau melihat daftar pertanyaan.
            </p>
          </header>
        </FadeInItem>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listBab.map((bab) => (
              <FadeInItem key={bab._id}>
                <div className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  {/* Subtle Decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[3rem] -z-10 group-hover:bg-blue-600/5 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</span>
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        {bab.question_keys?.length || 0} Soal
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                    {bab.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-1 h-4 bg-blue-200 rounded-full" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
                      Kategori: {bab.sub_category_key?.name || 'Umum'}
                    </p>
                  </div>

                  <Link 
                    href={`/attempt/${bab._id}`}
                    className="inline-flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95"
                  >
                    Buka Kumpulan Soal
                  </Link>
                </div>
              </FadeInItem>
            ))}
          </div>
        )}
      </FadeInContainer>
    </div>
  );
}