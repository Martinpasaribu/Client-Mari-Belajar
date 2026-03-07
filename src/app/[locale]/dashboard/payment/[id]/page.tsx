/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script'; // Import untuk load script Midtrans
import api from '@/lib/axios';
import { 
  ChevronLeft, 
  Clock, 
  CreditCard, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/enrollments/${params.id}/status`);
        setEnrollment(data.data);
      } catch (err) {
        console.error("Gagal memuat detail pembayaran", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentDetail();
  }, [params.id]);

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      // 1. Ambil Snap Token dari Backend NestJS
      const { data } = await api.post(`/enrollments/${params.id}/pay`);
      
      // 2. Munculkan Popup Midtrans Snap
      (window as any).snap.pay(data.snapToken, {
        onSuccess: (result: any) => {
          console.log('Success:', result);
          router.push('/dashboard/modules'); // Redirect ke modul saya
        },
        onPending: (result: any) => {
          console.log('Pending:', result);
          alert('Selesaikan pembayaran anda di aplikasi payment terkait.');
        },
        onError: (result: any) => {
          console.log('Error:', result);
          alert('Pembayaran gagal, silakan coba lagi.');
          setIsProcessing(false);
        },
        onClose: () => {
          console.log('Customer closed the popup');
          setIsProcessing(false);
        }
      });
    } catch (err) {
      console.error("Gagal inisiasi pembayaran", err);
      alert("Terjadi kesalahan teknis. Coba lagi nanti.");
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg1 dark:bg-dark-bg1 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary-1" />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
        Menghubungkan ke Server Pembayaran...
      </p>
    </div>
  );

  if (!enrollment) return <div className="p-20 text-center text-white">Data transaksi tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-bg1 dark:bg-dark-bg1 transition-colors pb-20">
      {/* Load SDK Midtrans Snap secara dinamis */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <main className="max-w-2xl mx-auto px-6 pt-10">
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-1 font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali
        </button>

        <div className="bg-bg2 dark:bg-dark-bg2 border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          {/* STATUS HEADER */}
          <div className="bg-primary-1 p-10 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Invoice Pembelian</p>
              <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                <CreditCard size={28} /> Checkout
              </h1>
            </div>
            <Zap size={120} className="absolute -right-5 -bottom-5 text-white/10 rotate-12" />
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* ITEM DETAIL */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Modul Pembelajaran</p>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {enrollment.sub_category_key?.name || 'Paket Belajar'}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-3xl font-black text-primary-1 leading-none">
                    Rp {enrollment.amountPaid?.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            {/* TRUST BADGE */}
            <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-dark-bg1/50 rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Secure Payment by ClickUsaha Pathner</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enkripsi 256-bit Terenkripsi</p>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4 space-y-4">
              <button 
                onClick={handlePayNow}
                disabled={isProcessing}
                className={`w-full py-6 ${isProcessing ? 'bg-slate-400' : 'bg-primary-1'} text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-1/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Membuka Gateway...
                  </>
                ) : (
                  'Bayar Sekarang'
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-slate-400 italic">
                <Clock size={14} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Pilih Metode: QRIS, VA, atau E-Wallet</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-slate-500">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">Informasi</p>
          </div>
          <p className="text-[10px] font-bold text-center leading-relaxed max-w-xs opacity-60">
            Akses modul akan terbuka secara otomatis segera setelah pembayaran Anda berhasil diverifikasi oleh sistem.
          </p>
        </div>
      </main>
    </div>
  );
}