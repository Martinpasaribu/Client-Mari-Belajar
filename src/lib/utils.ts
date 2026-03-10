/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (err: any): string => {
  if (err.response?.data?.message) {
    const msg = err.response.data.message;
    return Array.isArray(msg) ? msg[0] : msg;
  }
  return err.message || "An unexpected error occurred";
};