import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const title = "펀블 - 생애 첫 건물은 펀블에서";
const description =
  "건물 투자를 가장 쉽게 하는 방법. 펀블에서 다양한 랜드마크 건물에 투자해보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "펀블",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 640,
        height: 336,
        alt: "FUNBLE 로고 — 건물 실루엣과 FUNBLE 워드마크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Spoqa Han Sans Neo', sans-serif" }}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
