"use client";

import { useCallback, useMemo, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { HomeScreen } from "@/components/screens/home-screen";
import { NoteSummaryScreen } from "@/components/screens/note-summary-screen";
import { NotesScreen } from "@/components/screens/notes-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { ProgressScreen } from "@/components/screens/progress-screen";
import { ReviewScreen } from "@/components/screens/review-screen";
import {
  averageStudiedMinutes,
  dateKey,
  defaultExamDate,
  FLASHCARDS,
  INITIAL_STREAK,
  LONGEST_STREAK,
  REDISTRIBUTED_CARDS,
  STARTER_NOTES,
  studiedKeySet,
  summarizeNote,
  TODAY,
  type Flashcard,
  type Screen,
  type StudyNote,
} from "@/lib/demo";

export function StudyApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [subject, setSubject] = useState("Biology Midterm");
  const [examDate, setExamDate] = useState(defaultExamDate);
  const [notes, setNotes] = useState<StudyNote[]>(STARTER_NOTES);
  const [extraCards, setExtraCards] = useState<Flashcard[]>([]);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [deckMode, setDeckMode] = useState<"daily" | "note">("daily");
  const [showMissed, setShowMissed] = useState(true);
  const [studiedToday, setStudiedToday] = useState(false);
  const [streak, setStreak] = useState(INITIAL_STREAK);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gotIt, setGotIt] = useState(0);
  const [stillLearning, setStillLearning] = useState(0);
  const [finished, setFinished] = useState(false);

  const studiedKeys = useMemo(() => studiedKeySet(), []);
  const allCards = useMemo(
    () => [...FLASHCARDS, ...extraCards],
    [extraCards],
  );
  const openNote = notes.find((note) => note.id === openNoteId) ?? null;
  const deck = useMemo(() => {
    if (deckMode === "daily" || !openNote) return FLASHCARDS;
    const ids = new Set(openNote.cardIds);
    const matched = allCards.filter((card) => ids.has(card.id));
    return matched.length > 0 ? matched : FLASHCARDS;
  }, [allCards, deckMode, openNote]);
  const dueCount = FLASHCARDS.length;

  function resetReview() {
    setIndex(0);
    setFlipped(false);
    setGotIt(0);
    setStillLearning(0);
    setFinished(false);
  }

  function completeSession() {
    if (!studiedToday) {
      setStudiedToday(true);
      setStreak((current) => current + 1);
    }
    setFinished(true);
  }

  function rate(rating: "got" | "learning") {
    if (rating === "got") setGotIt((count) => count + 1);
    else setStillLearning((count) => count + 1);
    const next = index + 1;
    if (next >= deck.length) {
      completeSession();
      return;
    }
    setIndex(next);
    setFlipped(false);
  }

  const studiedCount = studiedKeys.size + (studiedToday ? 1 : 0);
  const baseAverage = averageStudiedMinutes();
  const averageMinutes = studiedToday
    ? Math.round((baseAverage * studiedKeys.size + 12) / studiedCount)
    : baseAverage;

  const markSummarized = useCallback(() => {
    if (!openNoteId) return;
    setNotes((current) =>
      current.map((note) =>
        note.id === openNoteId ? { ...note, fresh: false } : note,
      ),
    );
  }, [openNoteId]);

  function openDailyReview() {
    if (deckMode !== "daily") {
      setDeckMode("daily");
      resetReview();
    } else if (finished) {
      resetReview();
    }
    setScreen("review");
  }

  function openNoteReview() {
    setDeckMode("note");
    resetReview();
    setScreen("review");
  }

  return (
    <div className="min-h-dvh bg-[#F6E4D8] text-stone-900">
      <div className="relative mx-auto min-h-dvh w-full max-w-md bg-[#FFF8F3] shadow-[0_0_0_1px_rgba(251,146,60,0.15)]">
        <main className="px-4 pt-6 pb-28">
          {screen === "home" && (
            <HomeScreen
              subject={subject}
              examDate={examDate}
              streak={streak}
              dueCount={dueCount}
              redistributed={REDISTRIBUTED_CARDS}
              studiedToday={studiedToday}
              showMissed={showMissed}
              onDismissMissed={() => setShowMissed(false)}
              onStart={openDailyReview}
              onSetup={() => setScreen("setup")}
            />
          )}
          {screen === "review" && (
            <ReviewScreen
              cards={deck}
              index={index}
              flipped={flipped}
              gotIt={gotIt}
              stillLearning={stillLearning}
              finished={finished}
              onFlip={() => setFlipped((value) => !value)}
              onRate={rate}
              onRestart={resetReview}
              onHome={() => setScreen(deckMode === "note" ? "summary" : "home")}
              eyebrow={deckMode === "note" ? "From your notes" : "Daily review"}
              returnLabel={deckMode === "note" ? "Back to summary" : "Back to today"}
            />
          )}
          {screen === "notes" && (
            <NotesScreen
              subject={subject}
              notes={notes}
              onAdd={(note) => {
                const built = summarizeNote(note.title, note.pasted);
                const id = `n-${Date.now()}`;
                setExtraCards((current) => [...built.cards, ...current]);
                setNotes((current) => [
                  {
                    id,
                    title: note.title,
                    kind: note.kind,
                    detail: note.detail,
                    addedLabel: "Added just now",
                    summary: built.summary,
                    points: built.points,
                    cardIds: built.cards.map((card) => card.id),
                    fresh: true,
                  },
                  ...current,
                ]);
                setOpenNoteId(id);
                setScreen("summary");
              }}
              onOpen={(noteId) => {
                setOpenNoteId(noteId);
                setScreen("summary");
              }}
            />
          )}
          {screen === "summary" && openNote && (
            <NoteSummaryScreen
              note={openNote}
              cards={allCards.filter((card) => openNote.cardIds.includes(card.id))}
              onBack={() => setScreen("notes")}
              onStudyCards={openNoteReview}
              onSummarized={markSummarized}
            />
          )}
          {screen === "progress" && (
            <ProgressScreen
              streak={streak}
              longest={Math.max(LONGEST_STREAK, streak)}
              averageMinutes={averageMinutes}
              studiedKeys={studiedKeys}
              studiedToday={studiedToday}
              todayMinutes={12}
            />
          )}
          {screen === "setup" && (
            <OnboardingScreen
              initialSubject={subject}
              initialExam={examDate}
              onCancel={() => setScreen("home")}
              onCreate={(nextSubject, nextExam) => {
                setSubject(nextSubject);
                setExamDate(nextExam);
                setScreen("home");
              }}
            />
          )}
        </main>
        {screen !== "setup" && (
          <BottomNav
            screen={screen === "summary" ? "notes" : screen}
            onChange={(next) => {
              if (next === "review") {
                openDailyReview();
                return;
              }
              setScreen(next);
            }}
          />
        )}
        <p className="sr-only">
          Demo date {dateKey(TODAY)}. Local only, no account required.
        </p>
      </div>
    </div>
  );
}
