"use client";

import { BookOpen, CalendarDays, Flame, Layers, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubjectFilter } from "@/components/subject-filter";
import {
  daysBetween,
  formatLong,
  formatShort,
  TODAY,
  type StudyNote,
  type SubjectPlan,
} from "@/lib/demo";

export function DashboardScreen({
  subjects,
  notes,
  filter,
  onFilter,
  onOpen,
  onAdd,
  showMissed,
  studiedToday,
  onDismissMissed,
  onStart,
}: {
  subjects: SubjectPlan[];
  notes: StudyNote[];
  filter: string;
  onFilter: (id: string) => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
  showMissed: boolean;
  studiedToday: boolean;
  onDismissMissed: () => void;
  onStart: () => void;
}) {
  const visible =
    filter === "all" ? subjects : subjects.filter((subject) => subject.id === filter);
  const soonest = subjects[0];
  const cardsDue = visible.reduce((sum, subject) => sum + subject.dueToday, 0);
  const daysToSoonest = soonest ? Math.max(0, daysBetween(TODAY, soonest.examDate)) : 0;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            All subjects
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Soonest exam first, so the close one stays in view.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-2xl border-orange-200 bg-white px-3 text-sm font-bold text-orange-700"
          onClick={onAdd}
        >
          <Plus />
          Plan
        </Button>
      </header>

      <SubjectFilter subjects={subjects} value={filter} onChange={onFilter} />

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

      {soonest && filter === "all" && (
        <section className="rounded-[1.75rem] bg-gradient-to-br from-orange-500 to-rose-500 p-5 text-white shadow-lg shadow-orange-200">
          <p className="text-xs font-extrabold tracking-wide text-orange-50 uppercase">
            Next exam
          </p>
          <p className="mt-1 text-2xl font-extrabold">{soonest.name}</p>
          <p className="mt-1 text-sm font-semibold text-orange-50">
            {formatLong(soonest.examDate)} · {daysToSoonest} day
            {daysToSoonest === 1 ? "" : "s"} left
          </p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Subjects" value={String(subjects.length)} />
        <Stat label="Due today" value={String(cardsDue)} />
        <Stat label="Notes" value={String(notes.length)} />
      </div>

      <Button
        className="h-12 rounded-2xl text-base font-extrabold shadow-md shadow-orange-200"
        onClick={onStart}
      >
        {studiedToday ? "Review again" : `Start Review · ${cardsDue} cards`}
      </Button>

      <ul className="flex flex-col gap-3">
        {visible.map((subject, index) => {
          const daysLeft = Math.max(0, daysBetween(TODAY, subject.examDate));
          const noteCount = notes.filter((note) => note.subjectId === subject.id).length;
          const earliest = filter === "all" && index === 0;
          return (
            <li key={subject.id}>
              <button
                type="button"
                onClick={() => onOpen(subject.id)}
                className="w-full rounded-[1.75rem] bg-white p-4 text-left shadow-sm ring-1 ring-orange-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-stone-900">{subject.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-stone-500">
                      <CalendarDays className="size-3.5 text-orange-500" />
                      {formatShort(subject.examDate)}
                    </p>
                  </div>
                  {earliest ? (
                    <span className="rounded-full bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white">
                      Soonest
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-orange-600">
                      {daysLeft}d
                    </span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <Mini icon={Layers} label="Cards" value={String(subject.dueToday)} />
                  <Mini icon={BookOpen} label="Notes" value={String(noteCount)} />
                  <Mini icon={Flame} label="Streak" value={`${subject.streak}d`} />
                </dl>
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-6 text-center">
          <p className="font-extrabold">No subjects yet</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Add a plan with an exam date and it will sort itself into this list.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-orange-100">
      <p className="text-[10px] font-extrabold tracking-wide text-stone-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-orange-50 px-2 py-2">
      <dt className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-stone-400 uppercase">
        <Icon className="size-3 text-orange-500" />
        {label}
      </dt>
      <dd className="text-sm font-extrabold text-stone-800">{value}</dd>
    </div>
  );
}
