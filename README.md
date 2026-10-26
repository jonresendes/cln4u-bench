# The Bench — CLN4U Review Arena

A classroom review game for **CLN4U (Canadian and International Law, Grade 12 University)**. Four games, four units,
1,207 questions written only from the course slide decks, plus a Study Room with 28 lesson briefs. Works in any browser,
installs as an app on phones/tablets/laptops, and runs offline after the first load. Built on the same engine as
*Agora* (HZT4U), v1.0.1, with the Study Room, Gates, Golden tier and Valedictorian rebuilt on top.

## Deploy on Netlify (2 minutes)

**Drag-and-drop (simplest)**
1. Sign in at https://app.netlify.com → *Add new site* → *Deploy manually*.
2. Unzip `the-bench.zip` and drag the **whole folder** (the one containing `index.html`) onto the drop zone.
3. Netlify gives you a URL like `https://something.netlify.app`. Rename it under *Site configuration → Change site name*
   (e.g. `cln4u-bench`). Share that link with students.

**Git-based (for updates)** — push the folder to a GitHub repo and connect it in Netlify (*Import an existing project*).
Build command: *none*; publish directory: `.` (set in `netlify.toml`). Every push redeploys.

> Netlify serves over HTTPS automatically, which is required for install-as-app and offline mode.

## Installing it as an app

| Device | How |
|---|---|
| **Android (Chrome/Edge)** | Open the site → tap the **Install** button in the top bar (or browser menu → *Install app* / *Add to Home screen*). |
| **iPhone / iPad (Safari)** | Open the site → Share → **Add to Home Screen**. |
| **Windows / Mac / Chromebook (Chrome/Edge)** | Click the install icon in the address bar, or the **Install** button. Opens in its own window. |
| **Smartboard / projector PC** | Install in Chrome, then use **Head-to-Head → Projector mode** and the **fullscreen** button (top bar). |

After install it launches full-screen, keeps working without Wi-Fi, and updates itself when you redeploy
(bump `VERSION` in `sw.js` first — see below).

## Using it in class

- **Solo** — students play on their own devices; scores, badges, gates and accolades are saved per *profile* on that device.
- **Head-to-Head** — 2–4 teams on one projected screen (default teams *Crown* and *Defence*). Teams take turns
  (Jeopardy, Wheel, Chief Justice) or buzz in with on-screen buttons / keys **1–4** (Lightning Round). Name a team after
  a saved profile and that profile earns the badges. The **standings** chip in the game header opens a compact
  standings modal (the full scoreboard is hidden on phones to keep the header slim).
- **Difficulty** — Remedial, Level 1–4, or **Mixed** (Jeopardy rows and the ladder climb from Remedial to Level 4).
- **Topics** — Vocabulary · Cases & Rulings · Laws & Documents · People & Institutions · Theories & Concepts · Modern Connections.
- **All Units — Exam Study** draws from every unit at once.
- **Timed questions** — optional; faster correct answers earn a bonus.
- **No repeats** — each unit/level/topic selection tracks which questions have been shown on that device. A question is
  marked "seen" only when it is actually displayed. Nothing repeats until the selection is exhausted; then it starts a
  fresh cycle (and awards *Exhausted Remedies*). *Reset "seen" questions* on the setup screen forces a fresh cycle.
- **Display** — the setup screen has Orientation **Auto / Portrait / Landscape** (applies when the app is in fullscreen on
  Android/Chrome; iOS Safari does not allow orientation locking) and a **Fullscreen** button. On phones the ladder is
  collapsible and the wheel is smaller; the Jeopardy board fits without scrolling in portrait and landscape.

### Games
| Game | Shape | Head-to-head twist |
|---|---|---|
| **Jeopardy** | 5 categories × 5 values, 2 Daily Doubles with wagers, wrong = −value | Steals after a wrong answer; a correct steal takes control |
| **Wheel of Justice** | 5 puzzles (terms / cases / names), consonants, buy vowels, Bankrupt / Lose a Turn, type to solve | Turn passes on a miss; only the solver banks the round |
| **Who Wants to Be Chief Justice?** | 15 rungs to 1,000,000; 50:50, Ask the Jury, Swap; safe havens at 5 and 10; walk away | Teams alternate on their own ladders |
| **Lightning Round** | 90 s (timed) or 20 questions; streak multiplier | Question shows without options; first to buzz answers, −100 if wrong, others may buzz |

### Study Room
Each lesson has a **brief** condensed from its slide deck (`lessons.js`). A brief counts as *read* once it has been open
for a time proportional to its length — **words ÷ 3 seconds (≈180 wpm), clamped to 25 s … 240 s** — and partial time
accumulates per profile (the timer pauses while the tab is hidden). Per-lesson **chips** show progress; reading every
brief in a unit earns that unit's **Law Library** badge, and all four earn the **Librarian** accolade.

### Badges, Gates & Accolades
- **Badges** are per unit and carry the unit's colour and emblem (Scales · Gavel · Maple Leaf · Shield):
  Sworn In (play a game), Counsel (70%+), King's Counsel (70%+ at Level 4), Full Docket (all four games), Case Closed
  (seen every question), Summary Judgment (10 fast correct answers in a timed game), **Law Library** (all briefs read).
- **Gates** — three per unit, cumulative (per-unit answered count and accuracy across all games; All-Units games credit
  each question's own unit):
  - **Gate I · Articling** — 50 answered · 60% accuracy · Sworn In badge
  - **Gate II · Called to the Bar** — 150 answered · 70% accuracy · Counsel badge · 2 different games played
  - **Gate III · Bencher** — 300 answered · 75% accuracy · King's Counsel · Law Library · all four games
- **Accolades** are cross-unit (First Appearance, Unanimous Verdict, Chain of Precedent, Chief Justice, Circumstantial
  Evidence, Double Jeopardy, Rapid Ruling, Bar Exam, Due Process, Speedy Trial, Omnibus Bill, Marathon Hearing,
  Adversarial System, Exhausted Remedies, **Librarian**, **Valedictorian**, Order of the Bench).
  **Valedictorian** = Gate III in all four units + Librarian.
- **Hidden Golden tier** — each unit has a **seal code** you hand out (e.g. after the unit test). Students redeem it via
  *Profile → "Have a seal code?"*. A redeemed seal marks that unit *Golden* (gold ring on the unit card and badges);
  all four seals unlock **The Golden Bench** on the badges page. Codes are stored hashed in `core.js` (`SEALS`).

  **Seal codes (teacher only — delete this section before sharing the README):**
  `SCALES-1215` (Unit 1) · `GAVEL-1959` (Unit 2) · `MAPLE-1948` (Unit 3) · `SHIELD-2002` (Unit 4).
  Case and punctuation are ignored. To change a code, run `sealHash("NEW-CODE")` in the browser console and paste the
  result into `SEALS` in `core.js`.
- The **Leaderboard** (trophy icon) records top scores with names, filterable by game and unit.
- Profiles, scores and progress live in the browser on each device. **Profile → Export data** backs up or moves a class
  tablet's data; **Import** restores it. (Storage key prefix is `bench.`, so it never collides with Agora on the same device.)

## Editing the questions

Questions live in `unit1.js` … `unit4.js` (Levels 1–4) and `remedial.js` (Remedial). Each entry:

```js
{u:1, l:3, t:"Cases & Rulings", d:3, q:"Question text…", a:"Correct answer", x:["Wrong 1","Wrong 2","Wrong 3"]}
```
- `u` unit (1–4) · `l` lesson number · `t` topic (one of the six names exactly)
- `d` difficulty: `0` Remedial, `1`–`4` Levels · `a` must not appear in `x`
- Short answers (letters only, ≤30 characters) automatically become Wheel of Justice puzzles.

`question-bank.csv` is a spreadsheet view of the whole bank for proofreading (last column marks Wheel-eligible answers).
Lesson briefs live in `lessons.js`.

**After any edit, bump `VERSION` in `sw.js`** (e.g. `bench-v1.0.1`) so installed copies pick up the change, then redeploy.

## Files (flat folder — no subfolders)
```
index.html             app shell + icon sprite
style.css              theme (unit colours are CSS variables at the top)
core.js                units/topics, pool engine, profiles, badges, gates, seals, accolades
games.js               the four games + results screen
app.js                 screens: home, setup, games, study room, leaderboard, badges, profiles
lessons.js             Study Room briefs
unit1-4.js remedial.js question bank · question-bank.csv proofreading export
manifest.webmanifest   install metadata · sw.js offline cache · icon.svg / icon-*.png app icons
netlify.toml           headers for Netlify
```
