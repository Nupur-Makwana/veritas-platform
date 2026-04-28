<div align="center">

<br/>

```
██╗   ██╗███████╗██████╗ ██╗████████╗ █████╗ ███████╗
██║   ██║██╔════╝██╔══██╗██║╚══██╔══╝██╔══██╗██╔════╝
██║   ██║█████╗  ██████╔╝██║   ██║   ███████║███████╗
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║   ██║   ██╔══██║╚════██║
 ╚████╔╝ ███████╗██║  ██║██║   ██║   ██║  ██║███████║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝
```

### *Turning citizen voices into actionable intelligence.*

<br/>
<!-- Prototype Badge Button -->
[![Prototype](https://img.shields.io/badge/🖊_Prototype-AI_Studio-0a0a0a?style=for-the-badge&labelColor=111)](https://ai.studio/apps/b6ffbb42-4569-4f9b-b77e-7bc2ce1c7b18?fullscreenApplet=true)

[![Prototype Demo](https://img.shields.io/badge/🎬_Prototype_Demo-Soon_to_be_uploaded-0a0a0a?style=for-the-badge&labelColor=111)]()

[![Live App](https://img.shields.io/badge/🌐_LIVE_APP-VERITAS--PLATFORM--TWO.VERCEL.APP-0a0a0a?style=for-the-badge&labelColor=111)](https://veritas-platform-two.vercel.app)

[![Team](https://img.shields.io/badge/🔥_TEAM-AGNEYA-0a0a0a?style=for-the-badge&labelColor=111)]()

<br/>

---

</div>

##  What is Veritas?

**Veritas** is an AI-driven civic intelligence platform that bridges the gap between citizen complaints and real-world government action.

Local governments receive thousands of complaints daily — potholes, broken infrastructure, sanitation issues — scattered across forms, calls, and social media. Most of it goes unheard. Veritas changes that.

> **The problem:** Raw civic data is unstructured, deprioritized, and disconnected from action.  
> **The solution:** AI that listens, understands, prioritizes, and acts.

Veritas converts raw inputs (images, videos, text) into structured reports, routes them to the right workers, tracks resolution, and escalates unresolved issues — all automatically.

<br/>

---

##  System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERITAS PLATFORM                         │
├───────────────┬──────────────────────┬──────────────────────────┤
│ CITIZEN PORTAL│    AI ENGINE CORE    │   ADMIN / CONTROL OFFICE │
│               │                      │                          │
│ • Login       │  ┌────────────────┐  │ • Dashboard Analytics    │
│ • File Comp.  │  │ Multimodal AI  │  │ • Complaint Management   │
│ • Track ID    │  │ (Image/Video/  │  │ • Worker Assignment      │
│ • History     │  │  Text)         │  │ • Fake Detection         │
│ • Escalation  │  ├────────────────┤  │ • Status Tracking        │
│               │  │ NLP Engine     │  │                          │
├───────────────┤  ├────────────────┤  ├──────────────────────────┤
│ WORKER PORTAL │  │ Priority       │  │ EXTERNAL INTEGRATIONS    │
│               │  │ Scoring        │  │                          │
│ • Dashboard   │  ├────────────────┤  │ • Google Maps API        │
│ • Task Queue  │  │ Fake/Scam      │  │ • SMS Gateway            │
│ • Map View    │  │ Detection      │  │ • DigiLocker (sim.)      │
│ • Dept. Alloc │  ├────────────────┤  │ • Social Media API       │
│               │  │ Auto-Assignment│  │                          │
└───────────────┴──┴────────────────┴──┴──────────────────────────┘
```

<br/>

---

##  Key Features

###  Citizen Portal

| Feature | Description |
|---|---|
| **Secure Login** | DigiLocker-style identity verification simulation |
| **AI Complaint Mode** | Upload image or video → AI auto-generates a full structured report |
| **Manual Mode** | Traditional form-based complaint submission |
| **Smart Classification** | Automatic category detection, severity scoring, and priority tagging |
| **Track ID System** | Unique complaint ID for real-time resolution tracking |
| **Auto Escalation** | AI triggers social media escalation if a complaint remains unresolved past deadline |

###  Worker Portal

| Feature | Description |
|---|---|
| **Unique Worker IDs** | Secure, role-based login for field workers |
| **Smart Task Dashboard** | View assigned tasks sorted by priority level |
| **Map View** | Location-based task visualization using Google Maps |
| **Citizen Context** | Full complaint details, severity, and citizen contact info per task |
| **Department Routing** | Tasks auto-assigned by department relevance |

###  Admin / Control Office

| Feature | Description |
|---|---|
| **Live Analytics Dashboard** | Real-time totals: complaints filed, solved, pending, urgent |
| **Complaint Management** | Filter by All / Urgent / Fake — with AI-flagged alerts |
| **Fake Detection** | AI model identifies fraudulent or duplicate complaints |
| **Auto-Summarization** | AI condenses lengthy complaints into actionable briefs |
| **Worker Assignment** | AI-recommended or manual assignment to the right worker |
| **Rejection Messages** | AI drafts personalized SMS rejection messages for invalid complaints |
| **Status Tracking** | Full lifecycle: Pending → Under Process → Resolved |

<br/>

---

##  AI Capabilities

```
┌─────────────────────────────────────────────────────┐
│                   AI ENGINE LAYERS                  │
├──────────────────────────────────────────────────────┤
│    Computer Vision    → Image & video analysis    │
│    NLP                → Text understanding & NER  │
│    Priority Engine    → Urgency scoring model     │
│    Fraud Detection    → Fake/scam complaint flag  │
│    Auto-Assignment    → Department-worker routing │
│    Predictive Engine  → Trend & hotspot analysis  │
│    Escalation AI      → Social trigger logic      │
└──────────────────────────────────────────────────────┘
```

- **Multimodal Understanding** — Processes images, videos, and text in a unified pipeline
- **Natural Language Processing** — Extracts complaint categories, entities, and urgency signals from free text
- **Computer Vision** — Identifies infrastructure damage, waste, flooding, etc. from uploaded media
- **Fake/Scam Detection** — Flags duplicate, malicious, or fraudulent submissions before admin review
- **Smart Prioritization** — Scores complaints by urgency, public impact, and recurrence
- **Automated Assignment** — Maps complaints to the most relevant department and available worker
- **Predictive Insights** — Identifies geographic and seasonal trends across complaint clusters
- **AI Escalation** — Automatically drafts and triggers social escalation if resolution is overdue

<br/>

---

##  Demo Flow

```
  CITIZEN                AI ENGINE              ADMIN              WORKER
     │                       │                    │                  │
     │  Upload image/video   │                    │                  │
     │──────────────────────►│                    │                  │
     │                       │  Generate report   │                  │
     │                       │  + priority score  │                  │
     │◄──────────────────────│                    │                  │
     │  Receive Track ID     │                    │                  │
     │                       │  Send to admin     │                  │
     │                       │───────────────────►│                  │
     │                       │                    │  Review & approve│
     │                       │                    │  AI assigns worker
     │                       │                    │─────────────────►│
     │                       │                    │                  │  Receive task
     │                       │                    │                  │  + map location
     │                       │                    │                  │
     │  [If unresolved past SLA]                  │                  │
     │◄─────────────── AI triggers escalation ────│                  │
```

<br/>

---

##  Platform Highlights

| Capability | Detail |
|---|---|
| **Multi-language** | English + major Indian languages supported |
| **Responsive Design** | Fully optimized for Desktop and Mobile |
| **Theme Support** | Light & Dark mode |
| **Real-time Dashboards** | Live complaint counts, worker status, resolution rates |
| **Maps Integration** | Google Maps for geo-tagged complaint tracking |

<br/>

---

##  Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React / Next.js |
| **Backend** | Node.js / Python |
| **AI/ML** | Multimodal LLM, Computer Vision, NLP Models |
| **Database** | PostgreSQL / Firebase |
| **Maps** | Google Maps API |
| **Auth** | DigiLocker-style simulation |
| **Deployment** | Vercel |

<br/>

---

##  Project Structure

```
veritas/
├── citizen-portal/          # Citizen-facing complaint interface
│   ├── ai-mode/             # Multimodal upload & AI report generation
│   └── manual-mode/         # Form-based complaint submission
├── worker-portal/           # Worker dashboard & task management
├── admin-portal/            # Control office dashboard
├── ai-engine/               # Core AI modules
│   ├── vision/              # Computer vision pipeline
│   ├── nlp/                 # Text analysis & classification
│   ├── prioritization/      # Urgency scoring engine
│   ├── fraud-detection/     # Fake complaint detection
│   └── escalation/          # Auto-escalation logic
└── shared/                  # Shared components, utilities, API clients
```

<br/>

---

##  Vision

We are building a smarter civic ecosystem : one where **citizen voices are not just heard, but understood and acted upon** through intelligent systems that leave no complaint behind.

Veritas is not just a complaint portal. It is a **civic intelligence layer** for local governments: turning noise into signal, and signal into action.

<br/>

---

##  Team Agneya

> *"Agneya" — Sanskrit for "born of fire."*  
> *Energy. Transformation. Unstoppable force.*

Team Agneya builds bold, AI-driven solutions that turn challenges into action. We are fueled by innovation and a singular purpose: creating systems that bring clarity, impact, and real-world change to the communities that need it most.

<br/>

---

<div align="center">

**Veritas** · Built by Team Agneya  
*Turning citizen voices into actionable intelligence.*

</div>
