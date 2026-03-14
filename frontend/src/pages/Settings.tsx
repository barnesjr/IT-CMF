import { useStore } from '@/store';
import { WEIGHTING_MODELS } from '@/types';

export function SettingsPage() {
  const { data, updateData } = useStore();
  if (!data) return null;

  const allCCs = data.macro_capabilities.flatMap((mc) => mc.critical_capabilities);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-text-primary mb-2">Settings</h2>
      <p className="text-sm text-text-tertiary mb-8">Configure scoring weights and target scores.</p>

      {/* Weighting Model */}
      <div className="bg-surface-medium border border-border rounded-xl p-6 mb-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Macro-Capability Weighting Model</h3>
        <select
          value={data.scoring_config.weighting_model}
          onChange={(e) => {
            const model = e.target.value;
            const modelDef = WEIGHTING_MODELS[model];
            if (!modelDef) return;
            updateData((d) => {
              d.scoring_config.weighting_model = model;
            });
          }}
          className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
        >
          {Object.entries(WEIGHTING_MODELS).map(([key, model]) => (
            <option key={key} value={key}>{model.label}</option>
          ))}
        </select>

        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {data.macro_capabilities.map((mc) => {
            const weights = WEIGHTING_MODELS[data.scoring_config.weighting_model]?.weights ?? {};
            const w = weights[mc.id] ?? 0.25;
            return (
              <div key={mc.id} className="text-center p-3 bg-surface-elevated rounded-lg">
                <div className="text-[10px] text-text-tertiary mb-1 truncate">{mc.name}</div>
                <div className="text-sm font-semibold text-text-primary">{(w * 100).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Scores */}
      <div className="bg-surface-medium border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Target Scores (for Gap Analysis)</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allCCs.map((cc) => (
            <div key={cc.id} className="flex items-center gap-4">
              <label className="text-sm text-text-secondary w-56 truncate">{cc.name}</label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.5}
                value={data.target_scores[cc.id] ?? ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateData((dr) => {
                    dr.target_scores[cc.id] = isNaN(val) ? 0 : Math.min(5, Math.max(1, val));
                  });
                }}
                className="w-24 px-4 py-2 text-sm bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
