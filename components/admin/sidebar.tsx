"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  User,
  Contact as ContactIcon,
  Search,
  Mail,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/control", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/control/projects", label: "Проекты", icon: FolderKanban },
  { href: "/control/skills", label: "Навыки", icon: Sparkles },
  { href: "/control/experience", label: "Опыт", icon: Briefcase },
  { href: "/control/about", label: "Обо мне", icon: User },
  { href: "/control/contacts", label: "Контакты", icon: ContactIcon },
  { href: "/control/seo", label: "SEO", icon: Search },
  { href: "/control/messages", label: "Сообщения", icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="border-b border-border px-6 py-5">
        <Link href="/control" className="font-mono text-sm text-foreground">
          hamid<span className="text-accent">.</span>kazimov
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">Панель управления</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/control/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <LogOut className="size-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
