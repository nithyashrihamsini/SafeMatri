# SafeMatri

**Every mother heard. Risks caught early, anywhere.**

SafeMatri is a voice-first web app that lets a rural pregnant woman check her own warning signs, see a **Risk Meter** with reasons, and, when risk is high, alert a nearby health worker with her location and a symptom report. A **priority dashboard** helps health workers see who needs attention first, without leaving anyone out.

> Built by **Team Syrah** for the **Global Innovation Hackathon 2026 – Build for a Better Future** (theme: *Innovate Without Borders*).

> ⚠️ **SafeMatri is a decision-support prototype. It is not a medical device, does not diagnose, and does not recommend medicines.**


---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Features](#features)
- [Screenshots](#screenshots)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Risk Logic](#risk-logic)
- [Priority Queue](#priority-queue)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Limitations & Responsible Use](#limitations--responsible-use)
- [SDG Alignment](#sdg-alignment)
- [Roadmap](#roadmap)
- [Team](#team)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## The Problem

In many rural and low-resource areas:

- Doctors are far away, and a trained health worker may not be nearby or may be covering many women.
- Women often describe how they *feel*, not medical terms, so warning signs such as severe headache or reduced baby movement may not seem serious.
- Without a shared view of symptoms, health workers cannot tell which women need attention first, so urgent cases can wait.

Recognizing danger signs late, and reaching care late, is a well-recognized route to preventable maternal deaths.

## Our Solution

SafeMatri puts the first step in the woman's own hands:

1. **Speak:** she answers simple voice or tap questions and describes how she feels, in her own language.
2. **Assess:** a transparent, guideline-based rule engine shows a **Risk Meter** (Low / Moderate / High) with the reasons.
3. **Alert:** if risk is high, and with her consent, an alert with her location and a **symptom and risk report** goes to the nearest health worker (or the nearest clinic if no health worker is nearby) for a home check-up.
4. **Prioritize:** a dashboard ranks women by risk and waiting time, so the most urgent are seen first and no one is left out.

Emergency danger signs skip the home-visit flow and tell her to **go to the hospital immediately**.

## Features

> Tick each box only when it works in the current version of the repo.

**Woman-facing app**
- [ ] Symptom check with voice input and tap-to-answer
- [ ] Plain-language questions in English
- [ ] Plain-language questions in a second language: `[language]`
- [ ] Risk Meter (Low / Moderate / High) with reasons
- [ ] Emergency screen: "Go to the hospital now"
- [ ] Consent step before sharing location
- [ ] Location capture
- [ ] Auto-generated symptom and risk report (her own words shown beside suggested clinical terms)

**Health worker dashboard**
- [ ] Priority queue ranked by risk
- [ ] Waiting time raises priority (no one left out)
- [ ] Case detail view with report and location
- [ ] Mark a case as visited / resolved

**Alerts**
- [ ] Simulated SMS alert (shows exactly what would be sent)
- [ ] Real SMS alert to a phone number `[optional]`
- [ ] Fallback routing to the nearest clinic when no health worker is available

## Screenshots

| Woman's app | Health worker dashboard |
|---|---|
| `[add screenshot]` | `[add screenshot]` |

## How It Works

```
 Pregnant woman                    SafeMatri                       Health worker
 ─────────────                     ─────────                       ─────────────
 Speaks / taps symptoms  ───►  Rule engine (WHO-based)
                                     │
                          Risk Meter + reasons shown to her
                                     │
                     ┌───────────────┴───────────────┐
                Emergency sign?                 High risk?
                     │                               │
        "Go to hospital now"          Consent → location + report
                                                     │
                                          SMS alert (simulated/real) ───►  Alert received
                                                     │
                                          Priority queue (risk + waiting time)
                                                     │
                                                     └──────────────►  Dashboard: who to visit first
```

## Tech Stack

> Update this list to match what you actually built.

| Layer | Technology |
|---|---|
| Frontend (PWA) | `[e.g., React]`, browser speech recognition, browser geolocation |
| Backend | `[e.g., FastAPI (Python) / Node.js]` |
| Database | `[e.g., SQLite / Supabase]` |
| Rule engine | Human-readable rules in `[JSON / YAML]` |
| Report generation | `[Template-based / LLM-assisted, labeled AI-drafted]` |
| Alerts | `[Simulated SMS panel / SMS provider name]` |
| Hosting | `[e.g., Vercel + Render]` |

## Risk Logic

The Risk Meter is driven by a **rule-based engine** so every result can be explained and reviewed. Rules are stored in a readable file, based on public maternal danger-sign guidance from the World Health Organization and national guidelines, and are meant to be **reviewed by clinicians**.

Example rule format (illustrative):

```json
{
  "id": "severe_headache_blurred_vision",
  "if_all": ["severe_headache", "blurred_vision"],
  "risk": "HIGH",
  "emergency": false,
  "reason": "Severe headache with blurred vision can be a warning sign that needs prompt assessment."
}
```

```json
{
  "id": "heavy_bleeding",
  "if_all": ["heavy_vaginal_bleeding"],
  "risk": "HIGH",
  "emergency": true,
  "reason": "Heavy bleeding in pregnancy is an emergency danger sign. Go to the hospital now."
}
```

The app shows **which warning signs triggered** the result. It does not hide its reasoning.

## Priority Queue

Cases are ordered by a transparent score:

```
priority = risk_weight + (minutes_waiting × aging_rate)
```

Example values (adjustable in config and meant to be tuned with clinician input):

| Risk | `risk_weight` |
|---|---|
| High | 100 |
| Moderate | 50 |
| Low | 10 |

With a small `aging_rate` (for example, 0.05 per minute), higher-risk women are seen first, while lower-risk women gradually rise in the queue the longer they wait. **Nobody is left out.** Emergency cases bypass the queue and are directed to hospital care immediately.

## Getting Started

> Adjust the commands below to match your actual project structure.

### Prerequisites

- `[Node.js 18+]`
- `[Python 3.10+]`
- A modern browser (Chrome recommended for voice input)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/safematri.git
cd safematri

# 2. Backend
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your settings
uvicorn main:app --reload

# 3. Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `[DATABASE_URL]` | Database connection string |
| `[SMS_API_KEY]` | Optional. Only needed for real SMS alerts |
| `[...]` | `[add others]` |

### Demo data

The repo includes **simulated cases** so the dashboard has data to show:

```bash
[command to load demo data]
```

All demo cases are fictional and contain no real patient information.

## Project Structure

> Update to match your repo.

```
safematri/
├── frontend/          # Woman-facing app + health worker dashboard
├── backend/           # API, rule engine, priority queue, alerts
├── rules/             # Danger-sign rules (reviewable by clinicians)
├── docs/              # Documentation and screenshots
└── README.md
```

## Limitations & Responsible Use

- **Not a medical device.** SafeMatri flags risk. It does not diagnose. A health worker or doctor assesses and decides.
- **No medicine recommendations.** The app will not suggest drugs. Treatment decisions belong to doctors.
- **Emergencies come first.** Emergency danger signs lead to "go to the hospital now" guidance, not a wait for a home visit.
- **Rules are not clinically validated.** They are based on public guidelines and need review by clinicians before any real-world use.
- **Prototype limits:** `[list what is simulated, for example: SMS alerts are simulated; voice recognition uses the browser and may need internet; all cases are demo data]`.
- **Privacy:** location and symptoms are shared only with the woman's consent. No real patient data is used in this repository.
- **AI-drafted content:** any report text generated with AI is labeled and intended for clinician review.

## SDG Alignment

- **SDG 3:** Good Health and Well-being (primary)
- **SDG 5:** Gender Equality
- **SDG 9:** Industry, Innovation and Infrastructure
- **SDG 10:** Reduced Inequalities

## Roadmap

- [ ] Fully offline, on-device speech recognition
- [ ] Voice-call and SMS-only access for women without smartphones
- [ ] Facility and appointment guidance from an offline directory
- [ ] Safe interim guidance (danger-sign alerts, when to go immediately, what to bring), with no medicine suggestions
- [ ] More languages through modular language packs
- [ ] Expansion to newborn danger signs, child malnutrition, and TB or diabetes screening
- [ ] Clinician-reviewed rules and a supervised pilot with an NGO or clinic

## Team

**Team Syrah**

- Nithyashri Hamsini R
- Yuvanthika B S
- Harini K
- Shakthi Kaviya M

## Acknowledgements

- World Health Organization maternal health guidance (basis for the danger-sign rules)
- `[open-source libraries and tools used]`
- `[AI-assisted development tools used, if any]`

## License

`[Choose a license, e.g., MIT]`. See [LICENSE](LICENSE).
