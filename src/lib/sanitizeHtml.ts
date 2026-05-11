import sanitizeHtmlLib from "sanitize-html";

/**
 * 서버(Vercel)에서도 안전하게 동작하는 HTML 정리.
 * isomorphic-dompurify(jsdom)는 CJS/ESM 이슈로 서버리스에서 실패할 수 있어
 * htmlparser2 기반의 sanitize-html을 사용합니다.
 */
export function sanitizeHtml(dirty: string): string {
  return sanitizeHtmlLib(dirty, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags,
    allowedAttributes: sanitizeHtmlLib.defaults.allowedAttributes,
    allowProtocolRelative: false,
  });
}
