"use client";

import { CalendarCheck, Layers, LayoutDashboard, NotebookPen } from "lucide-react";
import { Brand } from "@/components/brand";
import type { Screen } from "@/lib/demo";

export type NavScreen = "dashboard" | "review" | "notes" | "progress";

const ITEMS: { id: NavScreen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "review", label: "Review", icon: Layers },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "progress", label: "Progress", icon: CalendarCheck },
];

export function BottomNav({
  screen,
  onChange,
}: Readonly<{
  screen: Screen;
  onChange: (screen: NavScreen) => void;
}>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#dfeaf7] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Brand compact />
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {ITEMS.map((item) => {
                const active = screen === item.id;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onChange(item.id)}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold transition-colors ${
                        active
                          ? "bg-[#eaf3ff] text-[#0d2f64]"
                          : "text-[#496a98] hover:bg-[#edf5ff] hover:text-[#0d2f64]"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={active ? 2.5 : 2} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfeaf7] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {ITEMS.map((item) => {
            const active = screen === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onChange(item.id)}
                  className={`flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 text-[11px] font-bold tracking-wide transition-colors ${
                    active
                      ? "text-[#0d2f64]"
                      : "text-[#6d86a8] hover:text-[#0d2f64]"
                  }`}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-xl ${
                      active ? "bg-[#eaf3ff]" : ""
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                  </span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
