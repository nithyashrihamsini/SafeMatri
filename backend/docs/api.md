# SafeMatri Backend API

Base URL (local): `http://localhost:5000/api`

All responses are JSON. Errors use this shape:
```json
{ "error": { "code": "MISSING_CONSENT", "message": "Consent is required to create a case." } }
```

## GET /health
Returns `{ "ok": true }`. Use to check the server is running.

## GET /meta
Returns the data the frontend needs to build its screens: `symptoms`, `areas`, `statuses`, `priority` config.

## POST /assess
Preview a Risk Meter result without creating a case.

**Body:** `{ "words"?: string, "symptoms"?: string[] }`

**Response:** `{ detected, symptoms, risk, emergency, reasons, advice, disclaimer }`

## POST /cases
Create a case. Requires `consent: true`.

**Body:** `{ "name"?, "area", "words"?, "symptoms"?, "location"?: {lat,lng}, "consent": true }`

**Response (201):** the full case object, including `report`, `sms`, `assignedTo`, `fallback`.

## GET /cases?status=&assignedTo=&area=
Returns cases sorted by priority (highest first), each with a `waitMinutes` field. All query params optional.

## GET /cases/:id
Returns one case, or 404 `CASE_NOT_FOUND`.

## PATCH /cases/:id/status
**Body:** `{ "status": "new" | "visited" | "resolved" }`

## GET /sms-log?assignedTo=
Returns simulated SMS entries, newest first.

## POST /demo/fast-forward
**Body:** `{ "minutes"?: number }` (default 360). Advances the demo clock.

## POST /demo/reset
Resets the demo clock and reloads the 10 seed cases.