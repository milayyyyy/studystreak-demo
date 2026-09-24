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
import type { NoteKind, StudyNote, SubjectPlan } from "@/lib/demo";

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
  }) => void;
  onOpen: (noteId: string) => void;
  subjects: SubjectPlan[];
  filter: string;
  onFilter: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [pasted, setPasted] = useState("");
  const [kind, setKind] = useState<NoteKind>("PDF");

  function reset() {
    setTitle("");
    setFileLabel("");
    setPasted("");
    setKind("PDF");
  }

  function save() {
    const clean = title.trim();
    if (!clean) return;
    onAdd({
      title: clean,
      kind,
      detail: fileLabel || (pasted.trim() ? "Pasted notes" : "Added from this device"),
      pasted,
    });
    reset();
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-orange-500 uppercase">
            Notes
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
            {subject}
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Open a note to study the summary, then the cards.
          </p>
        </div>
      </header>

      <SubjectFilter subjects={subjects} value={filter} onChange={onFilter} />

      <ul className="flex flex-col gap-3">
        {notes.map((note) => {
          const Icon = ICONS[note.kind];
          return (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => onOpen(note.id)}
                className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-orange-100"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-stone-900">
                    {note.title}
                  </span>
                  <span className="block text-sm font-semibold text-stone-500">
                    {note.kind} · {note.detail}
                  </span>
                  <span className="block text-xs font-bold text-orange-500">
                    Summary ready · {note.cardIds.length}{" "}
                    {note.cardIds.length === 1 ? "card" : "cards"}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-orange-300" />
              </button>
            </li>
          );
        })}
      </ul>

      {notes.length === 0 && (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-6 text-center">
          <p className="font-extrabold">No notes yet</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
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
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
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
              <Label className="font-bold">Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["PDF", "Notes", "Slides"] as NoteKind[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setKind(option)}
                    className={`h-10 rounded-xl text-sm font-extrabold ${
                      kind === option
                        ? "bg-orange-500 text-white"
                        : "bg-orange-50 text-orange-800"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
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
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-orange-300 bg-orange-50/70 px-4 py-6 text-center">
              <Upload className="size-5 text-orange-600" />
              <span className="text-sm font-extrabold text-stone-800">
                {fileLabel || "Tap to choose a file"}
              </span>
              <span className="text-xs font-semibold text-stone-500">
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
          <DialogFooter className="border-orange-100 bg-orange-50/40">
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
