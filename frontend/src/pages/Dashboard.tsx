import { useStore } from '@/store';
import { weightedCompositeScore, overallCompletion, macroScore, macroCompletion, ccScore } from '@/scoring';
import { getMaturityBand, MATURITY_BANDS } from '@/types';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-medium border border-border rounded-xl p-6 transition-colors hover:border-border-hover ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-semibold text-accent-bright uppercase tracking-widest mb-3">{children}</h3>;
}

export function DashboardPage() {
  const { data } = useStore();
  if (!data) return null;

  const composite = weightedCompositeScore(data);
  const band = composite !== null ? getMaturityBand(composite) : null;
  const completionFrac = overallCompletion(data);
  const completionPct = Math.round(completionFrac * 100);

  const allItems = data.macro_capabilities.flatMap((mc) =>
    mc.critical_capabilities.flatMap((cc) =>
      cc.capability_areas.flatMap((ca) => ca.items)
    )
  );
  const totalCount = allItems.length;
  const scoredCount = allItems.filter((i) => i.score !== null || i.na).length;

  // Collect all CCs for radar chart (pick a subset for readability)
  const allCCs = data.macro_capabilities.flatMap((mc) => mc.critical_capabilities);

  const radarData = allCCs.map((cc) => ({
    cc: cc.name.length > 14 ? cc.name.slice(0, 14) + '\u2026' : cc.name,
    score: ccScore(cc) ?? 0,
    target: data.target_scores[cc.id] ?? 3.0,
    fullMark: 5,
  }));

  const gapData = allCCs
    .map((cc) => {
      const current = ccScore(cc) ?? 0;
      const target = data.target_scores[cc.id] ?? 3.0;
      return { cc: cc.name.length > 18 ? cc.name.slice(0, 18) + '\u2026' : cc.name, current, target };
    })
    .filter((d) => d.current > 0)
    .sort((a, b) => (b.target - b.current) - (a.target - a.current))
    .slice(0, 15);

  // Top gaps
  const ccGaps = allCCs
    .map((cc) => {
      const score = ccScore(cc);
      const target = data.target_scores[cc.id] ?? 3.0;
      return { name: cc.name, score, target, gap: score !== null ? target - score : null };
    })
    .filter((g) => g.gap !== null && g.gap > 0)
    .sort((a, b) => b.gap! - a.gap!)
    .slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h2>

      {/* Top row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card>
          <SectionLabel>Overall Maturity Score</SectionLabel>
          {composite !== null ? (
            <>
              <div className="text-4xl font-bold mt-1" style={{ color: band!.color }}>{composite.toFixed(2)}</div>
              <div className="text-sm font-medium mt-2" style={{ color: band!.color }}>{band!.label}</div>
            </>
          ) : (
            <div className="text-3xl text-text-tertiary mt-1">--</div>
          )}
        </Card>

        <Card>
          <SectionLabel>Maturity Bands</SectionLabel>
          <div className="space-y-2 mt-1">
            {MATURITY_BANDS.map((b) => {
              const isActive = band && b.label === band.label;
              return (
                <div key={b.label} className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                    style={{ backgroundColor: b.color, opacity: isActive ? 1 : 0.25, transform: isActive ? 'scale(1.4)' : 'scale(1)' }}
                  />
                  <span className={`text-xs ${isActive ? 'font-semibold text-text-primary' : 'text-text-tertiary'}`}>{b.label}</span>
                  <span className="text-[10px] text-text-tertiary ml-auto font-mono">{b.min.toFixed(1)}&ndash;{b.max.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionLabel>Assessment Progress</SectionLabel>
          <div className="text-4xl font-bold text-accent mt-1">{completionPct}%</div>
          <div className="text-sm text-text-secondary mt-2">{scoredCount} / {totalCount} items scored</div>
          <div className="mt-4 space-y-2">
            {data.macro_capabilities.map((mc) => {
              const mcPct = Math.round(macroCompletion(mc) * 100);
              return (
                <div key={mc.id} className="flex items-center gap-2.5">
                  <span className="text-[11px] text-text-secondary w-40 truncate">{mc.name}</span>
                  <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${mcPct}%` }} />
                  </div>
                  <span className="text-[10px] text-text-tertiary w-8 text-right font-mono">{mcPct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        <Card>
          <SectionLabel>CC Maturity Profile</SectionLabel>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2A2A2E" />
                <PolarAngleAxis dataKey="cc" tick={{ fontSize: 9, fill: '#D0D0D0' }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: '#8A8A8E' }} tickCount={6} />
                <Radar name="Current" dataKey="score" stroke="#1BA1E2" fill="#1BA1E2" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Target" dataKey="target" stroke="#8A8A8E" fill="#8A8A8E" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="5 5" />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#D0D0D0' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionLabel>Gap Analysis: Current vs Target</SectionLabel>
          <div className="mt-2">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={gapData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#8A8A8E' }} />
                <YAxis dataKey="cc" type="category" tick={{ fontSize: 9, fill: '#D0D0D0' }} width={120} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #2A2A2E', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px' }} labelStyle={{ color: '#D0D0D0' }} />
                <Bar dataKey="current" fill="#1BA1E2" name="Current" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="target" fill="#3A3A3E" name="Target" radius={[0, 4, 4, 0]} barSize={10} opacity={0.5} stroke="#8A8A8E" strokeWidth={1} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#D0D0D0' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Macro-capability cards */}
      <SectionLabel>Macro-Capabilities</SectionLabel>
      <div className="grid grid-cols-4 gap-5 mb-6">
        {data.macro_capabilities.map((mc) => {
          const mScore = macroScore(mc);
          const mBand = mScore !== null ? getMaturityBand(mScore) : null;
          const mPct = Math.round(macroCompletion(mc) * 100);
          const mItems = mc.critical_capabilities.flatMap((cc) =>
            cc.capability_areas.flatMap((ca) => ca.items)
          );
          const mScored = mItems.filter((i) => i.score !== null || i.na).length;
          return (
            <Card key={mc.id}>
              <SectionLabel>{mc.name}</SectionLabel>
              {mScore !== null ? (
                <div className="text-2xl font-bold mt-1" style={{ color: mBand!.color }}>{mScore.toFixed(2)}</div>
              ) : (
                <div className="text-2xl text-text-tertiary mt-1">--</div>
              )}
              <div className="text-xs text-text-tertiary mt-2">{mScored}/{mItems.length} items ({mPct}%)</div>
            </Card>
          );
        })}
      </div>

      {/* Top gaps */}
      {ccGaps.length > 0 && (
        <>
          <SectionLabel>Top Capability Gaps</SectionLabel>
          <Card>
            <div className="space-y-3">
              {ccGaps.map((g) => (
                <div key={g.name} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-56 truncate">{g.name}</span>
                  <div className="flex-1 h-2 bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${((g.score ?? 0) / 5) * 100}%`,
                        backgroundColor: getMaturityBand(g.score!).color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-tertiary font-mono w-16 text-right">
                    {g.score!.toFixed(1)} / {g.target.toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-red-400 w-12 text-right">
                    -{g.gap!.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
