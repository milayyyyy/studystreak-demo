"use client";

import { useEffect, useState } from "react";
import { PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { formatReviewModes, type Flashcard, type SubjectPlan } from "@/lib/demo";

export function ReviewScreen({
  cards,
  index,
  flipped,
  gotIt,
  stillLearning,
  finished,
  confidence,
  onFlip,
  onRate,
  onRestart,
  onHome,
  eyebrow = "Daily review",
  returnLabel = "Back to dashboard",
  reviewTypes,
  subjects = [],
}: {
  cards: Flashcard[];
  index: number;
  flipped: boolean;
  gotIt: number;
  stillLearning: number;
  finished: boolean;
  confidence: {
    easy: number;
    good: number;
    hard: number;
    again: number;
  };
  onFlip: () => void;
  onRate: (rating: "easy" | "good" | "hard" | "again") => void;
  onRestart: () => void;
  onHome: () => void;
  eyebrow?: string;
  returnLabel?: string;
  reviewTypes?: string[];
  subjects?: SubjectPlan[];
}) {
  function subjectName(card: Flashcard) {
    return (
      subjects.find((subject) => subject.cardIds.includes(card.id))?.name ??
      card.topic
    );
  }
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");

  const total = cards.length;
  const displayTypes = formatReviewModes(reviewTypes as any);
  const selectedModes = (reviewTypes && reviewTypes.length > 0 ? reviewTypes : ["Flashcards"]).flatMap((mode) =>
    mode === "Mixed" ? ["Flashcards", "Identification", "Multiple choice", "Short answer"] : [mode],
  );

  if (total === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <header>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subjects.length === 1 ? subjects[0].name : "This subject"}
          </h1>
          <p className="mt-2 text-sm font-bold text-[#1B7EE9]">{displayTypes}</p>
        </header>
        <p className="text-sm font-semibold text-[#6d86a8]">
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
  const exerciseMode = selectedModes[Math.min(index, selectedModes.length - 1)] ?? "Flashcards";

  useEffect(() => {
    setSelectedChoice(null);
    setTypedAnswer("");
  }, [card?.id, exerciseMode]);

  const choices =
    exerciseMode === "Identification" || exerciseMode === "Multiple choice"
      ? [card.answer, "El restaurante", "La cuenta", "El horario"].filter(
          (choice, idx, list) => list.indexOf(choice) === idx,
        )
      : [];
  const isAnswered =
    exerciseMode === "Flashcards"
      ? flipped
      : exerciseMode === "Short answer"
        ? typedAnswer.trim().length > 0
        : selectedChoice !== null;
  const showCorrectAnswer = exerciseMode === "Flashcards" ? flipped : isAnswered;
  if (!card) return null;

  if (finished) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <header>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
            {cards.every((item) => subjectName(item) === subjectName(card))
              ? subjectName(card)
              : "All subjects"}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            Session complete
          </h1>
          <p className="mt-2 text-sm font-bold text-[#d7e9ff]">{displayTypes}</p>
        </header>
        <section className="rounded-[1.75rem] bg-gradient-to-br from-[#0D2F64] to-[#1B7EE9] p-6 text-white shadow-lg shadow-[#c5dcf7]">
          <PartyPopper className="size-8" />
          <p className="mt-4 text-3xl font-extrabold">You showed up today.</p>
          <p className="mt-2 text-sm font-semibold text-[#d7e9ff]">
            {gotIt} felt solid, {stillLearning} still need another look. The
            streak cares that you came back — not that every card was perfect.
          </p>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Easy" value={String(confidence.easy)} />
          <Stat label="Hard / Again" value={String(confidence.hard + confidence.again)} />
        </div>
        <Button
          className="h-12 rounded-2xl text-base font-extrabold"
          onClick={onHome}
        >
          {returnLabel}
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-2xl border-[#c9dcf5] text-base font-bold text-[#0D2F64]"
          onClick={onRestart}
        >
          <RotateCcw />
          Practice this set again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subjectName(card)}
          </h1>
          <p className="mt-1 text-sm font-bold text-[#1B7EE9]">{displayTypes}</p>
          <p className="text-sm font-bold text-[#6d86a8]">
            {position} of {total}
          </p>
        </div>
        <p className="rounded-full bg-[#eaf3ff] px-3 py-1 text-xs font-extrabold text-[#0D2F64]">
          {card.topic}
        </p>
      </header>
      <Progress value={pace}>
        <ProgressTrack className="h-2.5 w-full overflow-hidden rounded-full bg-[#eaf3ff]">
          <ProgressIndicator className="bg-[#eaf3ff]0" />
        </ProgressTrack>
      </Progress>

      {exerciseMode === "Flashcards" ? (
        <button
          type="button"
          onClick={onFlip}
          className="flip-scene h-72 w-full text-left sm:h-80 md:h-96"
          aria-label={flipped ? "Show the question" : "Show the answer"}
        >
          <div className={`flip-card h-full ${flipped ? "is-flipped" : ""}`}>
            <div className="flip-face flip-face-front flex flex-col justify-between rounded-[1.75rem] bg-white p-6 shadow-md ring-1 ring-[#dfeaf7]">
              <p className="text-xs font-extrabold tracking-wide text-[#8aa0bb] uppercase">
                {subjectName(card)} · {exerciseMode}
              </p>
              <p className="text-xl leading-snug font-extrabold text-[#102D52]">
                {card.question}
              </p>
              <p className="text-sm font-bold text-[#1B7EE9]">Tap to flip</p>
            </div>
            <div className="flip-face flip-face-back flex flex-col justify-between rounded-[1.75rem] bg-[#0D2F64] p-6 text-white shadow-md">
              <p className="text-xs font-extrabold tracking-wide text-[#8EC9FF] uppercase">
                {subjectName(card)} · Answer
              </p>
              <p className="text-xl leading-snug font-extrabold">{card.answer}</p>
              <p className="text-sm font-bold text-[#B8D6FF]">Tap to flip back</p>
            </div>
          </div>
        </button>
      ) : (
        <div className="rounded-[1.75rem] bg-white p-6 shadow-md ring-1 ring-[#dfeaf7]">
          <p className="text-xs font-extrabold tracking-wide text-[#8aa0bb] uppercase">
            {subjectName(card)} · {exerciseMode}
          </p>
          <p className="mt-4 text-xl leading-snug font-extrabold text-[#102D52]">
            {exerciseMode === "Multiple choice"
              ? "Choose the best answer for: " + card.question
              : exerciseMode === "Identification"
                ? "Identify the correct response: " + card.question
                : "Type the answer for: " + card.question}
          </p>

          {exerciseMode === "Short answer" ? (
            <Textarea
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              placeholder="Type your answer here..."
              className="mt-5 min-h-28 rounded-2xl border-[#dfeaf7] bg-[#F3F7FF] px-3 py-3 text-base font-medium text-[#102D52]"
            />
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-2 text-left">
              {choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelectedChoice(choice)}
                  className={`rounded-2xl border px-3 py-3 text-left text-sm font-bold transition-colors ${
                    selectedChoice === choice
                      ? "border-[#1B7EE9] bg-[#eaf3ff] text-[#0D2F64]"
                      : "border-[#dfeaf7] bg-[#F3F7FF] text-[#102D52]"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {showCorrectAnswer && (
            <div className="mt-5 rounded-2xl border border-[#bfe3c2] bg-[#ebfff0] p-3 text-left">
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#1d8f5d] uppercase">
                Correct answer
              </p>
              <p className="mt-2 text-base font-extrabold text-[#0f4d36]">
                {card.answer}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          disabled={!isAnswered}
          className="h-12 rounded-2xl border-[#c9dcf5] text-sm font-extrabold text-[#0D2F64] disabled:opacity-40"
          onClick={() => onRate("hard")}
        >
          Hard
        </Button>
        <Button
          disabled={!isAnswered}
          className="h-12 rounded-2xl text-sm font-extrabold disabled:opacity-40"
          onClick={() => onRate("easy")}
        >
          Easy
        </Button>
        <Button
          variant="outline"
          disabled={!isAnswered}
          className="h-12 rounded-2xl border-[#c9dcf5] text-sm font-extrabold text-[#0D2F64] disabled:opacity-40"
          onClick={() => onRate("again")}
        >
          Again
        </Button>
        <Button
          variant="outline"
          disabled={!isAnswered}
          className="h-12 rounded-2xl border-[#c9dcf5] text-sm font-extrabold text-[#0D2F64] disabled:opacity-40"
          onClick={() => onRate("good")}
        >
          Good
        </Button>
      </div>
      <p className="text-center text-xs font-semibold text-[#8aa0bb]">
        {exerciseMode === "Flashcards"
          ? flipped
            ? "Easy cards move out; hard cards return sooner."
            : "Flip the card before you rate it."
          : exerciseMode === "Short answer"
            ? "Type your answer, then rate how it felt."
            : "Select an answer, then rate how it felt."}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[#dfeaf7]">
      <p className="text-xs font-extrabold tracking-wide text-[#8aa0bb] uppercase">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
