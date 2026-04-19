// hooks/useHelpQuestions

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const useQuestionShare = () => {
  const getQuestionLink = (questionId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/questions/help/${questionId}`;
  };

  const shareQuestion = async (questionId: string, questionText: string) => {
    const url = getQuestionLink(questionId);
    const text = `Mohon bantuannya! Saya kesulitan menjawab soal ini di Mari Belajar: \n\n"${questionText.substring(0, 100)}..."\n\nLihat soal lengkapnya di sini:`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Tanya Soal - Mari Belajar', text, url });
        return { success: true, method: 'native' };
      } catch (err) { return { success: false }; }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return { success: true, method: 'copy' };
    }
  };

  return { shareQuestion, getQuestionLink };
};