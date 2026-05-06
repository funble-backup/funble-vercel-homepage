import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 공시 PDF 미러(public/announcements-pdfs)는 정적 자산으로만 배포하고,
  // 서버리스 번들 추적에는 넣지 않음(용량 한도 초과 방지).
  outputFileTracingExcludes: {
    "/*": ["./public/announcements-pdfs/**/*"],
  },
  images: {
    remotePatterns: [
      // Cloudflare R2 public development URL (r2.dev)
      { protocol: "https", hostname: "*.r2.dev" },
      // (Optional) custom CDN domains can be added here later if needed.
    ],
  },
};

export default nextConfig;
