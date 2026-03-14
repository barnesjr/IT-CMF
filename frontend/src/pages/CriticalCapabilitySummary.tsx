import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/store';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ccScore, ccCompletion, capabilityAreaScore } from '@/scoring';
import { getMaturityBand } from '@/types';

export function CriticalCapabilitySummaryPage() {
  const { entityId } = useParams();
  const { data } = useStore();
  if (!data) return null;

  let cc = undefined as import('@/types').CriticalCapability | undefined;
  let macroName = '';

  for (const mc of data.macro_capabilities) {
    const found = mc.critical_capabilities.find((c) => c.id === entityId);
    if (found) {
      cc = found;
      macroName = mc.name;
      break;
    }
  }

  if (!cc) return <div className="text-text-tertiary">Critical Capability not found.</div>;

  const score = ccScore(cc);
  const completionFrac = ccCompletion(cc);
  const allItems = cc.capability_areas.flatMap((ca) => ca.items);
  const totalCount = allItems.length;
  const scoredCount = allItems.filter((i) => i.score !== null || i.na).length;
  const pct = Math.round(completionFrac * 100);

  return (
    <div>
      <Breadcrumb />
      <div className="mb-8">
        <p className="text-[11px] text-accent-bright mb-2 uppercase font-semibold tracking-widest">{macroName}</p>
        <h2 className="text-2xl font-bold text-text-primary">{cc.name}</h2>
        <div className="flex items-center gap-5 mt-3">
          <span className="text-sm text-text-secondary">
            {scoredCount} / {totalCount} items ({pct}%)
          </span>
          {score !== null && (
            <span className="text-sm font-medium" style={{ color: getMaturityBand(score).color }}>
              Score: {score.toFixed(2)} — {getMaturityBand(score).label}
            </span>
          )}
          <span className="text-xs text-text-tertiary">Weight: {(cc.weight * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid gap-3">
        {cc.capability_areas.map((ca) => {
          const caScore = capabilityAreaScore(ca);
          const caTotal = ca.items.length;
          const caScored = ca.items.filter((i) => i.score !== null || i.na).length;
          const caPct = caTotal > 0 ? Math.round((caScored / caTotal) * 100) : 0;
          return (
            <Link
              key={ca.id}
              to={`/critical-capabilities/${entityId}/${ca.id}`}
              className="block p-5 bg-surface-medium border border-border rounded-xl hover:border-accent/40 hover:bg-surface-medium/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">{ca.name}</h3>
                {caScore !== null && (
                  <span
                    className="text-sm font-medium px-2.5 py-1 rounded-lg"
                    style={{
                      color: getMaturityBand(caScore).color,
                      backgroundColor: getMaturityBand(caScore).color + '12',
                    }}
                  >
                    {caScore.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ backgroundColor: caScore !== null ? getMaturityBand(caScore).color : '#1BA1E2', width: `${caPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-text-tertiary font-mono">
                  {caScored}/{caTotal}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
