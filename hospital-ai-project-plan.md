# 🏥 AI-Powered Hospital System — Technical Project Plan

> Stack: React + Vite · Node.js + Express · MongoDB · Redis · Gemini API · Baileys

---

## 1. TECH STACK DECISIONS

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, modern bundling |
| Styling | TailwindCSS + shadcn/ui | Rapid UI, accessible components |
| State Management | Zustand | Lightweight, no boilerplate |
| Backend | Node.js + Express | Familiar, fast REST APIs |
| Database | MongoDB + Mongoose | Flexible schema for medical data |
| Cache / Queue | Redis (ioredis) | Session store, message queuing |
| Auth | JWT + Refresh Tokens | Stateless, role-aware |
| AI Layer | **Google Gemini API (`gemini-1.5-flash`)** | Fast, cost-effective, multimodal |
| WhatsApp | Baileys (WA Web) | Free, no BSP needed for MVP |
| Job Scheduler | node-cron | Reminders, follow-ups |
| Validation | Zod (shared schema) | Runtime + type safety, shared across client/server |
| Testing | Vitest + Supertest | Unit + API integration tests |

---

## 2. GEMINI API — INTEGRATION DETAILS

### SDK Setup

```bash
npm install @google/generative-ai
```

### Client Singleton (`services/ai/gemini.client.js`)

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use flash for speed/cost, pro for complex reasoning
export const getModel = (modelName = "gemini-1.5-flash") =>
  genAI.getGenerativeModel({ model: modelName });
```

### Chat Session (Multi-turn)

Gemini supports native multi-turn chat via `startChat()`. This maps perfectly to the WhatsApp conversation state:

```js
const model = getModel();
const chat = model.startChat({
  history: conversation.history.map(msg => ({
    role: msg.role,           // "user" | "model"
    parts: [{ text: msg.content }],
  })),
  generationConfig: { maxOutputTokens: 512 },
  systemInstruction: SYSTEM_PROMPT,
});

const result = await chat.sendMessage(userMessage);
const reply = result.response.text();
```

### Key Gemini Differences vs OpenAI

| Feature | OpenAI | Gemini |
|---|---|---|
| Role labels | `user` / `assistant` | `user` / `model` |
| System prompt | `{ role: "system" }` in messages | `systemInstruction` param in `startChat()` |
| Response access | `data.choices[0].message.content` | `result.response.text()` |
| Multi-turn | Managed manually via messages array | Native `chat.sendMessage()` |
| JSON mode | `response_format: { type: "json_object" }` | Prompt instruction + manual parse |

> **Important:** Gemini does not have a native JSON mode like OpenAI. For structured outputs (intent detection, triage severity), you **must** instruct it in the prompt: `"Respond ONLY with valid JSON. No markdown, no explanation."` then wrap the parse in try/catch.

---

## 3. MONOREPO STRUCTURE

```
/hospital-ai/
├── client/                  # React Frontend
├── server/                  # Express Backend
├── shared/                  # Shared Zod schemas, types, constants
├── .env.example
├── docker-compose.yml       # MongoDB + Redis local dev
├── package.json             # Root workspace (npm workspaces)
└── README.md
```

Using **npm workspaces** so `shared/` types/schemas are importable in both `client/` and `server/` without duplication.

---

## 4. BACKEND — DETAILED FOLDER STRUCTURE

```
/server
├── src/
│   ├── config/
│   │   ├── db.js                    # Mongoose connection
│   │   ├── redis.js                 # ioredis client singleton
│   │   └── env.js                   # Validated env vars via Zod
│   │
│   ├── models/
│   │   ├── User.model.js            # Admin, Doctor, Receptionist
│   │   ├── Patient.model.js
│   │   ├── Appointment.model.js
│   │   ├── DoctorSchedule.model.js
│   │   ├── Conversation.model.js    # WhatsApp session history
│   │   └── AuditLog.model.js        # Who did what, when
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── appointment.routes.js
│   │   ├── doctor.routes.js
│   │   ├── webhook.routes.js        # WhatsApp inbound
│   │   └── ai.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── appointment.controller.js
│   │   ├── doctor.controller.js
│   │   ├── webhook.controller.js
│   │   └── ai.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verify + attach req.user
│   │   ├── rbac.middleware.js       # Role guard factory: rbac('admin')
│   │   ├── validate.middleware.js   # Zod schema validator wrapper
│   │   ├── rateLimiter.js           # express-rate-limit per route
│   │   └── errorHandler.js          # Global error catcher
│   │
│   ├── services/
│   │   │
│   │   ├── ai/
│   │   │   ├── gemini.client.js         # Singleton Gemini SDK instance
│   │   │   ├── intentAgent.js           # Classify: booking | triage | faq | unknown
│   │   │   ├── triageAgent.js           # Symptom → severity + safe guidance
│   │   │   ├── bookingAgent.js          # Slot resolution + DB write
│   │   │   ├── faqAgent.js              # Static FAQ responder
│   │   │   ├── notesFormatter.js        # Raw notes → structured output
│   │   │   ├── orchestrator.js          # Routes message to correct agent
│   │   │   └── prompts/
│   │   │       ├── intent.prompt.js
│   │   │       ├── triage.prompt.js
│   │   │       ├── booking.prompt.js
│   │   │       ├── faq.prompt.js
│   │   │       └── notes.prompt.js
│   │   │
│   │   ├── whatsapp/
│   │   │   ├── baileys.client.js        # WA socket init, QR, reconnect logic
│   │   │   ├── messageHandler.js        # On message → call orchestrator
│   │   │   ├── messageSender.js         # send(), sendTemplate(), sendList()
│   │   │   └── sessionStore.js          # Persist Baileys auth state to Redis
│   │   │
│   │   ├── appointments/
│   │   │   ├── slotResolver.js          # Doctor + date → available slots array
│   │   │   ├── bookingService.js        # Create / cancel / reschedule
│   │   │   └── reminderService.js       # node-cron: 24hr + 1hr before appt
│   │   │
│   │   └── notifications/
│   │       └── followUpService.js       # Post-appointment check-in (cron)
│   │
│   ├── jobs/
│   │   ├── reminderJob.js               # Cron: send appointment reminders
│   │   └── followUpJob.js               # Cron: follow-up messages
│   │
│   ├── utils/
│   │   ├── asyncHandler.js              # try/catch wrapper for controllers
│   │   ├── apiResponse.js               # Consistent { success, data, message }
│   │   ├── apiError.js                  # Custom error class with HTTP status
│   │   └── dateHelpers.js               # Slot generation, IST formatting
│   │
│   └── app.js                           # Express setup (no listen here)
│
├── index.js                             # Entry: DB connect → app.listen + Baileys init
├── .env
└── package.json
```

---

## 5. MONGODB SCHEMAS

### `User` (Hospital Staff)

```js
{
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['admin', 'doctor', 'receptionist'] },
  doctorProfile: {           // Populated only when role = 'doctor'
    specialization: String,
    bio: String,
    avatarUrl: String,
  },
  isActive: { type: Boolean, default: true },
  createdAt, updatedAt       // via timestamps: true
}
```

### `Patient`

```js
{
  name: String,
  phone: { type: String, unique: true },   // used as WA identifier
  age: Number,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: String,
  address: String,
  visitHistory: [{
    appointmentId: ObjectId,
    date: Date,
    doctorId: ObjectId,
    notes: String,
  }],
  whatsappOptIn: { type: Boolean, default: true },
  createdAt
}
```

### `Appointment`

```js
{
  patientId:   { type: ObjectId, ref: 'Patient' },
  doctorId:    { type: ObjectId, ref: 'User' },
  date:        Date,
  slotTime:    String,        // "10:30 AM"
  status:      { type: String, enum: ['booked','completed','cancelled','no-show'] },
  bookedVia:   { type: String, enum: ['dashboard', 'whatsapp'] },
  reminderSent:  { type: Boolean, default: false },
  followUpSent:  { type: Boolean, default: false },
  notes:       String,
  createdAt
}
```

### `DoctorSchedule`

```js
{
  doctorId: { type: ObjectId, ref: 'User' },
  weeklySlots: {
    monday:    [{ start: String, end: String }],  // "09:00", "09:30"
    tuesday:   [...],
    wednesday: [...],
    thursday:  [...],
    friday:    [...],
    saturday:  [...],
    sunday:    [],
  },
  blockedDates: [Date],       // holidays, leaves
}
```

### `Conversation` (WA Session State)

```js
{
  phone: { type: String, unique: true },
  patientId: { type: ObjectId, ref: 'Patient', default: null },
  state: {
    type: String,
    enum: ['idle', 'triage', 'booking', 'awaiting_confirm'],
    default: 'idle'
  },
  context: mongoose.Schema.Types.Mixed,   // booking draft, triage step JSON
  history: [{                             // last 10 messages for Gemini context
    role: { type: String, enum: ['user', 'model'] },
    content: String,
    timestamp: Date,
  }],
  updatedAt: Date,
}
```

---

## 6. AI LAYER — HOW IT WORKS END TO END

### Message Flow

```
WA Message Received (Baileys socket)
        ↓
messageHandler.js
        ↓
Load Conversation from MongoDB (state + history)
        ↓
orchestrator.js
        ↓
  If state = 'idle'  →  intentAgent.js (Gemini call #1)
  If state = 'triage'  →  skip intent, continue triageAgent
  If state = 'booking'  →  skip intent, continue bookingAgent
  If state = 'awaiting_confirm'  →  parse yes/no, commit or discard
        ↓
Agent executes → returns { responseText, newState, contextUpdate, appointmentData? }
        ↓
Save updated Conversation to MongoDB
        ↓
messageSender.js → send WA reply
```

### Intent Agent (`intentAgent.js`)

Uses Gemini to classify the incoming message. Prompts it to respond **only in JSON**:

```js
// prompts/intent.prompt.js
export const buildIntentPrompt = (message) => `
You are an intent classifier for a hospital WhatsApp bot.
Classify the user message into ONE of: booking, triage, faq, greeting, unknown.

User message: "${message}"

Respond ONLY with valid JSON. No markdown. No explanation.
Format: { "intent": "<value>", "confidence": <0-1> }
`;
```

Response parsing with fallback:

```js
try {
  const raw = result.response.text();
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return parsed.intent;
} catch {
  return "unknown";   // fallback, send generic help message
}
```

### Triage Agent (`triageAgent.js`)

Multi-turn conversation. Uses `startChat()` with full history. System instruction enforces safe guidance:

```
System: You are a medical triage assistant for {hospitalName}.
- Ask follow-up questions one at a time
- Classify severity as: mild | moderate | severe
- For mild: suggest home remedies + soft consultation nudge
- For moderate: suggest doctor visit
- For severe: urge immediate emergency care
- NEVER diagnose diseases
- NEVER recommend prescription drugs
- ALWAYS end response with: "⚠️ This is general guidance only, not a medical diagnosis."
```

### Booking Agent (`bookingAgent.js`)

Does NOT use LLM for the booking logic itself. LLM only extracts slots from natural language:

```
Flow:
1. Extract { doctorName?, specialization?, preferredDate? } from user message via Gemini
2. Resolve to actual doctorId via DB lookup
3. Call slotResolver.js → get available slots array
4. Present slots to user as numbered list
5. User picks a number → state moves to 'awaiting_confirm'
6. On confirmation → bookingService.js creates the Appointment document
```

### Conversation State Machine

The state field in `Conversation` drives the orchestrator. LLM fills data slots — it does not control flow:

```
idle              →  run intent detection
triage            →  continue multi-turn triage (Gemini chat)
booking           →  continue slot collection sub-flow
awaiting_confirm  →  wait for yes/no from user, then commit or abort
```

---

## 7. PROMPT FILES — STRUCTURE CONVENTION

Each file in `services/ai/prompts/` exports a **builder function** that takes dynamic context and returns a string (system instruction) or messages array:

```js
// prompts/triage.prompt.js
export const buildTriageSystemPrompt = ({ hospitalName }) =>
  `You are a triage assistant for ${hospitalName}. ...rules...`;

// prompts/notes.prompt.js
export const buildNotesPrompt = ({ rawNotes }) =>
  `Convert these raw doctor notes into a structured clinical summary.\n\nNotes:\n${rawNotes}\n\nOutput as JSON: { diagnosis, medications, followUp, vitals }`;
```

This keeps prompts testable in isolation — just call the builder and inspect the output string.

---

## 8. FRONTEND — DETAILED FOLDER STRUCTURE

```
/client
├── src/
│   ├── main.jsx
│   ├── App.jsx                          # React Router v6 setup
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx                # Summary cards + quick actions
│   │   ├── patients/
│   │   │   ├── PatientList.jsx          # Searchable, paginated table
│   │   │   ├── PatientDetail.jsx        # Profile + visit history timeline
│   │   │   └── PatientForm.jsx          # Create / edit
│   │   ├── appointments/
│   │   │   ├── AppointmentCalendar.jsx  # Day/week view
│   │   │   ├── AppointmentList.jsx      # Filterable list view
│   │   │   └── BookingModal.jsx         # Step: doctor → date → slot → confirm
│   │   ├── doctors/
│   │   │   ├── DoctorList.jsx
│   │   │   └── ScheduleConfig.jsx       # Weekly slot editor UI
│   │   ├── analytics/
│   │   │   └── AnalyticsDashboard.jsx   # Charts: appointments, no-shows, trends
│   │   └── ai/
│   │       └── NotesFormatter.jsx       # Doctor tool: paste raw → get structured
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx              # Role-aware nav links
│   │   │   ├── Topbar.jsx
│   │   │   └── RoleGuard.jsx            # Wraps routes, checks role from store
│   │   ├── ui/                          # shadcn/ui re-exports + custom atoms
│   │   ├── appointments/
│   │   │   ├── SlotPicker.jsx           # Visual slot grid
│   │   │   └── StatusBadge.jsx          # Color-coded status pill
│   │   └── patients/
│   │       └── VisitHistoryTimeline.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js                   # Read from authStore, expose helpers
│   │   ├── usePatients.js               # React Query: fetch/mutate patients
│   │   ├── useAppointments.js
│   │   └── useDoctors.js
│   │
│   ├── store/
│   │   ├── authStore.js                 # Zustand: { user, token, role, setAuth, logout }
│   │   └── uiStore.js                   # Sidebar collapsed, active modals
│   │
│   ├── services/
│   │   ├── api.js                       # Axios instance + JWT interceptor + refresh logic
│   │   ├── auth.api.js
│   │   ├── patient.api.js
│   │   └── appointment.api.js
│   │
│   └── utils/
│       ├── rolePermissions.js           # { admin: ['patients','doctors',...], doctor: [...] }
│       └── formatters.js               # Date, phone, slot time formatters
│
└── package.json
```

---

## 9. RBAC IMPLEMENTATION

### Backend — Middleware Factory

```js
// middleware/rbac.middleware.js
export const rbac = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, "Access denied"));
  }
  next();
};

// Usage in route:
router.delete("/patients/:id", authenticate, rbac("admin"), deletePatient);
router.get("/appointments",    authenticate, rbac("admin","doctor","receptionist"), getAppointments);
```

### Frontend — Route Guard

```jsx
// components/layout/RoleGuard.jsx
const RoleGuard = ({ allowedRoles, children }) => {
  const role = useAuthStore(s => s.role);
  return allowedRoles.includes(role) ? children : <Navigate to="/dashboard" />;
};

// Usage:
<RoleGuard allowedRoles={["admin"]}>
  <DoctorManagement />
</RoleGuard>
```

---

## 10. SLOT RESOLVER LOGIC

Pure business logic in `slotResolver.js` — no AI involved:

```
1. Load DoctorSchedule for doctorId
2. Determine weekday of requested date (Monday, Tuesday, etc.)
3. Get slot array for that weekday from weeklySlots
4. Check if date is in blockedDates → return [] if blocked
5. Query Appointments: { doctorId, date, status: 'booked' } → get booked slotTimes
6. return allSlots.filter(slot => !bookedSlotTimes.includes(slot.start))
```

---

## 11. WHATSAPP (BAILEYS) NOTES

- Baileys runs as a **persistent WebSocket** alongside Express, initialized in `index.js`
- On first run → prints QR in terminal → scan once → auth state serialized to Redis
- `baileys.client.js` exports a `getSocket()` singleton used everywhere
- Must handle `connection.update` event: on `close` state → reconnect with backoff
- Re-register `messages.upsert` listener after every reconnect
- Message deduplication via Redis: store last 50 processed message IDs with TTL

---

## 12. CRON JOBS

### `reminderJob.js` — runs every 30 minutes

```
1. Query Appointments where:
   - date is between now+23h and now+25h
   - status = 'booked'
   - reminderSent = false
2. For each → messageSender.send(patient.phone, reminderText)
3. Mark reminderSent = true
```

### `followUpJob.js` — runs every hour

```
1. Query Appointments where:
   - date is between now-25h and now-23h
   - status = 'completed'
   - followUpSent = false
2. For each → messageSender.send(patient.phone, followUpText)
3. Mark followUpSent = true
```

---

## 13. API CONTRACT

```
# Auth
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

# Patients
GET    /api/patients             ?search=&page=&limit=
POST   /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id

# Doctors
GET    /api/doctors
GET    /api/doctors/:id/slots    ?date=YYYY-MM-DD
PUT    /api/doctors/:id/schedule

# Appointments
GET    /api/appointments         ?doctorId=&date=&status=
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id

# WhatsApp webhook (internal — called by Baileys handler, not exposed publicly)
POST   /api/webhook/whatsapp

# AI
POST   /api/ai/process-message   Body: { phone, message }
POST   /api/ai/format-notes      Body: { rawNotes }         (doctor tool)

# Analytics
GET    /api/analytics/summary    ?from=YYYY-MM-DD&to=YYYY-MM-DD
```

---

## 14. ENVIRONMENT VARIABLES

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/hospital_ai
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRY=15m
REFRESH_EXPIRY=7d

# AI — Gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Hospital Config
HOSPITAL_NAME=
HOSPITAL_PHONE=
```

---

## 15. DOCKER COMPOSE (Local Dev)

```yaml
version: "3.8"
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: ["mongo_data:/data/db"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  mongo_data:
```

Start everything: `docker compose up -d`

---

## 16. BUILD ORDER (Recommended Sequence)

| Phase | What to Build | Dependency |
|---|---|---|
| 1 | Zod schemas in `shared/` + Mongo models | Shape of data — everything else depends on this |
| 2 | Auth APIs + JWT middleware + RBAC | Must gate all routes before building features |
| 3 | Patient CRUD APIs + List/Form UI | Core data entity, simple to verify |
| 4 | Doctor schedule model + slot resolver logic | Required before any booking can work |
| 5 | Appointment CRUD APIs + Calendar UI | Core feature |
| 6 | Baileys setup → echo bot (no AI yet) | Verify WA plumbing in isolation |
| 7 | `gemini.client.js` + intent agent (JSON parse) | AI entry point, test in isolation first |
| 8 | Orchestrator + state machine skeleton | Wire intent → route, even if agents are stubs |
| 9 | Triage agent (multi-turn via Gemini chat) | Most complex AI feature |
| 10 | Booking agent (AI extract → slot resolver → DB) | Integrates AI + slots + DB together |
| 11 | FAQ agent | Simple stateless Gemini call, fast win |
| 12 | Cron jobs: reminders + follow-ups | Polish layer, reads existing appointment data |
| 13 | Analytics dashboard (frontend only) | Reads existing data, no new backend needed |
| 14 | Doctor notes formatter | Isolated Gemini call, easy last addition |

---

## 17. SHARED FOLDER (`/shared`)

```
/shared
├── schemas/
│   ├── patient.schema.js      # Zod schema for Patient
│   ├── appointment.schema.js
│   └── auth.schema.js
└── constants/
    ├── roles.js               # export const ROLES = { ADMIN, DOCTOR, RECEPTIONIST }
    └── appointmentStatus.js   # export const STATUS = { BOOKED, COMPLETED, ... }
```

Import in both server and client:
```js
import { patientSchema } from "shared/schemas/patient.schema.js";
```

This eliminates duplicated validation rules between frontend forms and backend controllers.

---

*This document covers the full technical map. Each file has a single responsibility. The Gemini AI layer is fully isolated behind `services/ai/` — swapping models or providers only requires changes to `gemini.client.js` and the prompt builders.*
