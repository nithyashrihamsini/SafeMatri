# Editing the risk rules

Rules live in `src/data/rules.js`. Each rule:

```js
{ all: ["severe_headache", "blurred_vision"], risk: RISK.HIGH, emergency: false, reason: "..." }
```

- `all`: symptom keys (from `src/data/symptoms.js`) that must ALL be present.
- `risk`: RISK.LOW / RISK.MODERATE / RISK.HIGH.
- `emergency` (optional): if true, the woman is told to go to hospital now.
- `reason`: shown to her and in the health worker's report — keep it plain language.

If more than one rule matches, the **highest risk level** wins, and only
reasons for that risk level are shown (see `src/engine/riskEngine.js`).

## Clinician review log

| Date | Reviewer | Notes |
|---|---|---|
| _(pending)_ | | Rules are illustrative, based on general maternal danger-sign guidance, and have not yet been reviewed by a clinician. |