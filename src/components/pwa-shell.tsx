"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Download,
  FileText,
  Home,
  LockKeyhole,
  MonitorDown,
  Share,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const INSTALL_DISMISSED_KEY = "nfl-pwa-install-dismissed";
const INSTALL_ACCEPTED_KEY = "nfl-pwa-install-accepted";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type DeviceMode = "ios" | "android" | "desktop";

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rules", label: "Rules", icon: FileText },
  { href: "/teams", label: "Teams", icon: Shield },
  { href: "/commissioner", label: "Commish", icon: LockKeyhole },
];

const installSteps = [
  { title: "Step 1", copy: "Tap the Share button.", icon: Share },
  { title: "Step 2", copy: "Select \"Add to Home Screen.\"", icon: Smartphone },
  { title: "Step 3", copy: "Tap \"Add.\"", icon: Download },
];

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

function getDeviceMode(): DeviceMode {
  if (typeof navigator === "undefined") return "desktop";

  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return "ios";
  if (/android/.test(userAgent)) return "android";
  return "desktop";
}

export function PwaShell() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showFallbackBanner, setShowFallbackBanner] = useState(false);

  const canUseNativeInstall = Boolean(deferredPrompt);
  const shouldShowInstallUi = !isStandalone && !isDismissed;
  const showIosBanner = shouldShowInstallUi && deviceMode === "ios";
  const showAndroidFallback = shouldShowInstallUi && deviceMode === "android" && !canUseNativeInstall && showFallbackBanner;
  const showDesktopInstall = shouldShowInstallUi && deviceMode === "desktop" && canUseNativeInstall;

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
    const accepted = localStorage.getItem(INSTALL_ACCEPTED_KEY) === "true";
    const standalone = isStandaloneDisplay();

    setDeviceMode(getDeviceMode());
    setIsStandalone(standalone);
    setIsDismissed(standalone || accepted || dismissed);
    setShowFallbackBanner(false);

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const updateStandalone = () => setIsStandalone(isStandaloneDisplay());
    mediaQuery.addEventListener("change", updateStandalone);

    const beforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsDismissed(isStandaloneDisplay() || localStorage.getItem(INSTALL_ACCEPTED_KEY) === "true");
    };

    const appInstalled = () => {
      localStorage.setItem(INSTALL_ACCEPTED_KEY, "true");
      localStorage.removeItem(INSTALL_DISMISSED_KEY);
      setDeferredPrompt(null);
      setShowGuide(false);
      setShowFallbackBanner(false);
      setIsStandalone(true);
      setIsDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPrompt);
    window.addEventListener("appinstalled", appInstalled);

    const fallbackTimer = window.setTimeout(() => setShowFallbackBanner(true), 1800);

    return () => {
      mediaQuery.removeEventListener("change", updateStandalone);
      window.removeEventListener("beforeinstallprompt", beforeInstallPrompt);
      window.removeEventListener("appinstalled", appInstalled);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const dismissInstall = useCallback(() => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    setIsDismissed(true);
    setShowGuide(false);
  }, []);

  const openGuide = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (choice.outcome === "accepted") {
        localStorage.setItem(INSTALL_ACCEPTED_KEY, "true");
        localStorage.removeItem(INSTALL_DISMISSED_KEY);
        setIsDismissed(true);
        return;
      }
    }

    setShowGuide(true);
  }, [deferredPrompt]);

  return (
    <>
      {showIosBanner || showAndroidFallback ? (
        <section className="fixed inset-x-3 bottom-[calc(8.75rem+env(safe-area-inset-bottom))] z-[70] overflow-hidden rounded-md border border-white/15 bg-black/88 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.72)] backdrop-blur-2xl md:hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#00a3ff,#ffffff,#005cff)]" />
          <button
            type="button"
            aria-label="Dismiss install banner"
            onClick={dismissInstall}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-md border border-white/10 bg-white/10 text-chrome-200"
          >
            <X className="size-4" />
          </button>
          <div className="flex gap-3 pr-9">
            <Image src="/icons/icon-192.png" alt="" width={56} height={56} className="size-14 rounded-md border border-electric/35 object-cover shadow-electric" />
            <div className="min-w-0">
              <h2 className="font-[var(--font-oswald)] text-2xl font-bold uppercase leading-none text-white">
                🏈 Install National Franchise League
              </h2>
              <p className="mt-2 text-sm leading-6 text-chrome-300">
                Add National Franchise League to your Home Screen for the best experience.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button type="button" variant="electric" onClick={openGuide}>
              Install Now
            </Button>
            <Button type="button" variant="chrome" onClick={dismissInstall}>
              Maybe Later
            </Button>
          </div>
        </section>
      ) : null}

      {showDesktopInstall ? (
        <Button
          type="button"
          variant="electric"
          size="lg"
          onClick={openGuide}
          className="fixed bottom-5 right-5 z-[70] hidden shadow-[0_20px_70px_rgba(0,163,255,0.3)] md:inline-flex"
        >
          <MonitorDown className="size-5" />
          Install National Franchise League
        </Button>
      ) : null}

      {showGuide && !isStandalone ? (
        <div className="fixed inset-0 z-[80] grid place-items-end bg-black/70 p-3 backdrop-blur-sm md:place-items-center md:p-6">
          <section className="w-full max-w-lg overflow-hidden rounded-md border border-white/15 bg-[linear-gradient(180deg,#0b0e12,#05070a)] shadow-[0_28px_100px_rgba(0,0,0,0.82)]">
            <div className="relative border-b border-white/10 p-5">
              <button
                type="button"
                aria-label="Close install guide"
                onClick={() => setShowGuide(false)}
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-md border border-white/10 bg-white/10 text-chrome-200"
              >
                <X className="size-4" />
              </button>
              <Image src="/icons/icon-192.png" alt="" width={64} height={64} className="size-16 rounded-md border border-electric/35 object-cover shadow-electric" />
              <h2 className="mt-4 font-[var(--font-oswald)] text-3xl font-bold uppercase leading-none text-white">
                Install National Franchise League
              </h2>
              <p className="mt-3 max-w-md leading-7 text-chrome-300">
                It takes less than a minute to add the league app to your device.
              </p>
            </div>
            <div className="grid gap-3 p-5">
              {installSteps.map(({ title, copy, icon: Icon }) => (
                <article key={title} className="flex items-center gap-4 rounded-md border border-white/10 bg-white/[0.05] p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-electric text-black shadow-electric">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-[var(--font-oswald)] text-xl font-bold uppercase text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-chrome-300">{copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

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
    </>
  );
}
