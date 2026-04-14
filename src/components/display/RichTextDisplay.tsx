interface RichTextDisplayProps {
  content: string;
  isItalic?: boolean;
}

export default function RichTextDisplay({ content, isItalic = false }: RichTextDisplayProps) {
  if (!content) return null;

  return (
    <article 
      className={`
        prose prose-slate dark:prose-invert max-w-none 
        prose-headings:text-slate-900 dark:prose-headings:text-white
        prose-p:text-slate-900 dark:prose-p:text-slate-100
        prose-p:leading-relaxed my-4
        ${isItalic ? 'italic' : ''}
      `}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}