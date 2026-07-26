"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, LockKeyhole, Shield } from "lucide-react";
import { useEffect } from "react";

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rules", label: "Rules", icon: FileText },
  { href: "/teams/nyg", label: "Teams", icon: Shield },
  { href: "/commissioner", label: "Commish", icon: LockKeyhole },
];

export function PwaShell() {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  return (
    <nav
      aria-label="Mobile app navigation"
      className="fixed inset-x-3 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-[60] grid grid-cols-4 rounded-md border border-white/15 bg-black/78 p-1.5 shadow-[0_18px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:hidden"
    >
      {mobileNavItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-bold uppercase tracking-[0.08em] transition ${
              isActive
                ? "bg-electric text-black shadow-electric"
                : "text-chrome-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
