// src/components/auth/SocialLogin.tsx
'use client';

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    // Arahkan langsung ke backend NestJS
    window.location.href = 'http://localhost:5002/api/v1/auth/google';
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full gap-2 p-2 border rounded-lg hover:bg-gray-50"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      <span>Masuk dengan Google</span>
    </button>
  );
}