// Score constants
export const SCORE_LABELS: Record<number, string> = {
  1: "Initial",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Optimizing",
};

export const SCORE_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#84cc16",
  5: "#22c55e",
};

export const MATURITY_BANDS = [
  { min: 1.0, max: 1.8, label: "Initial", color: "#ef4444" },
  { min: 1.8, max: 2.6, label: "Basic", color: "#f97316" },
  { min: 2.6, max: 3.4, label: "Intermediate", color: "#eab308" },
  { min: 3.4, max: 4.2, label: "Advanced", color: "#84cc16" },
  { min: 4.2, max: 5.0, label: "Optimizing", color: "#22c55e" },
];

export const WEIGHTING_MODELS: Record<
  string,
  { label: string; weights: Record<string, number> }
> = {
  balanced: {
    label: "Balanced",
    weights: {
      "managing-it-like-a-business": 0.25,
      "managing-the-it-budget": 0.25,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.25,
    },
  },
  cc_proportional: {
    label: "CC-Proportional",
    weights: {
      "managing-it-like-a-business": 0.444,
      "managing-the-it-budget": 0.083,
      "managing-the-it-capability": 0.389,
      "managing-it-for-business-value": 0.083,
    },
  },
  value_focused: {
    label: "Value-Focused",
    weights: {
      "managing-it-like-a-business": 0.3,
      "managing-the-it-budget": 0.15,
      "managing-the-it-capability": 0.25,
      "managing-it-for-business-value": 0.3,
    },
  },
};

export const DEFAULT_WEIGHTING = "balanced";
export const DEFAULT_TARGET_SCORE = 3.0;

// Utility function — maps a numeric score to its maturity band
export function getMaturityBand(
  score: number
): { label: string; color: string } {
  for (const band of MATURITY_BANDS) {
    if (score >= band.min && score < band.max) {
      return { label: band.label, color: band.color };
    }
  }
  // Score of exactly 5.0
  const last = MATURITY_BANDS[MATURITY_BANDS.length - 1];
  return { label: last.label, color: last.color };
}

// Assessment interfaces — mirror backend models
export interface EvidenceReference {
  document: string;
  section: string;
  date: string;
}

export interface AssessmentItem {
  id: string;
  text: string;
  score: number | null;
  na: boolean;
  na_justification: string | null;
  confidence: string | null;
  notes: string;
  evidence_references: EvidenceReference[];
  attachments: string[];
}

export interface CapabilityArea {
  id: string;
  name: string;
  items: AssessmentItem[];
}

// Grouped hierarchy interfaces
export interface CriticalCapability {
  id: string;
  name: string;
  weight: number;
  capability_areas: CapabilityArea[];
}

export interface MacroCapability {
  id: string;
  name: string;
  critical_capabilities: CriticalCapability[];
}

// Framework read-only interfaces
export interface FrameworkItem {
  id: string;
  text: string;
  rubric: Record<string, string>;
}

export interface FrameworkCapabilityArea {
  id: string;
  name: string;
  items: FrameworkItem[];
}

export interface FrameworkCriticalCapability {
  id: string;
  name: string;
  weight: number;
  capability_areas: FrameworkCapabilityArea[];
}

export interface FrameworkMacroCapability {
  id: string;
  name: string;
  critical_capabilities: FrameworkCriticalCapability[];
}

export interface Framework {
  version: string;
  framework_alignment: string;
  macro_capabilities: FrameworkMacroCapability[];
  weighting_models: Record<
    string,
    { label: string; weights: Record<string, number> }
  >;
}

// Shared models
export interface ClientInfo {
  name: string;
  industry: string;
  assessment_date: string;
  assessor: string;
}

export interface AssessmentMetadata {
  framework_version: string;
  tool_version: string;
  last_modified: string;
}

export interface ScoringConfig {
  weighting_model: string;
  cc_weights: Record<string, number>;
  custom_weights: Record<string, number> | null;
}

export interface AssessmentData {
  client_info: ClientInfo;
  assessment_metadata: AssessmentMetadata;
  scoring_config: ScoringConfig;
  macro_capabilities: MacroCapability[];
  extension_enabled: boolean;
  extension: Record<string, unknown> | null;
  target_scores: Record<string, number>;
}
