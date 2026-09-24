export type Flashcard = {
  id: string
  topic: string
  question: string
  answer: string
}

export type NoteKind = "PDF" | "Notes" | "Slides"

export type StudyNote = {
  id: string
  subjectId: string
  title: string
  kind: NoteKind
  detail: string
  addedLabel: string
  summary: string
  points: string[]
  cardIds: string[]
  fresh?: boolean
}

export type SubjectPlan = {
  id: string
  name: string
  examDate: Date
  dueToday: number
  streak: number
  cardIds: string[]
}

export type Screen =
  | "dashboard"
  | "review"
  | "notes"
  | "summary"
  | "progress"
  | "setup"

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

export const EXTRA_CARDS: Flashcard[] = [
  {
    id: "s1",
    topic: "Spanish",
    question: "How do you say “I would like the chicken” in Spanish?",
    answer: "Quisiera el pollo.",
  },
  {
    id: "s2",
    topic: "Spanish",
    question: "What is the difference between ser and estar for location?",
    answer: "Estar is for location and temporary states. Ser is for identity and origin.",
  },
  {
    id: "s3",
    topic: "Spanish",
    question: "Which article goes with “leche”?",
    answer: "La leche. Leche is feminine.",
  },
  {
    id: "s4",
    topic: "Spanish",
    question: "How do you ask for the check?",
    answer: "La cuenta, por favor.",
  },
  {
    id: "h1",
    topic: "History",
    question: "What shift defines the Industrial Revolution?",
    answer: "Work moved from hand production at home to machines in factories.",
  },
  {
    id: "h2",
    topic: "History",
    question: "Why did factory towns grow so quickly?",
    answer: "Mills needed labor, so people moved from farms to live near the work.",
  },
  {
    id: "h3",
    topic: "History",
    question: "Name one cost of industrial growth for workers.",
    answer: "Long hours, low pay, and unsafe factory conditions.",
  },
]

export function starterSubjects(): SubjectPlan[] {
  return [
    {
      id: "bio",
      name: "Biology Midterm",
      examDate: addDays(TODAY, 18),
      dueToday: 10,
      streak: 5,
      cardIds: FLASHCARDS.map((card) => card.id),
    },
    {
      id: "spanish",
      name: "Spanish Quiz",
      examDate: addDays(TODAY, 6),
      dueToday: 4,
      streak: 2,
      cardIds: ["s1", "s2", "s3", "s4"],
    },
    {
      id: "history",
      name: "World History Essay",
      examDate: addDays(TODAY, 33),
      dueToday: 3,
      streak: 8,
      cardIds: ["h1", "h2", "h3"],
    },
  ]
}

export function sortByExam(subjects: SubjectPlan[]) {
  return [...subjects].sort(
    (a, b) => a.examDate.getTime() - b.examDate.getTime(),
  )
}

export const STARTER_NOTES: StudyNote[] = [
  {
    id: "n1",
    subjectId: "bio",
    title: "Chapter 4 · Cell structure",
    kind: "PDF",
    detail: "12 pages · lecture packet",
    addedLabel: "Added Fri",
    summary:
      "Cells stay organized with membranes and compartments. The nucleus holds DNA, ribosomes build proteins, and mitochondria turn food into ATP. Water follows solutes by osmosis, which is why a cell swells or shrinks depending on the solution around it.",
    points: [
      "Mitochondria make ATP, the cell’s usable energy.",
      "Ribosomes assemble proteins by reading mRNA.",
      "Osmosis is water moving toward the higher solute concentration.",
    ],
    cardIds: ["c1", "c2", "c3"],
  },
  {
    id: "n2",
    subjectId: "bio",
    title: "Lecture 7 · Photosynthesis",
    kind: "Notes",
    detail: "Handwritten summary",
    addedLabel: "Added Sun",
    summary:
      "Chloroplasts capture light and store it as glucose. Cellular respiration later releases that energy as ATP. Plants make the sugar; mitochondria in plants and animals spend it.",
    points: [
      "Chlorophyll in chloroplasts absorbs light.",
      "Photosynthesis stores energy in glucose.",
      "Cellular respiration releases that energy as ATP.",
    ],
    cardIds: ["c4", "c5"],
  },
  {
    id: "n3",
    subjectId: "bio",
    title: "Lab · Mitosis slides",
    kind: "Slides",
    detail: "8 slides · microscope lab",
    addedLabel: "Added Mon",
    summary:
      "The lab compares two kinds of division. Mitosis copies a body cell into two identical cells. Meiosis makes gametes and shuffles the genes, so the four daughter cells are not copies of the parent.",
    points: [
      "Mitosis produces two identical diploid cells.",
      "Meiosis produces four unique haploid cells.",
      "Count chromosomes on the slide before naming the phase.",
    ],
    cardIds: ["c6"],
  },
  {
    id: "n4",
    subjectId: "bio",
    title: "Chapter 6 · Genetics overview",
    kind: "PDF",
    detail: "9 pages · practice problems",
    addedLabel: "Added Tue",
    summary:
      "DNA is a four-letter code. The genotype is that code, and the phenotype is the trait you can actually see. Environment can change the phenotype without rewriting the DNA.",
    points: [
      "DNA stands for deoxyribonucleic acid. A pairs with T, C with G.",
      "Genotype is the genes. Phenotype is the visible trait.",
      "The same genotype can look different in a different environment.",
    ],
    cardIds: ["c7", "c8"],
  },
  {
    id: "n5",
    subjectId: "spanish",
    title: "Unidad 3 · La comida",
    kind: "Notes",
    detail: "Vocab list · restaurant dialogue",
    addedLabel: "Added Wed",
    summary:
      "This unit is restaurant Spanish: what you want to eat, which article a food takes, and how to ask for the check. Estar covers where you are; ser covers who you are.",
    points: [
      "Quisiera is the polite way to order.",
      "Estar is location. Ser is identity.",
      "La cuenta, por favor ends the meal.",
    ],
    cardIds: ["s1", "s2", "s3", "s4"],
  },
  {
    id: "n6",
    subjectId: "history",
    title: "Chapter 9 · Industrial Revolution",
    kind: "PDF",
    detail: "6 pages · essay outline",
    addedLabel: "Added Thu",
    summary:
      "The essay argues that machines pulled work into factories and pulled people into towns. Growth was real, and so were the long hours and unsafe floors that came with it.",
    points: [
      "Production moved from homes to machines.",
      "Factory towns grew because the mills needed workers.",
      "The essay needs one human cost, not only the invention.",
    ],
    cardIds: ["h1", "h2", "h3"],
  },
]

export function summarizeNote(title: string, pasted: string) {
  const lines = pasted
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 12)
    .slice(0, 4)

  const points =
    lines.length >= 2
      ? lines.slice(0, 3)
      : [
          `${title} has one core idea worth rereading in your own words.`,
          "Turn the definition into a question you could answer cold.",
          "Note one comparison the exam is likely to ask.",
        ]

  const summary =
    pasted.trim().length > 40
      ? pasted.trim().slice(0, 320)
      : `${title} is ready as a short read. Study the key ideas first, then flip the cards that came from them so the wording sticks.`

  const stamp = Date.now()
  const cards: Flashcard[] = points.slice(0, 2).map((point, index) => ({
    id: `c-${stamp}-${index}`,
    topic: title,
    question:
      index === 0
        ? `In your own words, what should you remember from ${title}?`
        : `Which idea from ${title} would you still want to practice?`,
    answer: point,
  }))

  return {
    summary,
    points,
    cards,
  }
}

export function defaultExamDate() {
  return addDays(TODAY, 18)
}

export function mondayOf(date: Date) {
  const day = date.getDay()
  const delta = day === 0 ? -6 : 1 - day
  return addDays(date, delta)
}
