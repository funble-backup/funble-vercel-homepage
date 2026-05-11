import sanitizeHtmlLib from "sanitize-html";

/** 기본 허용 태그 + 공지/에디터에서 자주 쓰는 미디어·레거시 태그 */
const EXTRA_ALLOWED_TAGS = [
  "img",
  "picture",
  "source",
  "video",
  "audio",
  "track",
  "center",
  "font",
] as const;

/**
 * 서버(Vercel)에서도 안전하게 동작하는 HTML 정리.
 * isomorphic-dompurify(jsdom)는 CJS/ESM 이슈로 서버리스에서 실패할 수 있어
 * htmlparser2 기반의 sanitize-html을 사용합니다.
 *
 * 주의: sanitize-html 기본 allowedTags에는 `img`가 없어 이미지만 있는 본문이
 * 전부 비어 보일 수 있어, 미디어·레거시 태그를 추가합니다.
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  const input = dirty ?? "";
  return sanitizeHtmlLib(input, {
    allowedTags: [...sanitizeHtmlLib.defaults.allowedTags, ...EXTRA_ALLOWED_TAGS],
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      "*": ["class", "id", "title", "role"],
      a: ["href", "name", "target", "rel", "class", "title"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading", "class"],
      picture: ["class"],
      source: ["src", "srcset", "type", "media", "sizes"],
      video: ["src", "controls", "width", "height", "poster", "class", "preload", "playsinline"],
      audio: ["src", "controls", "class", "preload"],
      track: ["kind", "src", "srclang", "label"],
      font: ["color", "face", "size"],
    },
    allowProtocolRelative: false,
    // postcss 기반 인라인 style 검사는 환경에 따라 실패할 수 있어 끔(본문 전체가 비는 원인 방지)
    parseStyleAttributes: false,
  });
}
