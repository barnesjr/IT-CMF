import { Keyboard, BookOpen, FileDown, Layers } from 'lucide-react';

export function HelpPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-text-primary mb-8">Help & Reference</h2>

      {/* Keyboard Shortcuts */}
      <section className="mb-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-bright uppercase tracking-widest mb-4">
          <Keyboard size={14} /> Keyboard Shortcuts
        </h3>
        <div className="bg-surface-medium border border-border rounded-xl p-5 space-y-2 text-sm">
          {[
            ['1 / 2 / 3 / 4 / 5', 'Set score on focused item'],
            ['N', 'Toggle N/A on focused item'],
            ['H / M / L', 'Set confidence (High / Medium / Low)'],
            ['↑ / ↓ or J / K', 'Navigate between items'],
            ['Enter / Space', 'Expand or collapse focused item'],
            ['Cmd/Ctrl + K', 'Open command palette'],
            ['Cmd/Ctrl + \\', 'Toggle sidebar collapse'],
            ['Escape', 'Close palette or deselect item'],
          ].map(([keys, desc]) => (
            <div key={keys} className="flex items-center gap-3">
              <code className="bg-surface-elevated px-2 py-1 rounded text-xs text-accent font-mono min-w-[160px]">{keys}</code>
              <span className="text-text-secondary">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring Methodology */}
      <section className="mb-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-bright uppercase tracking-widest mb-4">
          <BookOpen size={14} /> Scoring Methodology
        </h3>
        <div className="bg-surface-medium border border-border rounded-xl p-5 space-y-3 text-sm text-text-secondary">
          <p>Each item is scored on a 1-5 IT-CMF maturity scale:</p>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {[
              ['1 — Initial', 'Ad-hoc, reactive, no formal process', '#ef4444'],
              ['2 — Basic', 'Some processes exist but inconsistent', '#f97316'],
              ['3 — Intermediate', 'Documented, standardized, regularly reviewed', '#eab308'],
              ['4 — Advanced', 'Integrated, measured, optimized', '#84cc16'],
              ['5 — Optimizing', 'Predictive, continuous improvement, industry-leading', '#22c55e'],
            ].map(([label, desc, color]) => (
              <div key={label} className="p-3 rounded-lg bg-surface-elevated border border-border-subtle">
                <div className="text-xs font-semibold mb-1" style={{ color: color as string }}>{label}</div>
                <p className="text-[11px] text-text-tertiary">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-3">Items may be marked N/A with justification. N/A items are excluded from score averaging.</p>
          <p>The weighted composite score combines all 37 CC scores using the selected weighting model.</p>
        </div>
      </section>

      {/* Framework Structure */}
      <section className="mb-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-bright uppercase tracking-widest mb-4">
          <Layers size={14} /> IT-CMF Framework Structure
        </h3>
        <div className="bg-surface-medium border border-border rounded-xl p-5 space-y-3 text-sm text-text-secondary">
          <p>The assessment covers 37 Critical Capabilities organized into 4 Macro-Capabilities:</p>
          <div className="space-y-3 mt-3">
            {[
              ['Managing IT like a Business', '16 CCs including Strategic Planning, Governance, Innovation Management, Risk Management'],
              ['Managing the IT Budget', '3 CCs: Budget Management, Budget Oversight & Performance Analysis, Funding & Financing'],
              ['Managing the IT Capability', '15 CCs including Enterprise Architecture, Information Security, Solution Delivery, Project Management'],
              ['Managing IT for Business Value', '3 CCs: Benefits Assessment & Realisation, Project Portfolio Management, Total Cost of Ownership'],
            ].map(([group, ccs]) => (
              <div key={group} className="p-3 rounded-lg bg-surface-elevated border border-border-subtle">
                <div className="text-xs font-semibold text-accent-bright mb-1">{group}</div>
                <p className="text-[11px] text-text-tertiary">{ccs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Guide */}
      <section className="mb-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-accent-bright uppercase tracking-widest mb-4">
          <FileDown size={14} /> Export Deliverables
        </h3>
        <div className="bg-surface-medium border border-border rounded-xl p-5 space-y-2 text-sm text-text-secondary">
          {[
            ['Findings', 'Assessment Findings (DOCX)', 'Per-CC findings with scores, capability areas, and recommendations'],
            ['Summary', 'Executive Summary (DOCX)', 'Client profile, overall score, radar chart, top priorities'],
            ['Gap', 'Gap Analysis & Roadmap (DOCX)', 'Current vs target gap matrix with severity and remediation roadmap'],
            ['Workbook', 'Scored Workbook (XLSX)', 'All 280 item scores, confidence, evidence, with auto-calculated averages'],
            ['Outbrief', 'Out-Brief Presentation (PPTX)', 'Executive summary, radar chart, macro-capability breakdowns'],
            ['Heatmap', 'Maturity Heatmap (XLSX)', 'CC x Capability Area color-coded score matrix'],
            ['Quick Wins', 'Quick Wins Report (DOCX)', 'Low-score high-impact improvement opportunities'],
            ['CC Roadmap', 'CC Improvement Roadmap (DOCX)', 'Per-CC action plans with prioritized improvements'],
          ].map(([code, name, desc]) => (
            <div key={code} className="flex items-start gap-3 py-1">
              <code className="bg-surface-elevated px-2 py-0.5 rounded text-[10px] text-text-tertiary font-mono shrink-0">{code}</code>
              <div>
                <div className="font-medium text-text-primary">{name}</div>
                <div className="text-xs text-text-tertiary">{desc}</div>
              </div>
            </div>
          ))}
          <p className="text-xs text-text-tertiary mt-3">
            Exports are saved to the <code className="bg-surface-elevated px-1 py-0.5 rounded">exports/</code> directory.
          </p>
        </div>
      </section>
    </div>
  );
}
