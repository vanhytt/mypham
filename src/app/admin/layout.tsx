"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, FileText, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Đừng render sidebar trong trang login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Quản lý Sản phẩm", href: "/admin", icon: Package },
    { name: "Quản lý Tin tức", href: "/admin/posts", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="font-playfair text-2xl font-bold tracking-widest text-[#1A365D]">
            INSULA
          </Link>
          <span className="ml-2 text-xs font-semibold text-white bg-[#1A365D] uppercase tracking-wider px-2 py-0.5 rounded-full">Admin</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#1A365D] text-white shadow-md shadow-[#1A365D]/20 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1A365D]"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-xl font-bold text-[#1A365D] tracking-tight">
            {navItems.find(i => pathname === i.href || pathname.startsWith(i.href + "/"))?.name || "Bảng điều khiển"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#1A365D] font-bold">
              AD
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
