"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addDays,
  daysBetween,
  formatInputDate,
  formatLong,
  TODAY,
} from "@/lib/demo";

export function OnboardingScreen({
  initialSubject,
  initialExam,
  onCancel,
  onCreate,
}: {
  initialSubject: string;
  initialExam: Date;
  onCancel: () => void;
  onCreate: (subject: string, examDate: Date) => void;
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [exam, setExam] = useState(formatInputDate(initialExam));
  const [built, setBuilt] = useState<{ subject: string; exam: Date } | null>(
    null,
  );
  const [error, setError] = useState("");

  function submit() {
    const name = subject.trim();
    if (!name) {
      setError("Add a subject so we know what to pace.");
      return;
    }
    const examDate = new Date(`${exam}T00:00:00`);
    if (Number.isNaN(examDate.getTime()) || examDate < TODAY) {
      setError("Pick an exam date that is today or later.");
      return;
    }
    setError("");
    setBuilt({ subject: name, exam: examDate });
  }

  if (built) {
    const span = Math.max(1, daysBetween(TODAY, built.exam));
    const perDay = Math.max(6, Math.min(12, Math.round(48 / Math.max(span, 1))));
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-[#0D2F64] to-[#1B7EE9] p-6 text-white shadow-lg shadow-[#c5dcf7]">
          <Flame className="size-8" />
          <h1 className="mt-4 text-2xl font-extrabold leading-tight">
            We&apos;ll break this into small daily reviews for you.
          </h1>
          <p className="mt-3 text-sm font-semibold text-[#d7e9ff]">
            {built.subject} is paced backward from {formatLong(built.exam)}.
            About {perDay} cards a day for {span} day{span === 1 ? "" : "s"} —
            short enough to finish between classes.
          </p>
        </div>
        <Button
          className="h-12 rounded-2xl text-base font-extrabold"
          onClick={() => onCreate(built.subject, built.exam)}
        >
          See today&apos;s plan
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
      <header>
        <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
          New plan
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          What are you studying for?
        </h1>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#6d86a8]">
          Tell us the subject and the exam date. StudyStreak splits the work
          into daily flashcards so you don&apos;t have to cram the night before.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-[#dfeaf7]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject" className="font-extrabold">
            Subject
          </Label>
          <Input
            id="subject"
            value={subject}
            placeholder="Biology Midterm"
            className="h-12 rounded-xl px-3 text-base"
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exam" className="font-extrabold">
            Exam date
          </Label>
          <Input
            id="exam"
            type="date"
            value={exam}
            min={formatInputDate(TODAY)}
            max={formatInputDate(addDays(TODAY, 365))}
            className="h-12 rounded-xl px-3 text-base"
            onChange={(event) => setExam(event.target.value)}
          />
        </div>
        {error && (
          <p className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
            {error}
          </p>
        )}
        <Button
          className="h-12 rounded-2xl text-base font-extrabold"
          onClick={submit}
        >
          Build my plan
        </Button>
        <Button
          variant="ghost"
          className="h-10 rounded-2xl font-bold text-[#6d86a8]"
          onClick={onCancel}
        >
          Back to Biology Midterm
        </Button>
      </div>
    </div>
  );
}
