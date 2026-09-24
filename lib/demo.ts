export type Flashcard = {
  id: string
  topic: string
  question: string
  answer: string
}

export type NoteKind = "PDF" | "Notes" | "Slides"

export type StudyNote = {
  id: string
  title: string
  kind: NoteKind
  detail: string
  addedLabel: string
}

export type Screen = "home" | "review" | "notes" | "progress" | "setup"

export function startOfDay(date = new Date()) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return startOfDay(next)
}

export function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatShort(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatLong(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function formatInputDate(date: Date) {
  return dateKey(date)
}

export function daysBetween(from: Date, to: Date) {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime()
  return Math.round(ms / 86_400_000)
}

export const TODAY = startOfDay()

export const FLASHCARDS: Flashcard[] = [
  {
    id: "c1",
    topic: "Cells",
    question: "What is the powerhouse of the cell, and what does it produce?",
    answer: "Mitochondria. They produce ATP, the cell’s usable energy.",
  },
  {
    id: "c2",
    topic: "Cells",
    question: "What do ribosomes build?",
    answer: "Proteins. They read mRNA and assemble amino acids into polypeptide chains.",
  },
  {
    id: "c3",
    topic: "Membranes",
    question: "What is osmosis?",
    answer:
      "The movement of water across a semipermeable membrane from lower solute concentration to higher solute concentration.",
  },
  {
    id: "c4",
    topic: "Energy",
    question: "Which organelle contains chlorophyll, and what process happens there?",
    answer: "The chloroplast. Photosynthesis converts light energy into glucose.",
  },
  {
    id: "c5",
    topic: "Energy",
    question: "What is the overall purpose of cellular respiration?",
    answer:
      "To break down glucose and capture energy as ATP. The usual summary is glucose + oxygen → carbon dioxide + water + ATP.",
  },
  {
    id: "c6",
    topic: "Division",
    question: "How do mitosis and meiosis differ in the cells they produce?",
    answer:
      "Mitosis makes two genetically identical diploid body cells. Meiosis makes four genetically unique haploid gametes.",
  },
  {
    id: "c7",
    topic: "Genetics",
    question: "What does DNA stand for, and which bases pair?",
    answer:
      "Deoxyribonucleic acid. Adenine pairs with thymine, and cytosine pairs with guanine.",
  },
  {
    id: "c8",
    topic: "Genetics",
    question: "What is the difference between a genotype and a phenotype?",
    answer:
      "Genotype is the genetic makeup. Phenotype is the observable trait that genotype and environment produce.",
  },
  {
    id: "c9",
    topic: "Systems",
    question: "What is homeostasis?",
    answer:
      "The body keeping a stable internal environment — temperature, water, and blood sugar — even when the outside changes.",
  },
  {
    id: "c10",
    topic: "Systems",
    question: "Why do enzymes speed up reactions, and what can stop them?",
    answer:
      "They lower activation energy. Extreme heat or pH can denature them so the active site no longer fits the substrate.",
  },
]

const STUDIED_OFFSETS = [-6, -5, -4, -3, -2]
const MINUTES_BY_OFFSET: Record<number, number> = {
  [-6]: 16,
  [-5]: 22,
  [-4]: 14,
  [-3]: 19,
  [-2]: 19,
}

export const INITIAL_STREAK = STUDIED_OFFSETS.length
export const LONGEST_STREAK = 14
export const REDISTRIBUTED_CARDS = 2

export function studiedKeySet() {
  return new Set(STUDIED_OFFSETS.map((offset) => dateKey(addDays(TODAY, offset))))
}

export function minutesForKey(key: string) {
  for (const offset of STUDIED_OFFSETS) {
    if (dateKey(addDays(TODAY, offset)) === key) {
      return MINUTES_BY_OFFSET[offset]
    }
  }
  return 0
}

export function averageStudiedMinutes() {
  const total = STUDIED_OFFSETS.reduce(
    (sum, offset) => sum + MINUTES_BY_OFFSET[offset],
    0,
  )
  return Math.round(total / STUDIED_OFFSETS.length)
}

export const STARTER_NOTES: StudyNote[] = [
  {
    id: "n1",
    title: "Chapter 4 · Cell structure",
    kind: "PDF",
    detail: "12 pages · lecture packet",
    addedLabel: "Added Fri",
  },
  {
    id: "n2",
    title: "Lecture 7 · Photosynthesis",
    kind: "Notes",
    detail: "Handwritten summary",
    addedLabel: "Added Sun",
  },
  {
    id: "n3",
    title: "Lab · Mitosis slides",
    kind: "Slides",
    detail: "8 slides · microscope lab",
    addedLabel: "Added Mon",
  },
  {
    id: "n4",
    title: "Chapter 6 · Genetics overview",
    kind: "PDF",
    detail: "9 pages · practice problems",
    addedLabel: "Added Tue",
  },
]

export function defaultExamDate() {
  return addDays(TODAY, 18)
}

export function mondayOf(date: Date) {
  const day = date.getDay()
  const delta = day === 0 ? -6 : 1 - day
  return addDays(date, delta)
}
