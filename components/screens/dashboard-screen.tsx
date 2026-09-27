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
  reminderEnabled,
  reminderTime,
  dailyGoal,
  backlogAdjusted,
  onToggleReminder,
  onTimeChange,
}: Readonly<{
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
  reminderEnabled: boolean;
  reminderTime: string;
  dailyGoal: number;
  backlogAdjusted: boolean;
  onToggleReminder: () => void;
  onTimeChange: (time: string) => void;
}>) {
  const visible =
    filter === "all" ? subjects : subjects.filter((subject) => subject.id === filter);
  const soonest = subjects[0];
  const cardsDue = visible.reduce((sum, subject) => sum + subject.dueToday, 0);
  const daysToSoonest = soonest ? Math.max(0, daysBetween(TODAY, soonest.examDate)) : 0;

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            All subjects
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#6d86a8]">
            Soonest exam first, so the close one stays in view.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 shrink-0 rounded-2xl border-[#c9dcf5] bg-white px-3 text-sm font-bold text-[#0D2F64]"
          onClick={onAdd}
        >
          <Plus />
          Plan
        </Button>
      </header>

      <SubjectFilter subjects={subjects} value={filter} onChange={onFilter} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-6">
        <div className="flex flex-col gap-4">
          {showMissed && !studiedToday && (
            <div className="flex gap-3 rounded-3xl border border-[#F6C74A]/50 bg-[#FFF8E4] p-4 text-[#102D52]">
              <p className="flex-1 text-sm leading-relaxed font-semibold">
                You missed yesterday — we spread that backlog across the remaining days,
                so today stays manageable instead of piling on extra cards.
              </p>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={onDismissMissed}
                className="grid size-8 shrink-0 place-items-center rounded-full text-[#c49212] hover:bg-[#fff1c4]"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <section className="rounded-[1.75rem] bg-white p-4 shadow-sm ring-1 ring-[#dfeaf7]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
                Daily pacing
              </p>
              <span className="rounded-full bg-[#eaf3ff] px-2 py-1 text-[10px] font-extrabold text-[#0D2F64]">
                {dailyGoal} cards
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#6d86a8]">
              {backlogAdjusted ? "Missed-day redistribution is active." : "Regular pacing is active."}
              {' '}The app keeps the load balanced against the exam date.
            </p>
            <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-[#F3F7FF] px-3 py-2 text-sm font-bold text-[#102D52]">
              <button
                type="button"
                onClick={onToggleReminder}
                className="flex items-center gap-2 text-left"
              >
                <span
                  className={`inline-flex h-5 w-9 items-center rounded-full p-1 transition-colors ${
                    reminderEnabled ? "bg-[#1B7EE9]" : "bg-[#c9dcf5]"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                      reminderEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
                <span>Reminder</span>
              </button>
              <input
                aria-label="Reminder time"
                type="time"
                value={reminderEnabled ? "07:30" : "00:00"}
                onChange={(event) => onTimeChange(event.target.value)}
                className="w-24 rounded-lg border border-[#dfeaf7] bg-white px-2 py-1 text-xs font-extrabold text-[#102D52]"
              />
            </div>
          </section>

          {soonest && filter === "all" && (
            <section className="rounded-[1.75rem] bg-gradient-to-br from-[#0D2F64] to-[#1B7EE9] p-5 text-white shadow-lg shadow-[#c5dcf7]">
              <p className="text-xs font-extrabold tracking-wide text-[#d7e9ff] uppercase">
                Next exam
              </p>
              <p className="mt-1 text-2xl font-extrabold">{soonest.name}</p>
              <p className="mt-1 text-sm font-semibold text-[#d7e9ff]">
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
            className="h-12 w-full rounded-2xl text-base font-extrabold shadow-md shadow-[#c5dcf7] lg:w-auto lg:min-w-64"
            onClick={onStart}
          >
            {studiedToday ? "Review again" : `Start Review · ${cardsDue} cards`}
          </Button>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
        {visible.map((subject, index) => {
          const daysLeft = Math.max(0, daysBetween(TODAY, subject.examDate));
          const noteCount = notes.filter((note) => note.subjectId === subject.id).length;
          const earliest = filter === "all" && index === 0;
          return (
            <li key={subject.id}>
              <button
                type="button"
                onClick={() => onOpen(subject.id)}
                className="w-full rounded-[1.75rem] bg-white p-4 text-left shadow-sm ring-1 ring-[#dfeaf7]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="min-w-0 font-extrabold break-words text-[#102D52]">{subject.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[#6d86a8]">
                      <CalendarDays className="size-3.5 text-[#1B7EE9]" />
                      {formatShort(subject.examDate)}
                    </p>
                  </div>
                  {earliest ? (
                    <span className="rounded-full bg-[#F6C74A] px-2 py-1 text-[10px] font-extrabold text-[#0D2F64]">
                      Soonest
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-[#1B7EE9]">
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
      </div>

      {visible.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#c9dcf5] bg-white p-6 text-center">
          <p className="font-extrabold">No subjects yet</p>
          <p className="mt-1 text-sm font-semibold text-[#6d86a8]">
            Add a plan with an exam date and it will sort itself into this list.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-[#dfeaf7]">
      <p className="text-[10px] font-extrabold tracking-wide text-[#8aa0bb] uppercase">
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
    <div className="rounded-2xl bg-[#eaf3ff] px-2 py-2">
      <dt className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-[#8aa0bb] uppercase">
        <Icon className="size-3 text-[#1B7EE9]" />
        {label}
      </dt>
      <dd className="text-sm font-extrabold text-[#102D52]">{value}</dd>
    </div>
  );
}
