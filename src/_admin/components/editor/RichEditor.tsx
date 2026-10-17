import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';

import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import './editor.css';

export interface RichEditorHandle {
  wordCount: number;
  charCount: number;
  headingCount: number;
}

export interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  focusKeyword?: string;
  placeholder?: string;
  minHeight?: number;
  /** هنگام تغییر آمار (کلمه/کاراکتر/تیتر) صدا زده می‌شود */
  onStatsChange?: (stats: RichEditorHandle) => void;
}

/** تبدیل اعداد انگلیسی به فارسی برای نمایش */
const toFa = (n: number): string =>
  n.toLocaleString('fa-IR');

/** محاسبه زمان مطالعه بر اساس ۲۰۰ کلمه در دقیقه */
const calcReadTime = (words: number): number => Math.max(1, Math.round(words / 200));

export const RichEditor: React.FC<RichEditorProps> = ({
  content,
  onChange,
  focusKeyword = '',
  placeholder = 'متن خود را بنویسید...',
  minHeight = 480,
  onStatsChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['right', 'center', 'left', 'justify'],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'editor-image' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
      CharacterCount,
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    autofocus: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose-editor',
        dir: 'rtl',
        lang: 'fa',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // همگام‌سازی محتوای خارجی با ویرایشگر (مثلاً هنگام لود اولیه/ریست)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // فقط زمانی که محتوا از بیرون عوض شده (نه از داخل خود ویرایشگر)
    if (content !== current && content !== undefined) {
      editor.commands.setContent(content || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  // گزارش آمار در هر آپدیت
  useEffect(() => {
    if (!editor || !onStatsChange) return;
    const report = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = editor.storage.characterCount?.characters() ?? text.length;
      let headings = 0;
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'heading') headings++;
        return true;
      });
      onStatsChange({ wordCount: words, charCount: chars, headingCount: headings });
    };
    report();
    editor.on('update', report);
    return () => {
      editor.off('update', report);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, onStatsChange]);

  // هایلایت کلمه کلیدی تمرکز در کل متن
  useEffect(() => {
    if (!editor) return;
    const kw = focusKeyword.trim();
    if (!kw) {
      // پاک کردن هرگونه هایلایت قبلی از نوع keyword
      return;
    }
    // جستجو در کل داکیومنت و اعمال هایلایت روی رخدادهای کلمه کلیدی
    const search = (editor.storage as any).search;
    if (search && typeof search.highlight === 'function') {
      search.highlight(kw, { class: 'keyword-highlight' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKeyword, editor]);

  const stats = useMemo<RichEditorHandle>(() => {
    if (!editor) return { wordCount: 0, charCount: 0, headingCount: 0 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = (editor.storage as any).characterCount?.characters() ?? text.length;
    let headings = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'heading') headings++;
      return true;
    });
    return { wordCount: words, charCount: chars, headingCount: headings };
  }, [editor]);

  if (!editor) {
    return <div className="editor-wrapper" style={{ minHeight }}>در حال بارگذاری ویرایشگر…</div>;
  }

  return (
    <div className="editor-wrapper">
      <EditorToolbar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} style={{ minHeight }} />
      <div className="editor-footer">
        کلمات: {toFa(stats.wordCount)}&nbsp;&nbsp;|&nbsp;&nbsp;کاراکترها:{' '}
        {toFa(stats.charCount)}&nbsp;&nbsp;|&nbsp;&nbsp;زمان مطالعه: ~{toFa(calcReadTime(stats.wordCount))} دقیقه
      </div>
    </div>
  );
};

export default RichEditor;
