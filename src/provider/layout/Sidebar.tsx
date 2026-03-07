"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, History, Settings, LogOut, HandCoins } from 'lucide-react';
import AppIcon from '../tools/AppIcon';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Modul Saya', icon: BookOpen, href: '/dashboard/modules' },
  { name: 'Riwayat Kuis', icon: History, href: '/dashboard/history' },
  { name: 'Riwayat Transaction', icon: HandCoins, href: '/dashboard/transactions' },
  { name: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col h-screen sticky top-0 transition-colors">
      <div className="p-2">

          <div className='w-full text-center'>
            <AppIcon 
              size={100} 
              variant='circle'
              className=" " 
            />
          </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-1 tracking-widest">Akun Pelajar</p>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">Siswa Bersemangat</p>
        </div>
      </div>
    </aside>
  );
}