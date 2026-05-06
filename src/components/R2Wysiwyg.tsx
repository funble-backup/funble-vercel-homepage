"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import DefaultEditor, {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
  useEditorState,
} from "react-simple-wysiwyg";

type Props = {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  minHeightPx?: number;
};

function ImageUploadButton() {
  const editorState = useEditorState();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastRangeRef = useRef<Range | null>(null);
  const [uploading, setUploading] = useState(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (uploading) return;

      const $el = editorState.$el;
      if ($el && document.activeElement !== $el) $el.focus();

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const r = sel.getRangeAt(0);
        if ($el && $el.contains(r.commonAncestorContainer)) {
          lastRangeRef.current = r.cloneRange();
        } else {
          lastRangeRef.current = null;
        }
      }

      inputRef.current?.click();
    },
    [editorState.$el, uploading]
  );

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = (await res.json()) as { url?: string; filename?: string };
        if (!data.url) throw new Error("Missing url");

        const $el = editorState.$el;
        if ($el) $el.focus();

        const saved = lastRangeRef.current;
        if (saved) {
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(saved);
          }
        }

        const safeAlt = (data.filename || file.name || "image")
          .replace(/"/g, "&quot;")
          .slice(0, 120);
        const html = `<img src="${data.url}" alt="${safeAlt}" style="max-width:100%;height:auto;" />`;
        document.execCommand("insertHTML", false, html);

        // Ensure editor emits change even if browser doesn't fire input.
        $el?.dispatchEvent(new Event("input", { bubbles: true }));
      } catch {
        alert("이미지 업로드에 실패했습니다.");
      } finally {
        setUploading(false);
      }
    },
    [editorState.$el]
  );

  const title = uploading ? "업로드 중..." : "이미지 업로드";

  return (
    <>
      <button
        className="rsw-btn"
        onMouseDown={onMouseDown}
        tabIndex={-1}
        title={title}
        type="button"
        aria-disabled={uploading}
        data-active={false}
        style={uploading ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
      >
        🖼️
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </>
  );
}

export default function R2Wysiwyg({ value, onChange, minHeightPx = 240 }: Props) {
  const editorStyle = useMemo(() => ({ minHeight: `${minHeightPx}px` }), [minHeightPx]);
  return (
    <DefaultEditor value={value} onChange={onChange} style={editorStyle}>
      <Toolbar>
        <BtnUndo />
        <BtnRedo />
        <Separator />
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikeThrough />
        <Separator />
        <BtnNumberedList />
        <BtnBulletList />
        <Separator />
        <BtnLink />
        <ImageUploadButton />
        <BtnClearFormatting />
        <HtmlButton />
        <Separator />
        <BtnStyles />
      </Toolbar>
    </DefaultEditor>
  );
}

