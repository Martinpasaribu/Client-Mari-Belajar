/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  Receipt, 
  Search, 
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Loader2,
  Printer 
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
// Import wrapper animasi kita
import { FadeInContainer, FadeInItem } from "@/components/animations/MotionWrapper";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/enrollments/transactions/history');
      setTransactions(data.data || data);
    } catch (err) {
      console.error("Gagal memuat riwayat", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (trxId: string, orderId: string) => {
    try {
      setDownloadingId(trxId);
      const response = await api.get(`/enrollments/transactions/invoice/${trxId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Gagal mengunduh invoice. Silakan coba lagi.");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'settlement':
      case 'capture':
        return { label: 'Berhasil', color: 'text-emerald-500 bg-emerald-500/10', icon: <CheckCircle2 size={12} /> };
      case 'pending':
        return { label: 'Menunggu', color: 'text-amber-500 bg-amber-500/10', icon: <Clock size={12} /> };
      default:
        return { label: 'Gagal', color: 'text-rose-500 bg-rose-500/10', icon: <XCircle size={12} /> };
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-primary-1 w-10 h-10" />
    </div>
  );

  return (
    <FadeInContainer className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* HEADER */}
      <FadeInItem className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <Receipt className="text-primary-1" /> Riwayat Transaksi
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
            Pantau semua aktivitas pembayaran kamu
          </p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-1 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="CARI TRANSAKSI..." 
            className="bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-2xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-1/20 w-full md:w-64 transition-all"
          />
        </div>
      </FadeInItem>

      {/* LIST TRANSAKSI */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <FadeInItem>
            <div className="text-center py-20 bg-bg2 dark:bg-dark-bg2 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/5">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Belum ada transaksi</p>
            </div>
          </FadeInItem>
        ) : (
          transactions.map((trx) => {
            const status = getStatusStyle(trx.transaction_status);
            const isSuccess = ['settlement', 'capture'].includes(trx.transaction_status?.toLowerCase());
            
            return (
              <FadeInItem key={trx._id}>
                <div className="group bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 p-6 rounded-[2rem] hover:border-primary-1/50 transition-all flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary-1/5">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-14 h-14 bg-bg1 dark:bg-dark-bg1 rounded-2xl flex items-center justify-center text-primary-1 shrink-0 group-hover:scale-110 transition-transform">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">
                          {trx.enrollment_key?.sub_category_key?.name || 'Pembelian Modul'}
                        </h3>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(trx.createdAt), 'dd MMM yyyy', { locale: id })}</span>
                        <span className="flex items-center gap-1"><CreditCard size={12} /> {trx.payment_type?.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-white/5">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nominal</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white leading-none md:mr-4">
                        Rp {trx.amount?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {isSuccess && (
                        <button 
                          onClick={() => handleDownloadInvoice(trx._id, trx.order_id)}
                          disabled={downloadingId === trx._id}
                          title="Cetak Invoice"
                          className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50 active:scale-90"
                        >
                          {downloadingId === trx._id ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                        </button>
                      )}
                      <button 
                        title="Detail Transaksi"
                        className="w-10 h-10 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-full flex items-center justify-center hover:bg-primary-1 hover:text-white transition-all active:scale-90"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInItem>
            );
          })
        )}
      </div>
    </FadeInContainer>
  );
}