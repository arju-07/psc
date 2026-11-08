# Kerala PYQ Hub (കേരള PYQ ഹബ്)

> **One Platform. Every Exam. Smarter Preparation.**

A modern, centralized competitive examination preparation platform tailored for students preparing for Kerala state-level and national competitive examinations (Kerala PSC, Police & Uniformed Services, Teaching KTET/SET, SSC, Banking, RRB, and more).

---

## 🌟 Phase 1 Implementation Summary

Phase 1 delivers the **complete frontend web application** built strictly with frontend architecture (React + TypeScript + Vite + Tailwind CSS + Lucide Icons), ready for future Phase 2 backend & Supabase integration.

### What is Included & Implemented:

1. **Brand & Design**
   - Premium edtech visual identity with deep navy blue, crisp white, and emerald/amber accents.
   - Distinct education emblem logo (`Logo.tsx`).
   - Full light and dark mode toggling with persistent localStorage retention.
   - Fully responsive layouts tailored for mobile, tablet, and desktop screens.
   - Quick Demo Switcher bar allowing immediate switching between **Student View**, **Admin Portal**, and **Public Visitor**.

2. **Public Routes & Pages**
   - `/`: Landing page with headline *"Prepare Smarter. Achieve More."*, exam search bar, all 10 category cards, popular exams, core features, recently added papers with gazette verification badges, 3-step workflow, why choose us, and expandable FAQ.
   - `/exams`: Dedicated examination explorer with live text search, category pills, and quick filters (All, Popular, Recent).
   - `/exams/:slug`: Comprehensive reusable exam page with 4 interactive tabs (**Overview & Syllabus**, **Previous Papers**, **Practice Mode**, **Subjects & Topic Weights**).
   - `/papers`: Previous-Year Paper Library with search by title/code, filters by year (2022–2024), medium (Malayalam, English, Bilingual), and category.
   - `/about`: Independent educational initiative vision, non-governmental disclaimer, and core pedagogical pillars.
   - `/login`: Student login interface with validation, password show/hide, remember me, demo Google button, and feedback.
   - `/register`: Student registration with password verification and terms agreement.
   - `/forgot-password`: Password recovery workflow with demo reset link dispatch.
   - `/admin/login`: Dedicated, separated administration portal login with security warnings and restricted access branding.

3. **Student Experience (`/dashboard/*`)**
   - `/dashboard`: Comprehensive student home with streak counter, accuracy metrics, target exams shelf, continue learning widget, and saved papers.
   - `/dashboard/practice`: Interactive MCQ practice engine.
   - `/dashboard/mock-tests`: Full-length timed mock tests with countdown timers, mark-for-review flags, and score breakdowns.
   - `/dashboard/daily-challenge`: 5-question daily booster with active 7-day streak tracker.
   - `/dashboard/bookmarks`: Dedicated personal library of saved questions and papers.
   - `/dashboard/mistakes`: **Mistake Notebook** — automatically collects any question answered incorrectly during practice for systematic reattempt until mastered!
   - `/dashboard/ai-assistant`: Interactive study assistant chat preview with structured topic summaries and AI practice question generation.
   - `/dashboard/planner`: Study target scheduler with priority tagging and syllabus completion progress.
   - `/dashboard/performance`: Analytics dashboard with accuracy percentages, weekly activity charts, and weak topic isolation.
   - `/dashboard/notifications`: Categorized notification center with unread count badges.
   - `/dashboard/profile`: Target exam selections, preferred language (Malayalam/English), and profile management.
   - `/dashboard/settings`: Theme selection, notification preferences, password updates, and session termination.

4. **MCQ Learning Engine (Core Feature)**
   - **Learning Mode**: Instant evaluation upon selection — *no submit button required*. Correct answer turns green; incorrect choice turns red; instantly reveals the comprehensive rationale panel.
   - **Rich Explanation Layout**:
     - Correct option identification with gazette verification status.
     - Explanation of why the chosen answer is right.
     - Breakdown of why other options are distractors.
     - High-yield facts bulleted for revision.
     - Related topic tagging and official source citation.
     - Automatic logging of incorrect attempts to the student's Mistake Notebook.
   - **Exam Mode**: Concealed answers, countdown timer, question palette navigation, review flagging, and post-submission results scorecard.
   - **Question Tools**: Malayalam translation toggle, question bookmarking, and official discrepancy reporting modal.

5. **PDF Paper Preview & Download Library**
   - High-fidelity simulated PDF booklet viewer (`PdfPreviewModal.tsx`) with examination authority headers, question booklet instructions, and official questions.
   - Instant toggle between Question Booklet and **Final Gazette Answer Key**.
   - Offline PDF download simulation with realistic feedback.

6. **Administrator Portal (`/admin/*`) & Automatic 11-Step Pipeline**
   - 16 fully realized administration consoles:
     1. `/admin` (Executive Overview with KPIs, review queue, and crawler health)
     2. `/admin/pipeline` (**NEW: Automatic 11-Step PDF Processing Pipeline & Processing Dashboard**)
     3. `/admin/categories` (Add, edit, archive, and delete exam streams)
     4. `/admin/exams` (Publish/unpublish exams, eligibility, patterns)
     5. `/admin/subjects` (Syllabus topic mapping & question weightage)
     6. `/admin/papers` (Upload PDF booklets with unlimited size, chunking, and verification flags)
     7. `/admin/answer-keys` (Manual key entry grid, gazette key mapping)
     8. `/admin/questions` (Curate MCQs with distractor rationale, bulk CSV import modal)
     9. `/admin/mock-tests` (Configure duration, negative marks, pass marks)
     10. `/admin/ai-content` (Human-in-the-loop review, approve, reject AI drafts)
     11. `/admin/collection` (Automated discovery crawlers & public source monitor)
     12. `/admin/users` (Student moderation, suspension, privacy-compliant user management)
     13. `/admin/analytics` (Statewide accuracy benchmarks, error rate hot-spots)
     14. `/admin/notifications` (Dispatch platform broadcasts & maintenance notices)
     15. `/admin/roles` (RBAC matrices: Super Admin, Content Admin, Moderator, User Manager)
     16. `/admin/settings` (Maintenance mode toggle, storage usage, database snapshots)

### ⚡ Automatic 11-Step PDF Processing Workflow:
- **STEP 1:** Validate the PDF (header, stream integrity).
- **STEP 2:** Detect selectable text vs. scanned raster images.
- **STEP 3:** Extract text from normal digital PDFs.
- **STEP 4:** Bilingual neural OCR for scanned PDFs.
- **STEP 5:** Detect question numbers and separate individual questions.
- **STEP 6:** Extract question text and options A, B, C and D.
- **STEP 7:** Correlate questions with uploaded official answer keys.
- **STEP 8:** Generate AI-suggested answers and distractor explanations if no official key exists.
- **STEP 9:** Detect duplicates and flag extraction errors.
- **STEP 10:** Send extracted questions to the admin verification desk.
- **STEP 11:** Publish only approved questions to the student question bank.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS with custom palette (Deep Navy `#0f2137`, Slate, Emerald, Amber)
- **Icons**: Lucide React
- **Routing**: React Router v6

---

## 🚀 Running the Project Locally

```bash
# 1. Navigate to the project directory
cd kerala-pyq-hub

# 2. Start the Vite development server
npm run dev

# 3. Open in your browser (typically http://localhost:5173)
```

To create a production build:
```bash
npm run build
npm run preview
```
