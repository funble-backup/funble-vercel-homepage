"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/banners", label: "메인배너" },
  { href: "/admin/notices", label: "공지사항" },
  { href: "/admin/announce", label: "공시정보" },
  { href: "/admin/faq", label: "FAQ" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [envInfo, setEnvInfo] = useState<{ env: string; db: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/env").then((r) => r.json()).then(setEnvInfo).catch(() => {});
  }, []);

  // Login page doesn't use sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800">펀블 관리자</h1>
            {envInfo && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                envInfo.env === "PRD"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {envInfo.env}
              </span>
            )}
          </div>
          {envInfo && (
            <p className="text-[11px] text-gray-400 mt-1">DB: {envInfo.db}</p>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md text-left transition-colors"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
