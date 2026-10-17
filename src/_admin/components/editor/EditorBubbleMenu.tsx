import React from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';

interface Props {
  editor: Editor;
}

export const EditorBubbleMenu: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  const btn = (label: string, onClick: () => void, isActive = false, title = '') => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`bubble-menu-btn ${isActive ? 'is-active' : ''}`}
    >
      {label}
    </button>
  );

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('آدرس لینک را وارد کنید:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const highlightYellow = () => {
    if (editor.isActive('highlight', { color: '#FEF08A' })) {
      editor.chain().focus().toggleHighlight().run();
    } else {
      editor.chain().focus().setHighlight({ color: '#FEF08A' }).run();
    }
  };

  const copySelection = async () => {
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // نادیده گرفتن خطای دسترسی به کلیپ‌بورد
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      // @ts-expect-error Type mismatch in newer tiptap version
      tippyOptions={{ duration: 150, placement: 'top' }}
      className="bubble-menu"
    >
      {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'پررنگ')}
      {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'کج')}
      {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'زیرخط')}
      {btn('S', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'خط‌خورده')}
      {btn('🔗', addLink, editor.isActive('link'), 'لینک')}
      {btn('🎨', highlightYellow, editor.isActive('highlight'), 'هایلایت')}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'تیتر ۲')}
      {btn('کپی', copySelection, false, 'کپی متن انتخاب شده')}
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
