/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppIcon from '@/provider/tools/AppIcon';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { ScaleIn } from "@/components/animations/MotionWrapper";
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast, updateToast } = useToast();

  const [formData, setFormData] = useState<any>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    gender: 'O',
    age: 18,
    title: '',
    goals: [], // Diubah jadi array untuk menampung multiple
    interested: [], // Diubah jadi array
  });

  const options = {
    gender: [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
      { label: 'Other', value: 'O' }
    ],
    title: ['Student', 'Designer', 'Developer', 'Job Seeker', 'Professional'],
    goals: ['BUMN', 'CPNS', 'UTBK', 'TOEFL', 'Promotion', 'Scholarship'],
    interested: ['Logic', 'Art', 'Language', 'Philosophy', 'Science', 'Coding']
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fungsi khusus untuk handle Chips (Max 3)
  const toggleChip = (name: string, value: string) => {
    const currentValues = [...formData[name]];
    const index = currentValues.indexOf(value);

    if (index > -1) {
      currentValues.splice(index, 1); // Hapus jika sudah ada
    } else if (currentValues.length < 3) {
      currentValues.push(value); // Tambah jika belum ada dan kurang dari 3
    }

    setFormData({ ...formData, [name]: currentValues });
  };

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

      // Jika belum step terakhir, hanya pindah step
      if (step < 3) return setStep(step + 1);
      
      setLoading(true);
      
      // 1. Deklarasikan toastId di luar try agar bisa diakses oleh catch
      let toastId: number = 0; 

      try {
        // 2. Tampilkan loading toast
        toastId = showToast("Sedang mendaftarkan akunmu...", "loading");

        // Kirim formData (goals & interested sudah dalam bentuk Array)
        await api.post('/auth/register', formData);

        // 3. Update menjadi success
        updateToast(toastId, "Registrasi berhasil! Silakan login.", "success");
              
        // Beri jeda sedikit agar user bisa melihat pesan sukses sebelum redirect
        setTimeout(() => {
          router.push('/auth/login?registered=true');
        }, 1500);

      } catch (error: any) {
        // 4. Ambil pesan error dari backend (termasuk validasi DNS email tadi)
        const errorMessage = error.response?.data?.message || 'Registrasi gagal, coba lagi nanti';
        
        // Jika toastId sempat terbuat, update menjadi error
        if (toastId) {
          updateToast(toastId, errorMessage, "error");
        } else {
          showToast(errorMessage, "error");
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-xl rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
           <div className="h-full bg-primary-1 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="text-center mb-10">
          <AppIcon size={80} variant='circle' className="mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">
            Join <span className="text-primary-1 text-3xl">Mari Belajar.</span>
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          
          {step === 1 && (
            <ScaleIn className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomInput label="Nama Depan" name="firstname" placeholder="Jhon" onChange={handleInputChange} value={formData.firstname} required />
                <CustomInput label="Nama Belakang" name="lastname" placeholder="Doe" onChange={handleInputChange} value={formData.lastname} />
              </div>
              <CustomInput label="Email" name="email" type="email" placeholder="nama@email.com" onChange={handleInputChange} value={formData.email} required />
              <CustomInput label="Password" name="password" type="password" placeholder="••••••••" onChange={handleInputChange} value={formData.password} required />
            </ScaleIn>
          )}

          {step === 2 && (
            <ScaleIn className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect label="Gender" name="gender" options={options.gender} onChange={handleInputChange} value={formData.gender} />
                <CustomInput label="Usia" name="age" type="number" onChange={handleInputChange} value={formData.age} />
              </div>
              <CustomSelect label="Pekerjaan" name="title" options={options.title} allowCustom onChange={handleInputChange} value={formData.title} />
            </ScaleIn>
          )}

          {step === 3 && (
            <ScaleIn className="space-y-6">
              <div className="space-y-3">
                <header>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Goals (Max 3)</label>
                  <p className="text-[9px] text-primary-1 font-bold italic">Apa target pencapaianmu?</p>
                </header>
                <div className="flex flex-wrap gap-2">
                  {options.goals.map(goal => (
                    <Chip 
                      key={goal} 
                      label={goal} 
                      selected={formData.goals.includes(goal)} 
                      onClick={() => toggleChip('goals', goal)} 
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <header>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minat Belajar (Max 3)</label>
                  <p className="text-[9px] text-primary-1 font-bold italic">Bidang apa yang kamu sukai?</p>
                </header>
                <div className="flex flex-wrap gap-2">
                  {options.interested.map(item => (
                    <Chip 
                      key={item} 
                      label={item} 
                      selected={formData.interested.includes(item)} 
                      onClick={() => toggleChip('interested', item)} 
                    />
                  ))}
                </div>
              </div>
            </ScaleIn>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-500 font-black uppercase text-[10px] tracking-widest">
                <ChevronLeft className="inline mr-1" size={16}/> Kembali
              </button>
            )}
            <button
              type="submit"
              disabled={loading || (step === 3 && (formData.goals.length === 0 || formData.interested.length === 0))}
              className="flex-[2] py-4 rounded-2xl bg-primary-1 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary-1/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : step === 3 ? 'Selesaikan Pendaftaran' : 'Lanjut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-komponen Chip
function Chip({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
        selected 
        ? 'bg-primary-1 border-primary-1 text-white shadow-md shadow-primary-1/20 scale-105' 
        : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-primary-1/50'
      }`}
    >
      {selected && <Check size={12} strokeWidth={3} />}
      {label}
    </button>
  );
}

function CustomInput({ label, ...props }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</label>
      <input {...props} className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm font-bold text-slate-800 dark:text-white outline-none" />
    </div>
  );
}

function CustomSelect({ label, options, allowCustom, name, onChange, value }: any) {
  const [isCustom, setIsCustom] = useState(false);
  
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
      {!isCustom ? (
        <select 
          name={name} 
          value={value}
          onChange={(e) => e.target.value === 'custom' ? setIsCustom(true) : onChange(e)}
          className="w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 p-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary-1 transition-all"
        >
          {options.map((opt: any) => {
            // Jika opsi adalah object {label, value}, gunakan value-nya
            const isObject = typeof opt === 'object';
            const val = isObject ? opt.value : opt;
            const lab = isObject ? opt.label : opt;
            
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
          {allowCustom && <option value="custom">+ Isi Sendiri...</option>}
        </select>
      ) : (
        <input 
          autoFocus 
          name={name} 
          placeholder={`Isi ${label}...`}
          onBlur={(e) => { if (e.target.value === '') setIsCustom(false); }}
          onChange={onChange}
          className="w-full rounded-2xl border border-primary-1 bg-white dark:bg-slate-800 p-4 text-sm font-bold text-slate-800 dark:text-white outline-none"
        />
      )}
    </div>
  );
}