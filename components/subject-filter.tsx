"use client";

import type { SubjectPlan } from "@/lib/demo";

export function SubjectFilter({
  subjects,
  value,
  onChange,
}: {
  subjects: SubjectPlan[];
  value: string;
  onChange: (id: string) => void;
}) {
  const options = [{ id: "all", name: "All" }, ...subjects];

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
              active
                ? "bg-[#0D2F64] text-white"
                : "bg-white text-[#496a98] ring-1 ring-[#dfeaf7]"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
