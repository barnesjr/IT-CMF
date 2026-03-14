import type { AssessmentItem, CapabilityArea, CriticalCapability, MacroCapability, AssessmentData } from './types';

/** Average score of items (exclude N/A and unscored) */
export function averageScore(items: AssessmentItem[]): number | null {
  const scored = items.filter((i) => i.score !== null && !i.na);
  if (scored.length === 0) return null;
  return scored.reduce((sum, i) => sum + i.score!, 0) / scored.length;
}

/** Average score for a capability area */
export function capabilityAreaScore(ca: CapabilityArea): number | null {
  return averageScore(ca.items);
}

/** Average score across all items in a critical capability */
export function ccScore(cc: CriticalCapability): number | null {
  const allItems = cc.capability_areas.flatMap((ca) => ca.items);
  return averageScore(allItems);
}

/** Completion fraction for a critical capability (scored + N/A vs total) */
export function ccCompletion(cc: CriticalCapability): number {
  const allItems = cc.capability_areas.flatMap((ca) => ca.items);
  if (allItems.length === 0) return 0;
  const done = allItems.filter((i) => i.score !== null || i.na).length;
  return done / allItems.length;
}

/** Average score across all items in a macro-capability */
export function macroScore(mc: MacroCapability): number | null {
  const allItems = mc.critical_capabilities.flatMap((cc) =>
    cc.capability_areas.flatMap((ca) => ca.items)
  );
  return averageScore(allItems);
}

/** Completion fraction for a macro-capability */
export function macroCompletion(mc: MacroCapability): number {
  const allItems = mc.critical_capabilities.flatMap((cc) =>
    cc.capability_areas.flatMap((ca) => ca.items)
  );
  if (allItems.length === 0) return 0;
  const done = allItems.filter((i) => i.score !== null || i.na).length;
  return done / allItems.length;
}

/** Weighted composite score across all CCs using scoring config weights */
export function weightedCompositeScore(data: AssessmentData): number | null {
  const weights = data.scoring_config.cc_weights;
  let totalWeight = 0;
  let weightedSum = 0;

  for (const mc of data.macro_capabilities) {
    for (const cc of mc.critical_capabilities) {
      const score = ccScore(cc);
      const weight = weights[cc.id] ?? cc.weight;
      if (score !== null) {
        weightedSum += score * weight;
        totalWeight += weight;
      }
    }
  }

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
}

/** Overall completion fraction across all items */
export function overallCompletion(data: AssessmentData): number {
  let total = 0;
  let done = 0;
  for (const mc of data.macro_capabilities) {
    for (const cc of mc.critical_capabilities) {
      for (const ca of cc.capability_areas) {
        total += ca.items.length;
        done += ca.items.filter((i) => i.score !== null || i.na).length;
      }
    }
  }
  if (total === 0) return 0;
  return done / total;
}
