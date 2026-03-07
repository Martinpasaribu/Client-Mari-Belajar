"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { History, Trophy, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
// Import wrapper animasi yang sudah kita buat sebelumnya
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

export default function HistorySidebar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/enrollments/my-history');
        // Pastikan pengecekan data sesuai dengan struktur response NestJS kamu
        if (res.data.success || res.data) {
          setHistory(res.data.data || res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Skeleton loading sederhana agar transisi tidak kasar
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <FadeInContainer className="flex flex-col gap-4">
      {/* Header Section */}
      <FadeInItem className="flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] text-slate-500">
          <History size={14} /> Riwayat Kuis
        </h3>
      </FadeInItem>

      <div className="space-y-3">
        {history.length === 0 ? (
          <FadeInItem>
            <p className="text-[10px] text-slate-400 px-2 italic">Belum ada aktivitas kuis.</p>
          </FadeInItem>
        ) : (
          history.map((item) => (
            <FadeInItem key={item._id}>
              <button
                onClick={() => {
                  const path = item.status === 'submitted' 
                    ? `/dashboard/history/result/${item._id}` 
                    : `/attempt/${item.bab_key?._id}`;
                  router.push(path);
                }}
                className="w-full text-left group bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-dark-primary-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-32">
                    {item.bab_key?.name || 'Bab Tidak Diketahui'}
                  </span>
                  {item.status === 'submitted' ? (
                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                      Lulus
                    </span>
                  ) : (
                    <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase animate-pulse">
                      Proses
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy size={12} className={item.status === 'submitted' ? "text-primary-2" : "text-slate-300"} />
                      <span className="text-lg font-black text-slate-800 dark:text-white">
                        {item.status === 'submitted' ? `${item.total_score || 0}%` : '--'}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium lowercase first-letter:uppercase">
                      {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id }) : '-'}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary-2 group-hover:text-white transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </button>
            </FadeInItem>
          ))
        )}
      </div>
    </FadeInContainer>
  );
}