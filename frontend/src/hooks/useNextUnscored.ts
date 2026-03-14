import { useMemo } from 'react';
import type { AssessmentData } from '@/types';

interface UnscoredResult {
  path: string;
  itemId: string;
  ccName: string;
  areaName: string;
  remaining: number;
}

export function findNextUnscored(data: AssessmentData | null): UnscoredResult | null {
  if (!data) return null;

  let remaining = 0;
  let first: Omit<UnscoredResult, 'remaining'> | null = null;

  for (const mc of data.macro_capabilities) {
    for (const cc of mc.critical_capabilities) {
      for (const ca of cc.capability_areas) {
        for (const item of ca.items) {
          if (item.score === null && !item.na) {
            remaining++;
            if (!first) {
              first = {
                path: `/critical-capabilities/${cc.id}/${ca.id}`,
                itemId: item.id,
                ccName: cc.name,
                areaName: ca.name,
              };
            }
          }
        }
      }
    }
  }

  if (!first) return null;
  return { ...first, remaining };
}

export function useNextUnscored(data: AssessmentData | null) {
  return useMemo(() => findNextUnscored(data), [data]);
}
