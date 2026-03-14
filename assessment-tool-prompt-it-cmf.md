# IT Capability Maturity Assessment Tool — Implementation Prompt

> **Purpose:** Implementation prompt for building the IT-CMF assessment tool using Claude Code.
> All `{{PLACEHOLDER}}` values have been replaced with IT-CMF domain-specific content.

---

## 1. Branding & Design

All assessment tools follow the shared Peraton design system.

- **Design guide:** `/Users/john/Dev/Assessments/Design-guide.md`
- **Logo:** `/Users/john/Dev/Assessments/2025_Peraton_Logo_2000x541px_White_White.png`
- **Theme:** Dark mode — page background `#0A0A0B`, surfaces `#131212`/`#1C1C1E`/`#262626`/`#333333`
- **Primary accent:** `#1BA1E2` (Peraton Cyan)
- **Text:** White `#FFFFFF` primary, Light Gray `#D0D0D0` secondary
- **Font stack:** `"Segoe UI", -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`
- **Logo placement:** Sidebar top-left, ~160px wide on dark surface; loading screen centered ~300px wide

---

## 2. Tech Stack (Fixed)

All assessment tools use this exact stack. Do not substitute.

### Backend
| Package | Purpose |
|---------|---------|
| Python 3 | Runtime |
| FastAPI | API framework |
| Uvicorn | ASGI server |
| Pydantic v2 | Data models & validation |
| openpyxl | Excel (.xlsx) export |
| docxtpl | Word (.docx) export (template-based, wraps python-docx) |
| python-pptx | PowerPoint (.pptx) export |
| matplotlib (Agg backend) | Radar chart PNG generation |
| PyInstaller | Standalone executable packaging |

### Frontend
| Package | Purpose |
|---------|---------|
| React 19 | UI framework |
| TypeScript 5.9+ | Type safety |
| Vite 7 | Build tool + dev server |
| Tailwind CSS 4 | Utility-first styling |
| Recharts | Interactive charts (RadarChart, BarChart) |
| Lucide React | Icon library |
| React Router 7 | Client-side routing |

### Python virtual environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 3. Domain Configuration

### Identity
```
TOOL_NAME:              "IT Capability Maturity Assessment Tool"
TOOL_SLUG:              "it-cmf"
FRAMEWORK_ALIGNMENT:    "IVI IT-CMF v2.0"
SIDEBAR_STORAGE_KEY:    "it-cmf-sidebar"
DEFAULT_PORT:           8761 (auto-scans 8761-8770)
```

### Hierarchy Model

This tool uses the **Grouped (3-level nesting)** hierarchy:

```
Macro-Capability                    # e.g., "Managing IT like a Business" (container)
  └── Critical Capability           # e.g., "Strategic Planning" (scored + weighted)
       └── Capability Area
            └── Assessment Item
```

```
HIERARCHY_STYLE:        "grouped"
TOP_LEVEL_ENTITIES:     [
  {
    "id": "managing-it-like-a-business",
    "name": "Managing IT like a Business",
    "children": ["aa","bp","bpm","cfp","dsm","eim","git","gov","im","ldp","ocm","odp","rm","sai","ssm","sp"]
  },
  {
    "id": "managing-the-it-budget",
    "name": "Managing the IT Budget",
    "children": ["bgm","bop","ff"]
  },
  {
    "id": "managing-the-it-capability",
    "name": "Managing the IT Capability",
    "children": ["cam","da","eam","ism","km","pam","pdp","pgm","pm","rem","sd","srp","tim","ued","utm"]
  },
  {
    "id": "managing-it-for-business-value",
    "name": "Managing IT for Business Value",
    "children": ["bar","ppm","tco"]
  }
]

MID_LEVEL_ENTITIES:     [
  {"id":"aa","name":"Accounting & Allocation","weight":0.028},
  {"id":"bp","name":"Business Planning","weight":0.028},
  {"id":"bpm","name":"Business Process Management","weight":0.028},
  {"id":"cfp","name":"Capacity Forecasting & Planning","weight":0.028},
  {"id":"dsm","name":"Demand & Supply Management","weight":0.028},
  {"id":"eim","name":"Enterprise Information Management","weight":0.028},
  {"id":"git","name":"Green IT","weight":0.028},
  {"id":"gov","name":"Governance","weight":0.028},
  {"id":"im","name":"Innovation Management","weight":0.028},
  {"id":"ldp","name":"Leadership","weight":0.028},
  {"id":"ocm","name":"Organizational Change Management","weight":0.028},
  {"id":"odp","name":"Organization Design & Planning","weight":0.028},
  {"id":"rm","name":"Risk Management","weight":0.028},
  {"id":"sai","name":"Service Analytics & Intelligence","weight":0.028},
  {"id":"ssm","name":"Sourcing & Supplier Management","weight":0.028},
  {"id":"sp","name":"Strategic Planning","weight":0.028},
  {"id":"bgm","name":"Budget Management","weight":0.028},
  {"id":"bop","name":"Budget Oversight & Performance Analysis","weight":0.028},
  {"id":"ff","name":"Funding & Financing","weight":0.028},
  {"id":"cam","name":"Capability Assessment Management","weight":0.028},
  {"id":"da","name":"Data Analytics","weight":0.028},
  {"id":"eam","name":"Enterprise Architecture Management","weight":0.028},
  {"id":"ism","name":"Information Security Management","weight":0.028},
  {"id":"km","name":"Knowledge Management","weight":0.028},
  {"id":"pam","name":"People Asset Management","weight":0.028},
  {"id":"pdp","name":"Personal Data Protection","weight":0.028},
  {"id":"pgm","name":"Programme Management","weight":0.028},
  {"id":"pm","name":"Project Management","weight":0.028},
  {"id":"rem","name":"Relationship Management","weight":0.028},
  {"id":"sd","name":"Solution Delivery","weight":0.028},
  {"id":"srp","name":"Service Provisioning","weight":0.028},
  {"id":"tim","name":"Technical Infrastructure Management","weight":0.028},
  {"id":"ued","name":"User Experience Design","weight":0.028},
  {"id":"utm","name":"User Training Management","weight":0.028},
  {"id":"bar","name":"Benefits Assessment & Realisation","weight":0.028},
  {"id":"ppm","name":"Project Portfolio Management","weight":0.028},
  {"id":"tco","name":"Total Cost of Ownership","weight":0.028}
]
```

### Scoring
```
SCORE_SCALE:            "1-5"
SCORE_LABELS:           {1:"Initial", 2:"Basic", 3:"Intermediate", 4:"Advanced", 5:"Optimizing"}
SCORE_COLORS:           {1:"#ef4444", 2:"#f97316", 3:"#eab308", 4:"#84cc16", 5:"#22c55e"}
RUBRIC_KEYS:            ["initial","basic","intermediate","advanced","optimizing"]
```

### Maturity Bands
```
MATURITY_BANDS:         [
  {min:1.0, max:1.8, label:"Initial",       color:"#ef4444"},
  {min:1.8, max:2.6, label:"Basic",         color:"#f97316"},
  {min:2.6, max:3.4, label:"Intermediate",  color:"#eab308"},
  {min:3.4, max:4.2, label:"Advanced",      color:"#84cc16"},
  {min:4.2, max:5.0, label:"Optimizing",    color:"#22c55e"}
]
```

### Weighting Models
```
WEIGHTING_MODELS:       {
  "balanced": {
    label: "Balanced",
    weights: {
      "managing-it-like-a-business": 0.25,
      "managing-the-it-budget": 0.25,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.25
    }
  },
  "cc_proportional": {
    label: "CC-Proportional",
    weights: {
      "managing-it-like-a-business": 0.444,
      "managing-the-it-budget": 0.083,
      "managing-the-it-capability": 0.389,
      "managing-it-for-business-value": 0.083
    }
  },
  "value_focused": {
    label: "Value-Focused",
    weights: {
      "managing-it-like-a-business": 0.30,
      "managing-the-it-budget": 0.15,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.30
    }
  }
}
DEFAULT_WEIGHTING:      "balanced"
DEFAULT_TARGET_SCORE:   3.0
```

### Exports & Distribution
```
EXPORT_TYPES:           ["findings","executive-summary","gap-analysis","workbook","outbrief","heatmap","quick-wins","cc-roadmap"]
DIST_FOLDER_NAME:       "ITCMFAssessment"
```

### Optional Extension Module
```
EXTENSION_ENABLED:      false
```

---

## 4. Project Structure

```
it-cmf/
├── backend/
│   ├── __init__.py
│   ├── main.py                        # FastAPI app — serves API + built frontend
│   ├── models.py                      # Pydantic data models
│   ├── data_manager.py                # Load/save assessment + framework JSON
│   ├── export_engine.py               # All export generators
│   └── static/                        # Vite build output (generated)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts                 # Proxy /api → backend in dev
│   ├── tailwind.config.ts             # Design tokens from Design-guide.md
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── index.html
│   └── src/
│       ├── main.tsx                   # React entry point
│       ├── App.tsx                    # Router + layout (sidebar + content)
│       ├── store.tsx                  # React Context state management
│       ├── types.ts                   # TypeScript interfaces + constants
│       ├── api.ts                     # Fetch client for /api/*
│       ├── scoring.ts                 # Score calculations
│       ├── validation.ts              # Assessment validation rules
│       ├── hooks/
│       │   └── useNextUnscored.ts     # Cmd+Right jump-to-next-unscored logic
│       ├── components/
│       │   ├── Sidebar.tsx            # Collapsible nav tree with progress rings
│       │   ├── AssessmentItemCard.tsx  # Item card with scoring + notes
│       │   ├── ScoringWidget.tsx      # 1-5 radio buttons + N/A toggle
│       │   ├── ConfidenceWidget.tsx   # High/Medium/Low selector
│       │   ├── Breadcrumb.tsx         # Path breadcrumbs
│       │   ├── StatsFooter.tsx        # Progress bar + save status
│       │   ├── CommandPalette.tsx     # Cmd+K quick navigation
│       │   └── OnboardingTooltip.tsx  # First-time hints
│       └── pages/
│           ├── ClientInfo.tsx         # Client name, industry, date, assessor
│           ├── Dashboard.tsx          # Composite score, radar chart, progress
│           ├── CriticalCapabilitySummary.tsx  # Critical Capability summary view
│           ├── CapabilityArea.tsx     # Item-level scoring (main work page)
│           ├── Export.tsx             # Export deliverables UI
│           ├── Settings.tsx           # Weighting model, target scores
│           └── Help.tsx              # Keyboard shortcuts, documentation
├── framework/
│   └── assessment-framework.json      # Read-only framework definition
├── templates/                         # (Optional) Word/Excel/PowerPoint templates
├── exports/                           # Generated deliverables (created at runtime)
├── build.py                           # Build orchestration script
├── assessment-tool-macos.spec         # PyInstaller spec — macOS
├── assessment-tool-windows.spec       # PyInstaller spec — Windows
├── requirements.txt                   # Python dependencies
├── data.json                          # Persistent assessment data (auto-created)
├── data.json.bak                      # Backup (auto-created on save)
├── README.txt                         # End-user documentation
└── .gitignore
```

---

## 5. Data Model

### Backend — Pydantic Models (`backend/models.py`)

```python
from pydantic import BaseModel, Field
from typing import Optional

class EvidenceReference(BaseModel):
    document: str = ""
    section: str = ""
    date: str = ""

class AssessmentItem(BaseModel):
    id: str
    text: str
    score: Optional[int] = Field(None, ge=1, le=5)
    na: bool = False
    na_justification: Optional[str] = None
    confidence: Optional[str] = None  # "High" | "Medium" | "Low"
    notes: str = ""
    evidence_references: list[EvidenceReference] = Field(default_factory=list)
    attachments: list[str] = Field(default_factory=list)  # Optional: file attachment paths

class CapabilityArea(BaseModel):
    id: str
    name: str
    items: list[AssessmentItem] = Field(default_factory=list)

# --- Grouped Hierarchy ---
class CriticalCapability(BaseModel):
    id: str
    name: str
    weight: float
    capability_areas: list[CapabilityArea] = Field(default_factory=list)

class MacroCapability(BaseModel):
    id: str
    name: str
    critical_capabilities: list[CriticalCapability] = Field(default_factory=list)

# --- Shared Models ---
class ClientInfo(BaseModel):
    name: str = ""
    industry: str = ""
    assessment_date: str = ""
    assessor: str = ""

class AssessmentMetadata(BaseModel):
    framework_version: str = "1.0"
    tool_version: str = "1.0.0"
    last_modified: str = ""

class ScoringConfig(BaseModel):
    weighting_model: str = "balanced"
    cc_weights: dict[str, float] = Field(default_factory=dict)
    custom_weights: Optional[dict[str, float]] = None

class AssessmentData(BaseModel):
    client_info: ClientInfo = Field(default_factory=ClientInfo)
    assessment_metadata: AssessmentMetadata = Field(default_factory=AssessmentMetadata)
    scoring_config: ScoringConfig = Field(default_factory=ScoringConfig)
    macro_capabilities: list[MacroCapability] = Field(default_factory=list)
    extension_enabled: bool = False
    extension: Optional[dict] = None
    target_scores: dict[str, float] = Field(default_factory=dict)
```

### Frontend — TypeScript Interfaces (`frontend/src/types.ts`)

```typescript
// Score constants
export const SCORE_LABELS: Record<number, string> = {1:"Initial", 2:"Basic", 3:"Intermediate", 4:"Advanced", 5:"Optimizing"};
export const SCORE_COLORS: Record<number, string> = {1:"#ef4444", 2:"#f97316", 3:"#eab308", 4:"#84cc16", 5:"#22c55e"};
export const MATURITY_BANDS = [
  {min:1.0, max:1.8, label:"Initial",       color:"#ef4444"},
  {min:1.8, max:2.6, label:"Basic",         color:"#f97316"},
  {min:2.6, max:3.4, label:"Intermediate",  color:"#eab308"},
  {min:3.4, max:4.2, label:"Advanced",      color:"#84cc16"},
  {min:4.2, max:5.0, label:"Optimizing",    color:"#22c55e"}
];
export const WEIGHTING_MODELS: Record<string, { label: string; weights: Record<string, number> }> = {
  "balanced": {
    label: "Balanced",
    weights: {
      "managing-it-like-a-business": 0.25,
      "managing-the-it-budget": 0.25,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.25
    }
  },
  "cc_proportional": {
    label: "CC-Proportional",
    weights: {
      "managing-it-like-a-business": 0.444,
      "managing-the-it-budget": 0.083,
      "managing-the-it-capability": 0.389,
      "managing-it-for-business-value": 0.083
    }
  },
  "value_focused": {
    label: "Value-Focused",
    weights: {
      "managing-it-like-a-business": 0.30,
      "managing-the-it-budget": 0.15,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.30
    }
  }
};

// Utility function — maps a numeric score to its maturity band
export function getMaturityBand(score: number): { label: string; color: string } { ... }

// Assessment interfaces — mirror backend models
export interface EvidenceReference { document: string; section: string; date: string; }
export interface AssessmentItem { id: string; text: string; score: number | null; na: boolean; na_justification: string | null; confidence: string | null; notes: string; evidence_references: EvidenceReference[]; attachments: string[]; }
export interface CapabilityArea { id: string; name: string; items: AssessmentItem[]; }

// Grouped hierarchy interfaces
export interface CriticalCapability { id: string; name: string; weight: number; capability_areas: CapabilityArea[]; }
export interface MacroCapability { id: string; name: string; critical_capabilities: CriticalCapability[]; }

// Framework read-only interfaces
export interface FrameworkItem { id: string; text: string; rubric: Record<string, string>; }
// rubric keys = ["initial","basic","intermediate","advanced","optimizing"]
export interface FrameworkCapabilityArea { id: string; name: string; items: FrameworkItem[]; }
// ... rest mirrors framework JSON structure ...

export interface ClientInfo { name: string; industry: string; assessment_date: string; assessor: string; }
export interface AssessmentMetadata { framework_version: string; tool_version: string; last_modified: string; }
```

---

## 6. API Routes

All tools expose exactly these endpoints:

| Method | Endpoint | Request Body | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/assessment` | — | Full `AssessmentData` JSON |
| `PUT` | `/api/assessment` | `AssessmentData` JSON | `{"status": "saved"}` |
| `GET` | `/api/framework` | — | Framework JSON (read-only) |
| `POST` | `/api/export/{type}` | — | `{"filenames": ["path1", ...]}` |

### Implementation Details (`backend/main.py`)

- **Port discovery:** Try `8761` through `8770`, use first available; log port diagnostics (`lsof`/`netstat`) if all ports busy
- **Auto-launch browser:** Call `webbrowser.open(url)` after server starts
- **Static files:** Serve built frontend from `backend/static/`
- **SPA fallback:** All non-`/api/*` GET requests serve `index.html`
- **No CORS needed:** Vite dev server proxies `/api` requests, so no CORS middleware required
- **Atomic save:** Write to temp file, then `os.replace()` to swap into `data.json`; write `data.json.bak` before overwriting
- **Load behavior:** Try `data.json` → fall back to `data.json.bak` → create fresh from framework
- **Export types:** `["findings","executive-summary","gap-analysis","workbook","outbrief","heatmap","quick-wins","cc-roadmap"]` + `"all"`
- **Error codes:** 400 invalid export type, 404 framework missing, 500 server error

---

## 7. Pages & Routing

```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<ClientInfoPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />

    {/* --- Grouped Hierarchy --- */}
    <Route path="/critical-capabilities/:entityId" element={<CriticalCapabilitySummary />} />
    <Route path="/critical-capabilities/:entityId/:areaId" element={<CapabilityAreaPage />} />

    {/* --- Standard pages --- */}
    <Route path="/export" element={<ExportPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/help" element={<HelpPage />} />
  </Routes>
</BrowserRouter>
```

### Global Keyboard Shortcuts
- `Cmd/Ctrl+K` — Toggle Command Palette
- `Cmd/Ctrl+Right` — Jump to next unscored item

### CapabilityArea Page Keyboard Shortcuts
- `1`-`5` — Set score on focused item
- `H`/`M`/`L` — Set confidence (High/Medium/Low)
- `N` — Toggle N/A
- `Arrow Up/Down` — Navigate between items

---

## 8. Sidebar Structure

### Layout
```
[Logo ~160px wide]
──────────────────
Client Info          (link → /)
Dashboard            (link → /dashboard)
──────────────────

Macro-Capability 1: MANAGING IT LIKE A BUSINESS    [score badge] [progress ring] [chevron]
  ├── Critical Capability: Accounting & Allocation   [score] [ring]
  │     (capability areas expand on click)
  ├── Critical Capability: Business Planning         [score] [ring]
  ├── Critical Capability: Business Process Mgmt     [score] [ring]
  └── ... (16 CCs total)

Macro-Capability 2: MANAGING THE IT BUDGET
  ├── Critical Capability: Budget Management         [score] [ring]
  ├── Critical Capability: Budget Oversight & Perf.  [score] [ring]
  └── Critical Capability: Funding & Financing       [score] [ring]

Macro-Capability 3: MANAGING THE IT CAPABILITY
  └── ... (15 CCs)

Macro-Capability 4: MANAGING IT FOR BUSINESS VALUE
  └── ... (3 CCs)

──────────────────

Export               (link → /export)
Settings             (link → /settings)
Help                 (link → /help)
```

### Behavior
- **Collapsible:** Toggle between 56px icon-only and full width
- **Resizable:** Drag right edge (min: `180px`, max: `480px`, default: `350px`)
- **Persist state:** `localStorage` key `it-cmf-sidebar`
- **Progress rings:** SVG circle showing % scored per entity
- **Score badges:** Rounded average score, color-coded by `{1:"#ef4444", 2:"#f97316", 3:"#eab308", 4:"#84cc16", 5:"#22c55e"}`
- **Chevron expand:** Click to show/hide children in tree

---

## 9. Export Deliverables

### Core Exports (all tools)

| # | Name | Format | Content |
|---|------|--------|---------|
| 1 | Assessment Findings | DOCX | Per-CC item breakdown with scores, notes, evidence |
| 2 | Executive Summary | DOCX | Composite score, radar chart (embedded PNG), top gaps |
| 3 | Gap Analysis & Roadmap | DOCX | Gap matrix table (current vs target), remediation timeline |
| 4 | Scored Assessment Workbook | XLSX | Multi-sheet: Dashboard + per-CC sheets with all items |
| 5 | Out-Brief Presentation | PPTX | Title + overview + radar chart + per-CC slides |

### Domain-Specific Exports

| # | Name | Format | Content |
|---|------|--------|---------|
| 6 | Maturity Heatmap | XLSX | CC × Macro-Capability color-coded grid |
| 7 | Quick Wins Report | DOCX | Low-score high-impact items for rapid improvement |
| 8 | CC Improvement Roadmap | DOCX | Per-CC action plans with prioritized improvements |

### Export Implementation Details
- **Filenames:** `D-XX_Name_YYYY-MM-DD_HHMMSS.ext` (timestamped)
- **Radar chart:** matplotlib Agg backend → `exports/radar_chart.png` (6×6 in, 150 DPI)
- **Template support:** If `templates/<name>-template.<ext>` exists, use it; otherwise auto-generate
- **"Export All" button:** Generates core exports + domain-specific

---

## 10. Key Behaviors

### Auto-Save
- **Debounce:** 300ms after any data change
- **Mechanism:** `PUT /api/assessment` with full `AssessmentData`
- **Backup:** Server writes `data.json.bak` before overwriting `data.json`
- **Status indicator:** StatsFooter shows "Saving..." / "Saved" / "Error"

### Scoring Engine (`frontend/src/scoring.ts`)
```typescript
averageScore(items: AssessmentItem[]): number      // Mean of scored items (exclude N/A)
capabilityAreaScore(ca: CapabilityArea): number     // Average of CA items
entityScore(entity: Entity): number                 // Average of all items in entity
weightedCompositeScore(data: AssessmentData): number // Σ(entityScore × weight) / Σ(weights)
overallCompletion(data: AssessmentData): {scored: number, total: number}
```

### Command Palette (`Cmd+K`)
- Fuzzy search across all entities + capability areas
- Navigate to any page instantly
- Show score + completion status in results

### Validation (`frontend/src/validation.ts`)
| Rule | Severity | Condition |
|------|----------|-----------|
| `unscored` | info | Item has no score and is not N/A |
| `na-no-justification` | error | N/A checked but no justification |
| `scored-no-notes` | warning | Score assigned but notes empty |
| `low-confidence-no-notes` | warning | Confidence = "Low" with no notes |

### Charts (Dashboard)
- **Radar chart:** Recharts `RadarChart` — one axis per weighted entity, scale 0–5
- **Bar chart:** Recharts `BarChart` — entity scores with maturity band colors
- **Progress:** Overall completion percentage + per-entity progress rings

### State Management (`frontend/src/store.tsx`)
- React Context with `useReducer` pattern
- `StoreProvider` wraps entire app
- `useStore()` hook returns `{data, framework, loading, saveStatus, updateData}`
- `updateData()` uses `structuredClone` for immutable updates

---

## 11. Framework Content

The framework JSON defines all assessment items and rubrics. Place at `framework/assessment-framework.json`.

### Structure

```json
{
  "version": "1.0",
  "framework_alignment": "IVI IT-CMF v2.0",

  "macro_capabilities": [
    {
      "id": "managing-it-like-a-business",
      "name": "Managing IT like a Business",
      "critical_capabilities": [
        {
          "id": "sp",
          "name": "Strategic Planning",
          "weight": 0.028,
          "capability_areas": [
            {
              "id": "sp-ca1",
              "name": "IT Vision & Mission Alignment",
              "items": [
                {
                  "id": "sp-1-1",
                  "text": "The organization has a documented IT strategy aligned with business objectives.",
                  "rubric": {
                    "initial": "No formal IT strategy exists. IT decisions are ad hoc and reactive.",
                    "basic": "A basic IT strategy document exists but is not consistently aligned with business goals.",
                    "intermediate": "IT strategy is documented, aligned with business objectives, and reviewed periodically.",
                    "advanced": "IT strategy is fully integrated with business strategy, with formal alignment processes and regular reviews.",
                    "optimizing": "IT strategy co-evolves with business strategy through continuous feedback loops and predictive analytics."
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  "weighting_models": {
    "balanced": {
      "label": "Balanced",
      "weights": {
        "managing-it-like-a-business": 0.25,
        "managing-the-it-budget": 0.25,
        "managing-the-it-capability": 0.25,
        "managing-it-for-business-value": 0.25
      }
    },
    "cc_proportional": {
      "label": "CC-Proportional",
      "weights": {
        "managing-it-like-a-business": 0.444,
        "managing-the-it-budget": 0.083,
        "managing-the-it-capability": 0.389,
        "managing-it-for-business-value": 0.083
      }
    },
    "value_focused": {
      "label": "Value-Focused",
      "weights": {
        "managing-it-like-a-business": 0.30,
        "managing-the-it-budget": 0.15,
        "managing-the-it-capability": 0.25,
        "managing-it-for-business-value": 0.30
      }
    }
  }
}
```

### Content Specification

Generate assessment items based on the IVI IT-CMF v2.0 framework for all 37 Critical Capabilities across 4 Macro-Capabilities. Each CC should have 2-4 Capability Areas, and each Capability Area should have 3-6 assessment items with 5-level rubrics (initial, basic, intermediate, advanced, optimizing). Target approximately 300-400 total assessment items. The rubric descriptions should reflect IT-CMF's maturity progression from ad hoc/reactive practices to optimized/predictive management capabilities.

**Macro-Capability 1: Managing IT like a Business** (16 CCs)
- Accounting & Allocation (AA): IT cost tracking, chargeback/showback models, cost transparency
- Business Planning (BP): IT-business alignment planning, strategic roadmaps, planning cycles
- Business Process Management (BPM): Process documentation, optimization, automation maturity
- Capacity Forecasting & Planning (CFP): Demand forecasting, resource capacity, scalability planning
- Demand & Supply Management (DSM): Service catalog, demand prioritization, supply optimization
- Enterprise Information Management (EIM): Data governance, information lifecycle, data quality
- Green IT (GIT): Energy efficiency, sustainable practices, environmental impact measurement
- Governance (GOV): IT governance frameworks, decision rights, compliance oversight
- Innovation Management (IM): Innovation processes, idea management, emerging technology adoption
- Leadership (LDP): IT leadership effectiveness, vision communication, stakeholder engagement
- Organizational Change Management (OCM): Change readiness, adoption frameworks, cultural transformation
- Organization Design & Planning (ODP): IT org structure, roles/responsibilities, workforce planning
- Risk Management (RM): IT risk identification, assessment, mitigation, monitoring
- Service Analytics & Intelligence (SAI): Service metrics, analytics capabilities, insight-driven decisions
- Sourcing & Supplier Management (SSM): Vendor strategy, contract management, supplier performance
- Strategic Planning (SP): IT strategy formulation, alignment, execution tracking

**Macro-Capability 2: Managing the IT Budget** (3 CCs)
- Budget Management (BGM): Budget planning, allocation, tracking, variance analysis
- Budget Oversight & Performance Analysis (BOP): Financial controls, performance reporting, ROI tracking
- Funding & Financing (FF): Funding models, investment prioritization, financial sustainability

**Macro-Capability 3: Managing the IT Capability** (15 CCs)
- Capability Assessment Management (CAM): Maturity assessments, capability benchmarking, gap analysis
- Data Analytics (DA): Analytics infrastructure, data science, self-service analytics
- Enterprise Architecture Management (EAM): Architecture frameworks, standards, roadmaps, governance
- Information Security Management (ISM): Security posture, threat management, incident response
- Knowledge Management (KM): Knowledge capture, sharing, reuse, organizational learning
- People Asset Management (PAM): Talent acquisition, development, retention, succession planning
- Personal Data Protection (PDP): Privacy frameworks, data protection, regulatory compliance
- Programme Management (PGM): Programme governance, benefits tracking, interdependency management
- Project Management (PM): Project methodology, delivery, quality, stakeholder management
- Relationship Management (REM): Business relationship management, stakeholder satisfaction, communication
- Solution Delivery (SD): SDLC maturity, DevOps practices, quality assurance, deployment
- Service Provisioning (SRP): Service delivery, SLA management, operational excellence
- Technical Infrastructure Management (TIM): Infrastructure strategy, operations, modernization, reliability
- User Experience Design (UED): UX research, design systems, accessibility, user-centered design
- User Training Management (UTM): Training programs, skills development, adoption support

**Macro-Capability 4: Managing IT for Business Value** (3 CCs)
- Benefits Assessment & Realisation (BAR): Benefits identification, tracking, realization, reporting
- Project Portfolio Management (PPM): Portfolio governance, prioritization, resource optimization
- Total Cost of Ownership (TCO): TCO models, lifecycle costing, cost optimization

---

## 12. Build & Packaging

### `build.py` Commands

```bash
python3 build.py              # Build standalone executable (PyInstaller)
python3 build.py --dev        # Run backend (FastAPI) + frontend (Vite) dev servers
python3 build.py --frontend   # Build frontend only → backend/static/
python3 build.py --dist       # Build + create distribution ZIP
```

### Development Mode (`--dev`)
- Backend: `python -m backend.main` on port `8761`
- Frontend: `npm run dev` on port `5173` with Vite proxy `/api → localhost:8761`

### Frontend Build (`--frontend`)
- Runs `npm run build` in `frontend/`
- Output copied to `backend/static/`

### PyInstaller Packaging
- Spec files: `assessment-tool-macos.spec`, `assessment-tool-windows.spec`
- Entry point: `backend/main.py`
- Bundled data: `backend/static/`, `framework/`, `templates/` (if present)
- Hidden imports: `uvicorn.logging`, `uvicorn.loops.auto`, `uvicorn.protocols.http.auto`, `uvicorn.protocols.websockets.auto`, `uvicorn.lifespan.on`
- Output: `dist/assessment-tool` (macOS) or `dist/assessment-tool.exe` (Windows)

### Distribution ZIP (`--dist`)
Creates `dist/ITCMFAssessment/`:
```
ITCMFAssessment/
├── assessment-tool           # Executable
├── README.txt                # End-user guide
├── framework/                # Read-only framework JSON
├── templates/                # Optional export templates
└── exports/                  # Empty (generated at runtime)
```
Zipped to `dist/ITCMFAssessment.zip` (local builds) or `ITCMFAssessment-macOS-v1.0.0.zip` / `ITCMFAssessment-Windows-v1.0.0.zip` (GitHub Actions releases, version tag appended).

### GitHub Actions (`.github/workflows/`)

#### CI (`.github/workflows/ci.yml`)
Lint + type-check on push and pull requests.

#### Release (`.github/workflows/release.yml`)

Builds macOS (ARM) + Windows executables and creates a draft GitHub release with both ZIPs. **Release zip filenames include the version tag** (e.g., `ITCMFAssessment-macOS-v1.0.0.zip`, `ITCMFAssessment-Windows-v1.0.0.zip`).

**Critical notes:**
- **GitHub macOS runners are ARM-only** (`macos-latest` = Apple Silicon). The macOS PyInstaller spec must use `target_arch='arm64'`. There are no x86 macOS runners available.
- **The `templates/` directory is optional and may not exist in the repo.** PyInstaller spec files must conditionally include it or the build will fail with `ERROR: Unable to find '…/templates'`. Use this pattern in both spec files:

```python
import os

datas = [
    ('backend/static', 'static'),
    ('framework', 'framework'),
]
if os.path.isdir('templates'):
    datas.append(('templates', 'templates'))

a = Analysis(
    ['backend/main.py'],
    datas=datas,
    ...
)
```

**Workflow structure:**

```yaml
name: Build & Release

on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      tag:
        description: 'Release tag (e.g. v1.0.0)'
        required: true

permissions:
  contents: write

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest        # ARM only
            platform: macos
            zip_base: ITCMFAssessment-macOS
          - os: windows-latest
            platform: windows
            zip_base: ITCMFAssessment-Windows

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Python dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt pyinstaller

      - name: Install and build frontend
        working-directory: frontend
        run: npm ci && npm run build

      - name: Build executable (macOS)
        if: matrix.platform == 'macos'
        run: python -m PyInstaller --distpath dist --workpath build_temp assessment-tool-macos.spec

      - name: Build executable (Windows)
        if: matrix.platform == 'windows'
        run: python -m PyInstaller --distpath dist --workpath build_temp assessment-tool-windows.spec

      - name: Determine version tag
        id: version
        shell: bash
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "tag=${{ github.event.inputs.tag }}" >> "$GITHUB_OUTPUT"
          else
            echo "tag=${GITHUB_REF#refs/tags/}" >> "$GITHUB_OUTPUT"
          fi

      - name: Assemble distribution (macOS)
        if: matrix.platform == 'macos'
        run: |
          ZIP_NAME="${{ matrix.zip_base }}-${{ steps.version.outputs.tag }}"
          mkdir -p dist/${ZIP_NAME}
          cp dist/assessment-tool dist/${ZIP_NAME}/
          chmod +x dist/${ZIP_NAME}/assessment-tool
          cp -r framework dist/${ZIP_NAME}/
          if [ -d templates ]; then cp -r templates dist/${ZIP_NAME}/; else mkdir dist/${ZIP_NAME}/templates; fi
          if [ -f README.txt ]; then cp README.txt dist/${ZIP_NAME}/; fi
          mkdir -p dist/${ZIP_NAME}/exports
          cd dist && zip -r ${ZIP_NAME}.zip ${ZIP_NAME}

      - name: Assemble distribution (Windows)
        if: matrix.platform == 'windows'
        shell: pwsh
        run: |
          $ZipName = "${{ matrix.zip_base }}-${{ steps.version.outputs.tag }}"
          New-Item -ItemType Directory -Force -Path "dist/$ZipName"
          Copy-Item "dist/assessment-tool.exe" "dist/$ZipName/"
          Copy-Item -Recurse "framework" "dist/$ZipName/framework"
          if (Test-Path "templates") { Copy-Item -Recurse "templates" "dist/$ZipName/templates" } else { New-Item -ItemType Directory -Force -Path "dist/$ZipName/templates" }
          if (Test-Path "README.txt") { Copy-Item "README.txt" "dist/$ZipName/" }
          New-Item -ItemType Directory -Force -Path "dist/$ZipName/exports"
          Compress-Archive -Path "dist/$ZipName" -DestinationPath "dist/$ZipName.zip"

      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.zip_base }}-${{ steps.version.outputs.tag }}
          path: dist/${{ matrix.zip_base }}-${{ steps.version.outputs.tag }}.zip

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Determine tag
        id: tag
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "version=${{ github.event.inputs.tag }}" >> "$GITHUB_OUTPUT"
          else
            echo "version=${GITHUB_REF#refs/tags/}" >> "$GITHUB_OUTPUT"
          fi
      - uses: actions/download-artifact@v4
        with:
          path: artifacts
      - uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.tag.outputs.version }}
          name: IT Capability Maturity Assessment Tool ${{ steps.tag.outputs.version }}
          draft: true
          generate_release_notes: true
          files: |
            artifacts/ITCMFAssessment-macOS-${{ steps.tag.outputs.version }}/ITCMFAssessment-macOS-${{ steps.tag.outputs.version }}.zip
            artifacts/ITCMFAssessment-Windows-${{ steps.tag.outputs.version }}/ITCMFAssessment-Windows-${{ steps.tag.outputs.version }}.zip
```

---

## 13. Implementation Order

Build in 8 sequential chunks. Each chunk should be fully functional before moving to the next.

### Chunk 1 — Project Scaffolding
- Initialize git repo, `.gitignore`, `requirements.txt`, `package.json`
- Backend: `main.py` with FastAPI skeleton, health check endpoint
- Frontend: Vite + React + TypeScript + Tailwind setup
- `build.py` with `--dev` and `--frontend` modes
- Verify: `python3 build.py --dev` serves empty app

### Chunk 2 — Data Model & Framework
- Backend: `models.py` with all Pydantic models
- Backend: `data_manager.py` (load/save/backup logic)
- Frontend: `types.ts` with all interfaces + constants
- Framework: `assessment-framework.json` with complete content (all 37 CCs, ~300-400 items)
- API: `GET/PUT /api/assessment`, `GET /api/framework`
- Verify: API returns framework and saves/loads assessment

### Chunk 3 — State Management & Core Layout
- Frontend: `store.tsx` (Context + auto-save)
- Frontend: `api.ts` (fetch client)
- Frontend: `App.tsx` (router + sidebar + content layout)
- Frontend: `Sidebar.tsx` (collapsible, resizable, persistent)
- Pages: `ClientInfo.tsx`, `Dashboard.tsx` (basic)
- Verify: Navigate between pages, data persists

### Chunk 4 — Assessment Scoring UI
- Frontend: `scoring.ts` (all calculation functions)
- Components: `AssessmentItemCard.tsx`, `ScoringWidget.tsx`, `ConfidenceWidget.tsx`
- Pages: `CriticalCapabilitySummary.tsx`, `CapabilityArea.tsx` (keyboard shortcuts)
- Component: `Breadcrumb.tsx`
- Verify: Score items, see scores update in sidebar + dashboard

### Chunk 5 — Dashboard & Charts
- Dashboard: Radar chart (Recharts), bar chart, progress summary
- Dashboard: Maturity band display, top gaps list
- Component: `StatsFooter.tsx` (global progress + save status)
- Verify: Dashboard reflects scoring accurately

### Chunk 6 — Skip (No Extension Module)
- Extension module is disabled for this tool
- Proceed directly to Chunk 7

### Chunk 7 — Exports
- Backend: `export_engine.py` — all 8 export generators
- Radar chart PNG generation (matplotlib)
- API: `POST /api/export/{type}`
- Frontend: `Export.tsx` page with buttons + validation
- Verify: Each export generates a real, correct file

### Chunk 8 — Polish & Packaging
- Components: `CommandPalette.tsx`, `OnboardingTooltip.tsx`
- Frontend: `validation.ts` + validation warnings in Export page
- Pages: `Settings.tsx` (weighting), `Help.tsx`
- PyInstaller specs + `build.py --dist`
- GitHub Actions workflows (CI + Release)
- `README.txt` for end users
- Verify: Standalone executable runs, all features work

---

## 14. Reference Implementations

Use these existing tools as canonical examples. When in doubt, match their patterns exactly.

| Tool | Path | Hierarchy | Extension |
|------|------|-----------|-----------|
| Zero-Trust Assessment | `/Users/john/Dev/Assessments/Zero-Trust/` | Flat (Pillars + Cross-Cutting) | Classified Extension |
| ITSM Maturity Assessment | `/Users/john/Dev/Assessments/ITSM-ITIL/` | Grouped (Domain Groups → Domains) | ITIL 4 Module |

### Key Patterns to Replicate
- **Auto-save with debounce** — 300ms, immutable state updates via `structuredClone`
- **Sidebar resize + collapse** — drag handle, localStorage persistence, icon-only mode
- **Progress rings** — SVG circles in sidebar showing % complete per entity
- **Score color coding** — consistent colors across sidebar badges, charts, exports
- **Template fallback exports** — check for template file, auto-generate if missing
- **Port scanning** — try default port, increment up to +9 if occupied
- **SPA routing** — FastAPI serves `index.html` for all non-API routes
- **Backup on save** — always write `.bak` before overwriting main data file
- **Dark theme** — all colors from `Design-guide.md`, no light mode

---

## Quick Start Checklist

To build this IT-CMF assessment tool:

1. All `{{PLACEHOLDER}}` values have been filled in above
2. Generate the full framework JSON content (items + rubrics) for all 37 CCs
3. Git repo created and added as submodule to `/Users/john/Dev/Assessments/`
4. Follow the 8-chunk implementation order
5. Cross-reference the two existing tools (ITSM-ITIL, Zero-Trust) for implementation details
