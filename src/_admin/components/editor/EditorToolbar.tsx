import React, { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { api } from '../../utils/api';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, Heading4,
  Quote, Code, SquareTerminal,
  List, ListOrdered,
  AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Video, Table as TableIcon, Palette,
  Undo, Redo, Eraser
} from 'lucide-react';

interface Props {
  editor: Editor;
}

export const EditorToolbar: React.FC<Props> = ({ editor }) => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState({ url: '', text: '', newTab: true });
  const [imgForm, setImgForm] = useState({ alt: '', caption: '', url: '' });
  const [imgTab, setImgTab] = useState<'upload' | 'url'>('upload');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [color, setColor] = useState('#E8611A');
  const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // گرفتن متن انتخاب‌شده فعلی
  const getSelectedText = () => {
    const { from, to, empty } = editor.state.selection;
    return empty ? '' : editor.state.doc.textBetween(from, to, ' ');
  };

  const togglePopover = (name: string) => {
    setOpenPopover((cur) => (cur === name ? null : name));
    if (name === 'link') {
      setLinkForm({ url: '', text: getSelectedText(), newTab: true });
    }
  };

  // بستن پاپ‌آپ هنگام کلیک بیرون
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // === اکشن‌ها ===
  const applyLink = () => {
    const { url, text, newTab } = linkForm;
    if (!url) return;
    // اگر متنی انتخاب شده فقط لینک را روی آن اعمال کن
    if (editor.state.selection.empty && text) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" ${newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`)
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: newTab ? '_blank' : null })
        .run();
    }
    setOpenPopover(null);
  };

  const insertImageFromUrl = () => {
    if (!imgForm.url) return;
    editor.chain().focus().setImage({ src: imgForm.url, alt: imgForm.alt }).run();
    if (imgForm.caption) {
      editor.chain().focus().setParagraph().insertContent(imgForm.caption).run();
    }
    setImgForm({ alt: '', caption: '', url: '' });
    setOpenPopover(null);
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api.postForm('/posts/upload-image', formData);
      if (!data.success) throw new Error(data.message || 'خطا در آپلود تصویر');
      editor.chain().focus().setImage({ src: data.url || (data.data && data.data.url), alt: imgForm.alt }).run();
      if (imgForm.caption) {
        editor.chain().focus().setParagraph().insertContent(imgForm.caption).run();
      }
      setImgForm({ alt: '', caption: '', url: '' });
      setOpenPopover(null);
    } catch (e: any) {
      alert(e.message || 'خطا در آپلود');
    } finally {
      setUploading(false);
    }
  };

  const insertYoutube = () => {
    if (!youtubeUrl) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
    setYoutubeUrl('');
    setOpenPopover(null);
  };

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setOpenPopover(null);
  };

  const applyColor = (c: string) => {
    editor.chain().focus().setColor(c).run();
    setOpenPopover(null);
  };

  const PRESET_COLORS = [
    '#0A0A0A', '#48484A', '#8E8E93', '#E8611A', '#E8741A',
    '#22C55E', '#3B82F6', '#A855F7', '#EF4444', '#EAB308',
    '#06B6D4', '#EC4899',
  ];

  // اگر غیرفعال نباشد ابزارهای تاریخ‌گذاری، ولیدیشن را رد می‌کند
  const btn = (
    label: React.ReactNode,
    onClick: () => void,
    isActive = false,
    title = '',
  ) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`editor-toolbar-btn ${isActive ? 'is-active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="editor-toolbar" ref={containerRef}>
      {/* ردیف اول: قالب‌بندی متن */}
      <div className="editor-toolbar-row">
        {btn(<Bold size={16} />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'پررنگ')}
        {btn(<Italic size={16} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'کج')}
        {btn(<UnderlineIcon size={16} />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'زیرخط')}
        {btn(<Strikethrough size={16} />, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'خط‌خورده')}
        <span className="editor-toolbar-sep" />
        {btn(<Heading1 size={16} />, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }), 'تیتر ۱')}
        {btn(<Heading2 size={16} />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'تیتر ۲')}
        {btn(<Heading3 size={16} />, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'تیتر ۳')}
        {btn(<Heading4 size={16} />, () => editor.chain().focus().toggleHeading({ level: 4 }).run(), editor.isActive('heading', { level: 4 }), 'تیتر ۴')}
        <span className="editor-toolbar-sep" />
        {btn(<Quote size={16} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'نقل قول')}
        {btn(<Code size={16} />, () => editor.chain().focus().toggleCode().run(), editor.isActive('code'), 'کد')}
        {btn(<SquareTerminal size={16} />, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), 'بلاک کد')}
      </div>

      {/* ردیف دوم: ساختار و درج */}
      <div className="editor-toolbar-row">
        {btn(<List size={16} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'لیست نقطه‌ای')}
        {btn(<ListOrdered size={16} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'لیست عددی')}
        <span className="editor-toolbar-sep" />
        {btn(<AlignRight size={16} />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'راست‌چین')}
        {btn(<AlignCenter size={16} />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'وسط‌چین')}
        {btn(<AlignLeft size={16} />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'چپ‌چین')}
        {btn(<AlignJustify size={16} />, () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }), 'متن دوطرف')}
        <span className="editor-toolbar-sep" />
        {btn(<LinkIcon size={16} />, () => togglePopover('link'), editor.isActive('link'), 'لینک')}
        {btn(<ImageIcon size={16} />, () => togglePopover('image'), false, 'تصویر')}
        {btn(<Video size={16} />, () => togglePopover('youtube'), false, 'ویدیو یوتیوب')}
        {btn(<TableIcon size={16} />, () => togglePopover('table'), false, 'جدول')}
        {btn(<Palette size={16} />, () => togglePopover('color'), false, 'رنگ متن')}
        <span className="editor-toolbar-sep" />
        {btn(<Undo size={16} />, () => editor.chain().focus().undo().run(), false, 'بازگشت')}
        {btn(<Redo size={16} />, () => editor.chain().focus().redo().run(), false, 'جلو')}
        {btn(<Eraser size={16} />, () => editor.chain().focus().unsetAllMarks().clearNodes().run(), false, 'پاک کردن قالب')}
      </div>

      {/* پاپ‌آپ لینک */}
      {openPopover === 'link' && (
        <div className="editor-popover" style={{ right: 0 }}>
          <label className="editor-popover-label">آدرس لینک (URL)</label>
          <input
            type="url"
            placeholder="https://..."
            value={linkForm.url}
            onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
            autoFocus
          />
          <label className="editor-popover-label">متن لینک</label>
          <input
            type="text"
            placeholder="متن نمایش داده شده"
            value={linkForm.text}
            onChange={(e) => setLinkForm({ ...linkForm, text: e.target.value })}
          />
          <label className="row-flex" style={{ marginBottom: '0.8rem' }}>
            <input
              type="checkbox"
              checked={linkForm.newTab}
              onChange={(e) => setLinkForm({ ...linkForm, newTab: e.target.checked })}
            />
            <span style={{ fontSize: '0.8rem' }}>باز شدن در تب جدید</span>
          </label>
          <button
            type="button"
            onClick={applyLink}
            style={{
              background: '#E8611A', color: '#fff', border: 'none', borderRadius: 8,
              padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, width: '100%',
              cursor: 'pointer',
            }}
          >
            ذخیره لینک
          </button>
        </div>
      )}

      {/* پاپ‌آپ تصویر */}
      {openPopover === 'image' && (
        <div className="editor-popover" style={{ right: 0, minWidth: 320 }}>
          <div className="tab-row">
            <button type="button" className={`tab-btn ${imgTab === 'upload' ? 'active' : ''}`} onClick={() => setImgTab('upload')}>آپلود تصویر</button>
            <button type="button" className={`tab-btn ${imgTab === 'url' ? 'active' : ''}`} onClick={() => setImgTab('url')}>از URL</button>
          </div>

          {imgTab === 'upload' ? (
            <div
              className="image-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleImageUpload(f);
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼</div>
              {uploading ? (
                <p style={{ fontSize: '0.85rem', color: '#8E8E93' }}>در حال آپلود…</p>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#48484A' }}>
                  تصویر را اینجا رها کنید یا کلیک کنید
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />
            </div>
          ) : (
            <>
              <label className="editor-popover-label">آدرس تصویر</label>
              <input
                type="url"
                placeholder="https://..."
                value={imgForm.url}
                onChange={(e) => setImgForm({ ...imgForm, url: e.target.value })}
              />
            </>
          )}

          <label className="editor-popover-label">متن جایگزین (Alt) — الزامی برای سئو</label>
          <input
            type="text"
            placeholder="توضیح تصویر برای موتور جستجو"
            value={imgForm.alt}
            onChange={(e) => setImgForm({ ...imgForm, alt: e.target.value })}
          />
          <label className="editor-popover-label">کپشن (اختیاری)</label>
          <input
            type="text"
            placeholder="توضیح زیر تصویر"
            value={imgForm.caption}
            onChange={(e) => setImgForm({ ...imgForm, caption: e.target.value })}
          />
          {imgTab === 'url' && (
            <button
              type="button"
              onClick={insertImageFromUrl}
              style={{
                background: '#E8611A', color: '#fff', border: 'none', borderRadius: 8,
                padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, width: '100%',
                cursor: 'pointer',
              }}
            >
              درج تصویر
            </button>
          )}
        </div>
      )}

      {/* پاپ‌آپ یوتیوب */}
      {openPopover === 'youtube' && (
        <div className="editor-popover" style={{ right: 0 }}>
          <label className="editor-popover-label">آدرس یا شناسه ویدیو یوتیوب</label>
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=... یا شناسه"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            onClick={insertYoutube}
            style={{
              background: '#E8611A', color: '#fff', border: 'none', borderRadius: 8,
              padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 600, width: '100%',
              cursor: 'pointer',
            }}
          >
            درج ویدیو
          </button>
        </div>
      )}

      {/* پاپ‌آپ جدول */}
      {openPopover === 'table' && (
        <div className="editor-popover" style={{ right: 0, minWidth: 'auto' }}>
          <div style={{ fontSize: '0.78rem', color: '#8E8E93', marginBottom: '0.4rem' }}>
            {tableSize.rows || 0} × {tableSize.cols || 0}
          </div>
          <div
            className="table-picker"
            onMouseLeave={() => setTableSize({ rows: 0, cols: 0 })}
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8) + 1;
              const col = (i % 8) + 1;
              const active = row <= tableSize.rows && col <= tableSize.cols;
              return (
                <div
                  key={i}
                  className={`table-picker-cell ${active ? 'active' : ''}`}
                  onMouseEnter={() => setTableSize({ rows: row, cols: col })}
                  onClick={() => insertTable(row, col)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* پاپ‌آپ رنگ */}
      {openPopover === 'color' && (
        <div className="editor-popover" style={{ right: 0 }}>
          <div className="color-grid">
            {PRESET_COLORS.map((c) => (
              <div
                key={c}
                className="color-swatch"
                style={{ background: c }}
                onClick={() => applyColor(c)}
                title={c}
              />
            ))}
          </div>
          <label className="editor-popover-label" style={{ marginTop: '0.6rem' }}>رنگ دلخواه (HEX)</label>
          <div className="row-flex">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: 40, height: 32, border: 'none', padding: 0 }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ flex: 1, margin: 0 }}
            />
            <button
              type="button"
              onClick={() => applyColor(color)}
              style={{
                background: '#E8611A', color: '#fff', border: 'none', borderRadius: 6,
                padding: '0.4rem 0.7rem', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              اعمال
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
