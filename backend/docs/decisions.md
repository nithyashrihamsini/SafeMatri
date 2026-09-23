# Key decisions

- **In-memory storage, no database.** Chosen to fit the 2-day/hackathon
  timeline. `src/repositories/` is the only place that would change if a
  real database were added later — everything else (engine, services,
  controllers) is unaware of how cases are stored.
- **Rule-based risk engine, not a black-box model.** Every Risk Meter
  result can point to the exact rule and reason that produced it. This
  matters for a health-adjacent tool: the jury (and any future clinician)
  can review and audit the rules directly in `src/data/rules.js`.
- **SMS is simulated.** Real SMS needs a paid provider and phone number
  registration, which doesn't fit the timeline. `smsLogRepository` stores
  exactly what would have been sent.
- **Consent is enforced at the validator, not just the UI.** Even if the
  frontend has a bug, `POST /api/cases` rejects any request without
  `consent: true`.
- **No medicine suggestions, anywhere.** Enforced by convention across
  `reportBuilder.js`, `smsBuilder.js`, and `assessmentService.js`, all of
  which include a fixed disclaimer line rather than any drug logic.