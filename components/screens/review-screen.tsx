"use client";

import { PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import type { Flashcard, SubjectPlan } from "@/lib/demo";

export function ReviewScreen({
  cards,
  index,
  flipped,
  gotIt,
  stillLearning,
  finished,
  onFlip,
  onRate,
  onRestart,
  onHome,
  eyebrow = "Daily review",
  returnLabel = "Back to dashboard",
  subjects = [],
}: {
  cards: Flashcard[];
  index: number;
  flipped: boolean;
  gotIt: number;
  stillLearning: number;
  finished: boolean;
  onFlip: () => void;
  onRate: (rating: "got" | "learning") => void;
  onRestart: () => void;
  onHome: () => void;
  eyebrow?: string;
  returnLabel?: string;
  subjects?: SubjectPlan[];
}) {
  function subjectName(card: Flashcard) {
    return (
      subjects.find((subject) => subject.cardIds.includes(card.id))?.name ??
      card.topic
    );
  }
  const total = cards.length;
  if (total === 0) {
    return (
      <div className="flex flex-col gap-4">
        <header>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subjects.length === 1 ? subjects[0].name : "This subject"}
          </h1>
        </header>
        <p className="text-sm font-semibold text-stone-500">
          No cards yet. Add a note and we’ll turn it into a small daily set.
        </p>
        <Button className="h-12 rounded-2xl text-base font-extrabold" onClick={onHome}>
          {returnLabel}
        </Button>
      </div>
    );
  }
  const position = Math.min(index + 1, total);
  const pace = finished ? 100 : Math.round((index / total) * 100);
  const card = cards[Math.min(index, total - 1)];
  if (!card) return null;

  if (finished) {
    return (
      <div className="flex flex-col gap-4">
        <header>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            {cards.every((item) => subjectName(item) === subjectName(card))
              ? subjectName(card)
              : "All subjects"}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            Session complete
          </h1>
        </header>
        <section className="rounded-[1.75rem] bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white shadow-lg shadow-orange-200">
          <PartyPopper className="size-8" />
          <p className="mt-4 text-3xl font-extrabold">You showed up today.</p>
          <p className="mt-2 text-sm font-semibold text-orange-50">
            {gotIt} felt solid, {stillLearning} still need another look. The
            streak cares that you came back — not that every card was perfect.
          </p>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Got it" value={String(gotIt)} />
          <Stat label="Still learning" value={String(stillLearning)} />
        </div>
        <Button
          className="h-12 rounded-2xl text-base font-extrabold"
          onClick={onHome}
        >
          {returnLabel}
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-orange-200 text-base font-bold text-orange-700"
          onClick={onRestart}
        >
          <RotateCcw />
          Practice this set again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subjectName(card)}
          </h1>
          <p className="text-sm font-bold text-stone-500">
            {position} of {total}
          </p>
        </div>
        <p className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-700">
          {card.topic}
        </p>
      </header>
      <Progress value={pace}>
        <ProgressTrack className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100">
          <ProgressIndicator className="bg-orange-500" />
        </ProgressTrack>
      </Progress>

      <button
        type="button"
        onClick={onFlip}
        className="flip-scene h-72 w-full text-left"
        aria-label={flipped ? "Show the question" : "Show the answer"}
      >
        <div className={`flip-card h-full ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-face flip-face-front flex flex-col justify-between rounded-[1.75rem] bg-white p-6 shadow-md ring-1 ring-orange-100">
            <p className="text-xs font-extrabold tracking-wide text-stone-400 uppercase">
              {subjectName(card)} · Question
            </p>
            <p className="text-xl leading-snug font-extrabold text-stone-900">
              {card.question}
            </p>
            <p className="text-sm font-bold text-orange-600">Tap to flip</p>
          </div>
          <div className="flip-face flip-face-back flex flex-col justify-between rounded-[1.75rem] bg-stone-900 p-6 text-white shadow-md">
            <p className="text-xs font-extrabold tracking-wide text-orange-300 uppercase">
              {subjectName(card)} · Answer
            </p>
            <p className="text-xl leading-snug font-extrabold">{card.answer}</p>
            <p className="text-sm font-bold text-orange-200">Tap to flip back</p>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          disabled={!flipped}
          className="h-14 rounded-2xl border-orange-200 text-base font-extrabold text-orange-800 disabled:opacity-40"
          onClick={() => onRate("learning")}
        >
          Still learning
        </Button>
        <Button
          disabled={!flipped}
          className="h-14 rounded-2xl text-base font-extrabold disabled:opacity-40"
          onClick={() => onRate("got")}
        >
          Got it
        </Button>
      </div>
      <p className="text-center text-xs font-semibold text-stone-400">
        {flipped
          ? "Rate it honestly — missed cards come back sooner."
          : "Flip the card before you rate it."}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
      <p className="text-xs font-extrabold tracking-wide text-stone-400 uppercase">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
