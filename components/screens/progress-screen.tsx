"use client";

import { Check, Flame, RefreshCw } from "lucide-react";
import {
  addDays,
  dateKey,
  formatShort,
  minutesForKey,
  mondayOf,
  TODAY,
} from "@/lib/demo";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function ProgressScreen({
  streak,
  longest,
  averageMinutes,
  studiedKeys,
  studiedToday,
  todayMinutes,
}: {
  streak: number;
  longest: number;
  averageMinutes: number;
  studiedKeys: Set<string>;
  studiedToday: boolean;
  todayMinutes: number;
}) {
  const thisMonday = mondayOf(TODAY);
  const weeks = [addDays(thisMonday, -7), thisMonday];
  const lastSeven = Array.from({ length: 7 }, (_, index) =>
    addDays(TODAY, index - 6),
  );

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
          Progress
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
          Consistency, not a score
        </h1>
        <p className="mt-1 text-sm font-semibold text-stone-500">
          The habit is the result. Quiz points can wait until the exam.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <Metric icon label="Streak" value={`${streak}`} hint="days" />
        <Metric label="Longest" value={`${longest}`} hint="days" />
        <Metric label="Daily avg" value={`${averageMinutes}`} hint="min" />
      </div>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold">This week and last</h2>
          <p className="text-xs font-bold text-stone-400">
            Today {formatShort(TODAY)}
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {weeks.map((monday) => (
            <div key={dateKey(monday)}>
              <p className="mb-2 text-xs font-bold text-stone-400">
                Week of {formatShort(monday)}
              </p>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((label, index) => {
                  const day = addDays(monday, index);
                  const key = dateKey(day);
                  const isToday = key === dateKey(TODAY);
                  const isFuture = day.getTime() > TODAY.getTime();
                  const studied = studiedKeys.has(key) || (isToday && studiedToday);
                  const adjusted =
                    !isFuture &&
                    key === dateKey(addDays(TODAY, -1)) &&
                    !studied;

                  return (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-extrabold text-stone-400">
                        {label}
                      </span>
                      <span
                        className={`grid size-9 place-items-center rounded-2xl text-xs font-extrabold ${
                          studied
                            ? "bg-orange-500 text-white"
                            : adjusted
                              ? "bg-amber-100 text-amber-800"
                              : isToday
                                ? "bg-white text-orange-600 ring-2 ring-orange-400"
                                : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {studied ? (
                          <Check className="size-4" strokeWidth={3} />
                        ) : adjusted ? (
                          <RefreshCw className="size-3.5" />
                        ) : (
                          day.getDate()
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-stone-500">
          <li className="flex items-center gap-1.5">
            <span className="size-3 rounded-md bg-orange-500" /> Studied
          </li>
          <li className="flex items-center gap-1.5">
            <span className="grid size-3 place-items-center rounded-md bg-amber-100 text-amber-800">
              <RefreshCw className="size-2" />
            </span>
            Adjusted
          </li>
          <li className="flex items-center gap-1.5">
            <span className="size-3 rounded-md ring-2 ring-orange-400" /> Today
          </li>
        </ul>
      </section>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <h2 className="font-extrabold">Minutes, last 7 days</h2>
        <p className="mt-1 text-sm font-semibold text-stone-500">
          Short sessions count. Today&apos;s review is about{" "}
          {studiedToday ? todayMinutes : 12} minutes.
        </p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {lastSeven.map((day) => {
            const key = dateKey(day);
            const minutes =
              key === dateKey(TODAY)
                ? studiedToday
                  ? todayMinutes
                  : 0
                : minutesForKey(key);
            const height = minutes === 0 ? 8 : Math.max(16, minutes * 4);
            return (
              <div key={key} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-xl ${
                    minutes ? "bg-orange-400" : "bg-orange-100"
                  }`}
                  style={{ height }}
                />
                <span className="text-[10px] font-extrabold text-stone-400">
                  {day.toLocaleDateString("en-US", { weekday: "narrow" })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-orange-50 p-5 ring-1 ring-orange-100">
        <div className="flex items-center gap-2 font-extrabold text-orange-800">
          <Flame className="size-4" />
          Why there&apos;s no grade here
        </div>
        <p className="mt-2 text-sm leading-relaxed font-semibold text-orange-950/80">
          A perfect quiz the night before fades. {streak} days of small reviews
          stick around longer. Miss a day and we move those cards forward
          instead of resetting you to zero.
        </p>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-orange-100">
      <p className="flex items-center gap-1 text-[10px] font-extrabold tracking-wide text-stone-400 uppercase">
        {icon && <Flame className="size-3 text-orange-500" />}
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-stone-900">{value}</p>
      <p className="text-xs font-bold text-stone-400">{hint}</p>
    </div>
  );
}
