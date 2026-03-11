/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/context/ToastContext";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthStore();
  const { showToast, updateToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Simpan ID toast loading agar bisa diupdate nanti
    // Sesuai interface: showToast(message, type)
    const toastId = showToast("Sedang memproses keluar...", "loading");

    try {
      setIsLoading(true);
      
      // 2. Simulasi delay proses
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Eksekusi pembersihan data
      logout();
      Cookies.remove("token");

      // 4. UPDATE TOAST (Bukan buat baru)
      // Begitu tipenya berubah dari 'loading' ke 'success', 
      // toast akan otomatis tertutup sendiri dalam 4 detik (sesuai logika provider-mu).
      updateToast(toastId, "Berhasil keluar dari sistem", "success");

      // 5. Redirect ke login
      router.push("/auth/login");
      
    } catch (error: any) {
      // Jika error, update toast loading tadi menjadi error
      updateToast(toastId, "Gagal logout, silakan coba lagi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
};