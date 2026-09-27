"use client";

import { useCallback, useMemo, useState } from "react";
import { Brand } from "@/components/brand";
import { BottomNav } from "@/components/bottom-nav";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { NoteSummaryScreen } from "@/components/screens/note-summary-screen";
import { NotesScreen } from "@/components/screens/notes-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { ProgressScreen } from "@/components/screens/progress-screen";
import { ReviewScreen } from "@/components/screens/review-screen";
import {
  averageStudiedMinutes,
  dateKey,
  addDays,
  EXTRA_CARDS,
  FLASHCARDS,
  INITIAL_STREAK,
  LONGEST_STREAK,
  sortByExam,
  STARTER_NOTES,
  starterSubjects,
  studiedKeySet,
  summarizeNote,
  TODAY,
  type Flashcard,
  type Screen,
  type StudyNote,
  type SubjectPlan,
} from "@/lib/demo";

export function StudyApp() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [subjects, setSubjects] = useState<SubjectPlan[]>(() =>
    sortByExam(starterSubjects()),
  );
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState<StudyNote[]>(STARTER_NOTES);
  const [extraCards, setExtraCards] = useState<Flashcard[]>(EXTRA_CARDS);
  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [deckMode, setDeckMode] = useState<"daily" | "note">("daily");
  const [showMissed, setShowMissed] = useState(true);
  const [studiedToday, setStudiedToday] = useState(false);
  const [streak, setStreak] = useState(INITIAL_STREAK);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gotIt, setGotIt] = useState(0);
  const [stillLearning, setStillLearning] = useState(0);
  const [confidence, setConfidence] = useState({
    easy: 0,
    good: 0,
    hard: 0,
    again: 0,
  });
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("07:30");
  const [finished, setFinished] = useState(false);

  const studiedKeys = useMemo(() => studiedKeySet(), []);
  const allCards = useMemo(
    () => [...FLASHCARDS, ...extraCards],
    [extraCards],
  );
  const openNote = notes.find((note) => note.id === openNoteId) ?? null;
  const activeSubjects =
    filter === "all" ? subjects : subjects.filter((item) => item.id === filter);
  const focus = activeSubjects[0] ?? subjects[0];
  const visibleNotes =
    filter === "all" ? notes : notes.filter((note) => note.subjectId === filter);
  const deck = useMemo(() => {
    if (deckMode === "note" && openNote) {
      const ids = new Set(openNote.cardIds);
      return allCards.filter((card) => ids.has(card.id));
    }
    const dailyIds = new Set(activeSubjects.flatMap((item) => item.cardIds));
    return allCards.filter((card) => dailyIds.has(card.id));
  }, [activeSubjects, allCards, deckMode, openNote]);

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

  function rate(rating: "easy" | "good" | "hard" | "again") {
    setConfidence((current) => ({ ...current, [rating]: current[rating] + 1 }));

    if (rating === "easy" || rating === "good") {
      setGotIt((count) => count + 1);
    } else {
      setStillLearning((count) => count + 1);
    }

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
    <div className="min-h-dvh bg-[#F3F7FF] text-[#102D52]">
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
      {screen === "setup" && (
        <header className="sticky top-0 z-40 border-b border-[#dfeaf7] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6 lg:px-8">
            <Brand compact />
          </div>
        </header>
      )}
      <div className="mx-auto w-full max-w-6xl">
        <main className="px-4 pt-5 pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-12 lg:px-8 lg:pt-8">
          {screen === "review" && (
            <ReviewScreen
              cards={deck}
              index={index}
              flipped={flipped}
              gotIt={gotIt}
              stillLearning={stillLearning}
              finished={finished}
              confidence={confidence}
              onFlip={() => setFlipped((value) => !value)}
              onRate={rate}
              onRestart={resetReview}
              onHome={() => setScreen(deckMode === "note" ? "summary" : "dashboard")}
              eyebrow={deckMode === "note" ? "From your notes" : "Daily review"}
              returnLabel={deckMode === "note" ? "Back to summary" : "Back to dashboard"}
              reviewTypes={
                deckMode === "note"
                  ? openNote?.reviewMode ??
                    (openNote?.subjectId === "spanish"
                      ? ["Identification", "Multiple choice", "Mixed"]
                      : ["Flashcards"])
                  : ["Mixed"]
              }
              subjects={
                deckMode === "note" && openNote
                  ? subjects.filter((item) => item.id === openNote.subjectId)
                  : activeSubjects
              }
            />
          )}
          {screen === "dashboard" && (
            <DashboardScreen
              subjects={subjects}
              notes={notes}
              filter={filter}
              onFilter={(id) => {
                setFilter(id);
                if (deckMode === "daily") resetReview();
              }}
              onOpen={(id) => setFilter(id)}
              onAdd={() => setScreen("setup")}
              showMissed={showMissed && (filter === "all" || filter === "bio")}
              studiedToday={studiedToday}
              onDismissMissed={() => setShowMissed(false)}
              onStart={openDailyReview}
              reminderEnabled={reminderEnabled}
              reminderTime={reminderTime}
              dailyGoal={subjects.reduce((sum, subject) => sum + subject.dueToday, 0)}
              backlogAdjusted={showMissed && !studiedToday}
              onToggleReminder={() => setReminderEnabled((value) => !value)}
              onTimeChange={(time) => setReminderTime(time)}
            />
          )}
          {screen === "notes" && (
            <NotesScreen
              subject={filter === "all" ? "All subjects" : focus.name}
              notes={visibleNotes}
              subjects={subjects}
              filter={filter}
              onFilter={setFilter}
              onAdd={(note) => {
                const built = summarizeNote(note.title, note.pasted);
                const id = `n-${Date.now()}`;
                const subjectId = filter === "all" ? subjects[0].id : filter;
                const cardIds = built.cards.map((card) => card.id);
                setExtraCards((current) => [...built.cards, ...current]);
                setSubjects((current) =>
                  current.map((item) =>
                    item.id === subjectId
                      ? {
                          ...item,
                          cardIds: [...item.cardIds, ...cardIds],
                          dueToday: item.dueToday + cardIds.length,
                        }
                      : item,
                  ),
                );
                const savedNote = {
                  id,
                  subjectId,
                  title: note.title,
                  kind: note.kind,
                  detail: note.detail,
                  addedLabel: "Added just now",
                  summary: built.summary,
                  points: built.points,
                  cardIds,
                  reviewMode: note.reviewMode,
                  fresh: true,
                };
                setNotes((current) => [savedNote, ...current]);
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
              initialSubject="Organic Chemistry"
              initialExam={addDays(TODAY, 4)}
              onCancel={() => setScreen("dashboard")}
              onCreate={(nextSubject, nextExam) => {
                const id = `s-${Date.now()}`;
                setSubjects((current) =>
                  sortByExam([
                    ...current,
                    {
                      id,
                      name: nextSubject,
                      examDate: nextExam,
                      dueToday: 0,
                      streak: 0,
                      cardIds: [],
                    },
                  ]),
                );
                setFilter(id);
                setScreen("dashboard");
              }}
            />
          )}
        </main>
        <p className="sr-only">
          Demo date {dateKey(TODAY)}. Local only, no account required.
        </p>
      </div>
    </div>
  );
}
