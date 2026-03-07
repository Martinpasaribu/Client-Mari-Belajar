const BASE_URL = 'http://localhost:5002/api/v1';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Nanti kita tambahkan logic ambil token di sini
    },
    ...options,
  });

  if (!response.ok) throw new Error('Gagal mengambil data');
  return response.json();
};