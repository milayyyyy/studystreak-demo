"use client";

import { CalendarCheck, House, Layers, LayoutDashboard, NotebookPen } from "lucide-react";
import type { Screen } from "@/lib/demo";

export type NavScreen = "home" | "dashboard" | "review" | "notes" | "progress";

const ITEMS: { id: NavScreen; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "review", label: "Review", icon: Layers },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "progress", label: "Progress", icon: CalendarCheck },
];

export function BottomNav({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: NavScreen) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-orange-100 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = screen === item.id;
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-bold tracking-wide transition-colors ${
                  active
                    ? "text-orange-600"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-xl ${
                    active ? "bg-orange-100" : ""
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
  );
}
