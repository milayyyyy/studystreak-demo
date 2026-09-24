# StudyStreak

StudyStreak is a frontend demo of a habit-first study app. Students set an exam date, and the app paces flashcards backward into small daily reviews. Streaks and minutes studied are the score — not a last-minute quiz.

This build is presentation-ready mock data only. Nothing is uploaded or saved on a server. State lives in the browser for the current session.

## What’s included

- **Plan setup** — subject name and exam date, then a confirmation that the work is split into daily reviews.
- **Home** — today’s card batch, streak, exam countdown, and a missed-day note that redistributes yesterday’s cards.
- **Review** — flip a card, then mark it **Got it** or **Still learning**.
- **Notes** — sample sources for Biology Midterm, plus a mock add-note flow.
- **Progress** — two-week calendar, current streak, longest streak, and average daily minutes.

The demo opens on a Biology Midterm plan with a 5-day streak and yesterday already adjusted.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js (this project is set up to use port 4317 in the demo environment).

```bash
npm run lint
```
