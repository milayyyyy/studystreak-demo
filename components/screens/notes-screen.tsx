"use client";

import { useState } from "react";
import { ChevronRight, FileText, Presentation, StickyNote, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubjectFilter } from "@/components/subject-filter";
import type {
  NoteKind,
  ReviewMode,
  StudyNote,
  SubjectPlan,
} from "@/lib/demo";

const ICONS: Record<NoteKind, typeof FileText> = {
  PDF: FileText,
  Notes: StickyNote,
  Slides: Presentation,
};

export function NotesScreen({
  subject,
  notes,
  onAdd,
  onOpen,
  subjects,
  filter,
  onFilter,
}: {
  subject: string;
  notes: StudyNote[];
  onAdd: (note: {
    title: string;
    kind: NoteKind;
    detail: string;
    pasted: string;
    reviewMode?: ReviewMode[];
  }) => void;
  onOpen: (noteId: string) => void;
  subjects: SubjectPlan[];
  filter: string;
  onFilter: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reviewModeOpen, setReviewModeOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [pasted, setPasted] = useState("");
  const [kind, setKind] = useState<NoteKind>("Notes");
  const [selectedReviewModes, setSelectedReviewModes] = useState<ReviewMode[]>([]);
  const [pendingNote, setPendingNote] = useState<{
    title: string;
    kind: NoteKind;
    detail: string;
    pasted: string;
  } | null>(null);

  function toggleReviewMode(mode: ReviewMode) {
    setSelectedReviewModes((current) =>
      current.includes(mode)
        ? current.filter((item) => item !== mode)
        : [...current, mode],
    );
  }

  function reset() {
    setTitle("");
    setFileLabel("");
    setPasted("");
    setKind("Notes");
  }

  function save() {
    const clean = title.trim();
    if (!clean) return;

    const savedNote = {
      title: clean,
      kind,
      detail: fileLabel || (pasted.trim() ? "Pasted notes" : "Added from this device"),
      pasted,
    };

    setPendingNote(savedNote);
    reset();
    setOpen(false);
    setReviewModeOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#1B7EE9] uppercase">
            Notes
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subject}
          </h1>
          <p className="mt-1 text-sm font-semibold text-[#6d86a8]">
            Open a note to study the summary, then the cards.
          </p>
        </div>
      </header>

      <SubjectFilter subjects={subjects} value={filter} onChange={onFilter} />

      <ul className="grid gap-3 sm:grid-cols-2">
        {notes.map((note) => {
          const Icon = ICONS[note.kind];
          return (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => onOpen(note.id)}
                className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-[#dfeaf7]"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eaf3ff] text-[#1B7EE9]">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-[#102D52]">
                    {note.title}
                  </span>
                  <span className="block text-sm font-semibold text-[#6d86a8]">
                    {note.kind} · {note.detail}
                  </span>
                  <span className="block text-xs font-bold text-[#d7e9ff]0">
                    Summary ready · {note.cardIds.length}{" "}
                    {note.cardIds.length === 1 ? "card" : "cards"}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-[#8EC9FF]" />
              </button>
            </li>
          );
        })}
      </ul>

      {notes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#c9dcf5] bg-white p-6 text-center">
          <p className="font-extrabold">No notes yet</p>
          <p className="mt-1 text-sm font-semibold text-[#6d86a8]">
            Add a chapter, lecture, or slide deck and we&apos;ll pace it.
          </p>
        </div>
      )}

      <Button
        className="h-12 rounded-2xl text-base font-extrabold"
        onClick={() => setOpen(true)}
      >
        Add Note
      </Button>

      <Dialog
        open={reviewModeOpen}
        onOpenChange={(next) => {
          if (!next) {
            setReviewModeOpen(false);
            setSelectedReviewModes([]);
            setPendingNote(null);
          }
        }}
      >
        <DialogContent className="max-h-[min(90dvh,38rem)] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              How do you want to review this?
            </DialogTitle>
            <DialogDescription>
              Choose all the review types you want for this note.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 sm:grid-cols-2">
            {([
              "Flashcards",
              "Identification",
              "Short answer",
              "Multiple choice",
              "Mixed",
            ] as ReviewMode[]).map((mode) => {
              const selected = selectedReviewModes.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleReviewMode(mode)}
                  className={`h-12 rounded-2xl text-sm font-extrabold transition-colors ${
                    selected
                      ? "bg-[#0D2F64] text-white"
                      : "bg-[#eaf3ff] text-[#0D2F64]"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          <DialogFooter className="pt-2">
            <Button
              className="h-11 w-full rounded-2xl font-extrabold"
              disabled={selectedReviewModes.length === 0 || !pendingNote}
              onClick={() => {
                if (!pendingNote) return;
                const reviewModes: ReviewMode[] =
                  selectedReviewModes.length > 0 ? selectedReviewModes : ["Mixed"];
                onAdd({
                  ...pendingNote,
                  reviewMode: reviewModes,
                });
                setSelectedReviewModes([]);
                setPendingNote(null);
                setReviewModeOpen(false);
              }}
            >
              Save review types
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              Add a note
            </DialogTitle>
            <DialogDescription>
              This demo keeps the file on this device only. Nothing is uploaded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-title" className="font-bold">
                Title
              </Label>
              <Input
                id="note-title"
                value={title}
                placeholder="Chapter 8 · Ecology"
                className="h-11 rounded-xl px-3"
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-body" className="font-bold">
                Paste notes
              </Label>
              <Textarea
                id="note-body"
                value={pasted}
                placeholder="Optional. Paste a paragraph and we’ll summarize it into ideas and cards."
                className="min-h-24 rounded-xl px-3 py-2"
                onChange={(event) => setPasted(event.target.value)}
              />
            </div>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-[#8EC9FF] bg-[#eaf3ff]/70 px-4 py-6 text-center">
              <Upload className="size-5 text-[#1B7EE9]" />
              <span className="text-sm font-extrabold text-[#102D52]">
                {fileLabel || "Tap to choose a file"}
              </span>
              <span className="text-xs font-semibold text-[#6d86a8]">
                PDF, notes, or slides. The name is all we store.
              </span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setFileLabel(file.name);
                  if (!title.trim()) {
                    setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                  }
                  if (file.name.toLowerCase().endsWith(".pdf")) setKind("PDF");
                  else if (/\.(ppt|pptx)$/i.test(file.name)) setKind("Slides");
                  else setKind("Notes");
                }}
              />
            </label>
          </div>
          <DialogFooter className="border-[#dfeaf7] bg-[#eaf3ff]/40">
            <Button
              className="h-11 w-full rounded-2xl font-extrabold"
              disabled={!title.trim()}
              onClick={save}
            >
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto rounded-3xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              Add a note
            </DialogTitle>
            <DialogDescription>
              This demo keeps the file on this device only. Nothing is uploaded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-title" className="font-bold">
                Title
              </Label>
              <Input
                id="note-title"
                value={title}
                placeholder="Chapter 8 · Ecology"
                className="h-11 rounded-xl px-3"
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-body" className="font-bold">
                Paste notes
              </Label>
              <Textarea
                id="note-body"
                value={pasted}
                placeholder="Optional. Paste a paragraph and we’ll summarize it into ideas and cards."
                className="min-h-24 rounded-xl px-3 py-2"
                onChange={(event) => setPasted(event.target.value)}
              />
            </div>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-[#8EC9FF] bg-[#eaf3ff]/70 px-4 py-6 text-center">
              <Upload className="size-5 text-[#1B7EE9]" />
              <span className="text-sm font-extrabold text-[#102D52]">
                {fileLabel || "Tap to choose a file"}
              </span>
              <span className="text-xs font-semibold text-[#6d86a8]">
                PDF, notes, or slides. The name is all we store.
              </span>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setFileLabel(file.name);
                  if (!title.trim()) {
                    setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
                  }
                  if (file.name.toLowerCase().endsWith(".pdf")) setKind("PDF");
                  else if (/\.(ppt|pptx)$/i.test(file.name)) setKind("Slides");
                  else setKind("Notes");
                }}
              />
            </label>
          </div>
          <DialogFooter className="border-[#dfeaf7] bg-[#eaf3ff]/40">
            <Button
              className="h-11 w-full rounded-2xl font-extrabold"
              disabled={!title.trim()}
              onClick={save}
            >
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
