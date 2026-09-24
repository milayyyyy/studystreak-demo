"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Flashcard, StudyNote } from "@/lib/demo";

export function NoteSummaryScreen({
  note,
  cards,
  onBack,
  onStudyCards,
  onSummarized,
}: {
  note: StudyNote;
  cards: Flashcard[];
  onBack: () => void;
  onStudyCards: () => void;
  onSummarized: () => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(!note.fresh);

  useEffect(() => {
    if (!note.fresh) return;
    const timer = window.setTimeout(() => {
      setShowSummary(true);
      onSummarized();
    }, 900);
    return () => window.clearTimeout(timer);
  }, [note.fresh, note.id, onSummarized]);

  const studied = checked.length;
  const ideasDone = note.points.length > 0 && studied === note.points.length;

  if (!showSummary) {
    return (
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-extrabold text-orange-700"
        >
          <ArrowLeft className="size-4" />
          Notes
        </button>
        <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-orange-100">
          <Sparkles className="size-6 text-orange-500" />
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
            Summarizing {note.title}
          </h1>
          <p className="mt-2 text-sm font-semibold text-stone-500">
            Pulling out the ideas worth studying, then the cards that match them.
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-orange-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-orange-400" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-extrabold text-orange-700"
      >
        <ArrowLeft className="size-4" />
        Notes
      </button>
      <header>
        <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
          Summary
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{note.title}</h1>
        <p className="mt-1 text-sm font-semibold text-stone-500">
          Read the notes, then practice the cards from this source.
        </p>
      </header>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <p className="text-xs font-extrabold tracking-wide text-orange-500 uppercase">
          In a few sentences
        </p>
        <p className="mt-2 text-sm leading-relaxed font-semibold text-stone-700">
          {note.summary}
        </p>
      </section>

      <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-orange-100">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold">Study the ideas</h2>
          <p className="text-xs font-extrabold text-orange-600">
            {studied} of {note.points.length}
          </p>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {note.points.map((point) => {
            const on = checked.includes(point);
            return (
              <li key={point}>
                <button
                  type="button"
                  onClick={() =>
                    setChecked((current) =>
                      current.includes(point)
                        ? current.filter((item) => item !== point)
                        : [...current, point],
                    )
                  }
                  className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left ${
                    on ? "bg-orange-50" : "bg-stone-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${
                      on
                        ? "bg-orange-500 text-white"
                        : "bg-white text-transparent ring-2 ring-orange-200"
                    }`}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      on ? "text-stone-500 line-through" : "text-stone-800"
                    }`}
                  >
                    {point}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {ideasDone && (
          <p className="mt-3 text-sm font-bold text-orange-700">
            You studied the notes. The cards are the next pass, while it’s fresh.
          </p>
        )}
      </section>

      <section className="rounded-[1.75rem] bg-gradient-to-br from-orange-500 to-rose-500 p-5 text-white shadow-lg shadow-orange-200">
        <div className="flex items-center gap-2 text-sm font-bold text-orange-50">
          <Layers className="size-4" />
          Flashcards from this note
        </div>
        <p className="mt-2 text-3xl font-extrabold">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {cards.map((card) => (
            <li
              key={card.id}
              className="rounded-2xl bg-white/15 px-3 py-2 text-sm font-semibold"
            >
              {card.question}
            </li>
          ))}
        </ul>
        <Button
          className="mt-4 h-12 w-full rounded-2xl bg-white text-base font-extrabold text-orange-700 hover:bg-orange-50"
          onClick={onStudyCards}
          disabled={cards.length === 0}
        >
          Study flashcards
        </Button>
      </section>
    </div>
  );
}
