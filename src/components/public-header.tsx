"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Radio, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mainNavigationItems } from "@/lib/navigation";

const twitchHref = "https://www.twitch.tv/nationalfranchiseleague";

export function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  if (pathname.startsWith("/commissioner")) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-24 max-w-7xl items-center justify-between gap-5 px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-4" aria-label="National Franchise League home">
          <Image
            src="/league-logo.png"
            alt="National Franchise League logo"
            width={104}
            height={142}
            className="h-24 w-auto object-contain drop-shadow-[0_0_26px_rgba(0,163,255,0.42)]"
            priority
          />
          <div className="leading-none">
            <p className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white md:text-3xl">National</p>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-chrome-300">Franchise League</p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] text-chrome-200 xl:flex">
          {mainNavigationItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="relative transition after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-electric after:transition-all hover:text-white hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="electric" size="sm" className="hidden sm:inline-flex">
            <Link href="/apply">
              Join the League
            </Link>
          </Button>
          <Button asChild variant="electric" size="sm" className="hidden sm:inline-flex">
            <Link href={twitchHref} target="_blank" rel="noreferrer">
              <Radio className="size-4" />
              Live
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black/85 backdrop-blur-2xl xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-3 md:px-8">
            <Link
              href="/apply"
              onClick={() => setMenuOpen(false)}
              className="mb-2 rounded-md bg-electric px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:brightness-110"
            >
              Join the League
            </Link>
            {mainNavigationItems.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-chrome-200 transition last:border-0 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
