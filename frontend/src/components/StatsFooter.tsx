import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/store';
import { overallCompletion, ccScore, capabilityAreaScore } from '@/scoring';
import { useNextUnscored } from '@/hooks/useNextUnscored';
import { getMaturityBand } from '@/types';
import { SkipForward } from 'lucide-react';

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function StatsFooter() {
  const { data, saveStatus } = useStore();
  const navigate = useNavigate();
  const { entityId, areaId } = useParams();
  const nextUnscored = useNextUnscored(data);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  const completionPct = Math.round(overallCompletion(data) * 100);

  const allItems = data.macro_capabilities.flatMap((mc) =>
    mc.critical_capabilities.flatMap((cc) =>
      cc.capability_areas.flatMap((ca) => ca.items)
    )
  );
  const totalCount = allItems.length;
  const scoredCount = allItems.filter((i) => i.score !== null || i.na).length;

  // Current section score
  let sectionScore: number | null = null;
  let sectionLabel = '';

  if (entityId) {
    for (const mc of data.macro_capabilities) {
      const cc = mc.critical_capabilities.find((c) => c.id === entityId);
      if (cc) {
        if (areaId) {
          const area = cc.capability_areas.find((ca) => ca.id === areaId);
          if (area) { sectionScore = capabilityAreaScore(area); sectionLabel = area.name; }
        } else {
          sectionScore = ccScore(cc);
          sectionLabel = cc.name;
        }
        break;
      }
    }
  }

  const lastSaved = data.assessment_metadata.last_modified
    ? new Date(data.assessment_metadata.last_modified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--';

  return (
    <footer className="h-10 bg-surface-dark border-t border-border-subtle flex items-center px-5 gap-6 shrink-0 text-[11px]">
      {/* Progress */}
      <div className="flex items-center gap-2.5">
        <div className="w-24 h-1 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <span className="text-text-secondary font-medium">{completionPct}%</span>
        <span className="text-text-tertiary">{scoredCount}/{totalCount}</span>
      </div>

      {/* Section score */}
      {sectionScore !== null && (
        <div className="flex items-center gap-1.5">
          <span className="text-text-tertiary">{sectionLabel}:</span>
          <span className="font-semibold" style={{ color: getMaturityBand(sectionScore).color }}>
            {sectionScore.toFixed(2)}
          </span>
        </div>
      )}

      <div className="flex-1" />

      {/* Next unscored */}
      {nextUnscored && (
        <button
          onClick={() => navigate(`${nextUnscored.path}?focus=${nextUnscored.itemId}`)}
          className="flex items-center gap-1.5 text-accent hover:text-accent-bright transition-colors"
          title={`Next: ${nextUnscored.areaName} (${nextUnscored.remaining} remaining)`}
        >
          <SkipForward size={12} />
          <span className="font-medium">{nextUnscored.remaining} unscored</span>
        </button>
      )}

      {/* Session timer */}
      <span className="text-text-tertiary">Session: {formatElapsed(elapsed)}</span>

      {/* Save status */}
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            saveStatus === 'saving' ? 'bg-yellow-400' :
            saveStatus === 'saved' ? 'bg-green-400' :
            saveStatus === 'error' ? 'bg-red-400' :
            'bg-text-tertiary'
          }`}
        />
        <span className="text-text-tertiary">Saved {lastSaved}</span>
      </div>
    </footer>
  );
}
