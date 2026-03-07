import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white uppercase">APP<span className="text-primary">APP</span></span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            Platform edukasi digital terbaik untuk mengasah kemampuanmu dengan kuis interaktif dan materi berkualitas.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-6 uppercase text-xs tracking-widest">Navigasi</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><Link href="#" className="hover:text-primary">Beranda</Link></li>
            <li><Link href="#" className="hover:text-primary">Katalog Modul</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
            <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        © 2026 APPAPP Learning. Build with passion.
      </div>
    </footer>
  );
}