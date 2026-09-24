"use client";

import { Flame, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { SubjectFilter } from "@/components/subject-filter";
import { daysBetween, formatLong, formatShort, TODAY, type SubjectPlan } from "@/lib/demo";

export function HomeScreen({
  subject,
  examDate,
  streak,
  dueCount,
  redistributed,
  studiedToday,
  showMissed,
  onDismissMissed,
  onStart,
  onSetup,
  subjects,
  filter,
  onFilter,
}: {
  subject: string;
  examDate: Date;
  subjects: SubjectPlan[];
  filter: string;
  onFilter: (id: string) => void;
  streak: number;
  dueCount: number;
  redistributed: number;
  studiedToday: boolean;
  showMissed: boolean;
  onDismissMissed: () => void;
  onStart: () => void;
  onSetup: () => void;
}) {
  const daysLeft = Math.max(0, daysBetween(TODAY, examDate));
  const planDays = 30;
  const elapsed = Math.min(planDays, Math.max(0, planDays - daysLeft));
  const pace = Math.round((elapsed / planDays) * 100);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            StudyStreak
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
            Keep the flame going
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {subject} · exam {formatShort(examDate)}
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-2xl border-orange-200 bg-white px-3 text-sm font-bold text-orange-700"
          onClick={onSetup}
        >
          <Plus />
          Plan
        </Button>
      </header>

      <SubjectFilter subjects={subjects} value={filter} onChange={onFilter} />

      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-orange-500 via-orange-500 to-rose-500 p-5 text-white shadow-lg shadow-orange-200">
        <Flame className="absolute -top-3 -right-2 size-28 text-white/15" />
        <div className="flex items-center gap-2 text-sm font-bold text-orange-50">
          <Flame className="size-4" />
          Current streak
        </div>
        <p className="mt-2 text-5xl font-extrabold tracking-tight">{streak}</p>
        <p className="text-lg font-bold">
          {streak === 1 ? "day in a row" : "days in a row"}
        </p>
        <p className="mt-3 max-w-[16rem] text-sm font-semibold text-orange-50">
          {studiedToday
            ? "Today is on the board. Yesterday’s cards were folded in, and the streak held."
            : `Yesterday was redistributed, so the streak stays. Finish today and it becomes ${streak + 1}.`}
        </p>
      </section>

      {showMissed && !studiedToday && (
        <div className="flex gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <p className="flex-1 text-sm leading-relaxed font-semibold">
            You missed yesterday — no worries, we&apos;ve adjusted today&apos;s
            cards so you&apos;re still on track.
          </p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={onDismissMissed}
            className="grid size-8 shrink-0 place-items-center rounded-full text-amber-700 hover:bg-amber-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <p className="text-xs font-extrabold tracking-wide text-orange-500 uppercase">
          Today
        </p>
        {studiedToday ? (
          <>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900">
              Today&apos;s batch is done
            </h2>
            <p className="mt-2 text-sm font-semibold text-stone-500">
              {dueCount} cards reviewed. Tomorrow&apos;s set will be small again
              — that&apos;s the whole point.
            </p>
            <Button
              className="mt-4 h-12 w-full rounded-2xl text-base font-extrabold"
              onClick={onStart}
            >
              Review again
            </Button>
          </>
        ) : (
          <>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900">
              {dueCount} cards due today
            </h2>
            <p className="mt-2 text-sm font-semibold text-stone-500">
              {redistributed} of them moved over from yesterday, so the plan
              still lands before {formatLong(examDate)}.
            </p>
            <Button
              className="mt-4 h-12 w-full rounded-2xl text-base font-extrabold shadow-md shadow-orange-200"
              onClick={onStart}
            >
              Start Review
            </Button>
          </>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold tracking-wide text-stone-400 uppercase">
              Until the exam
            </p>
            <p className="mt-1 text-lg font-extrabold text-stone-900">
              {daysLeft === 0
                ? "Exam day"
                : `${daysLeft} day${daysLeft === 1 ? "" : "s"} to go`}
            </p>
          </div>
          <p className="text-sm font-bold text-orange-600">{pace}% paced</p>
        </div>
        <Progress value={pace} className="mt-3 w-full">
          <ProgressTrack className="h-3 w-full overflow-hidden rounded-full bg-orange-100">
            <ProgressIndicator className="bg-gradient-to-r from-orange-400 to-rose-500" />
          </ProgressTrack>
        </Progress>
        <p className="mt-3 text-sm font-semibold text-stone-500">
          A little every day beats one long night before {formatShort(examDate)}.
        </p>
      </section>
    </div>
  );
}
