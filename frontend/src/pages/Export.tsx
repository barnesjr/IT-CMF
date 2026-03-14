import { useState } from 'react';
import { exportDeliverable } from '@/api';
import type { ExportType } from '@/api';
import {
  FileDown, FileText, FileSpreadsheet, Presentation,
  Loader2, CheckCircle, AlertCircle, BarChart3, Zap, Map,
} from 'lucide-react';

interface DeliverableDef {
  id: ExportType;
  name: string;
  description: string;
  format: string;
  icon: typeof FileText;
  section: 'core' | 'itcmf';
}

const DELIVERABLES: DeliverableDef[] = [
  { id: 'findings', name: 'Assessment Findings', description: 'Per-CC findings with scores, notes, and evidence', format: 'DOCX', icon: FileText, section: 'core' },
  { id: 'executive-summary', name: 'Executive Summary', description: 'Client profile, overall score, radar chart, top priorities', format: 'DOCX', icon: FileText, section: 'core' },
  { id: 'gap-analysis', name: 'Gap Analysis & Roadmap', description: 'Current vs target gap matrix with remediation roadmap', format: 'DOCX', icon: FileText, section: 'core' },
  { id: 'workbook', name: 'Scored Assessment Workbook', description: 'All item scores, confidence, evidence with calculated averages', format: 'XLSX', icon: FileSpreadsheet, section: 'core' },
  { id: 'outbrief', name: 'Out-Brief Presentation', description: 'Executive summary, radar chart, macro-capability breakdowns', format: 'PPTX', icon: Presentation, section: 'core' },
  { id: 'heatmap', name: 'Maturity Heatmap', description: 'CC x Capability Area heatmap with color-coded scores', format: 'XLSX', icon: BarChart3, section: 'itcmf' },
  { id: 'quick-wins', name: 'Quick Wins Report', description: 'Low-score high-impact items for rapid improvement', format: 'DOCX', icon: Zap, section: 'itcmf' },
  { id: 'cc-roadmap', name: 'CC Improvement Roadmap', description: 'Per-CC action plans with prioritized improvements', format: 'DOCX', icon: Map, section: 'itcmf' },
];

interface ExportStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  filenames: string[];
}

export function ExportPage() {
  const [statuses, setStatuses] = useState<Record<string, ExportStatus>>({});
  const [allLoading, setAllLoading] = useState(false);

  async function handleExport(id: ExportType) {
    setStatuses((s) => ({ ...s, [id]: { loading: true, success: false, error: null, filenames: [] } }));
    try {
      const result = await exportDeliverable(id);
      setStatuses((s) => ({ ...s, [id]: { loading: false, success: true, error: null, filenames: result.filenames } }));
    } catch (e) {
      setStatuses((s) => ({ ...s, [id]: { loading: false, success: false, error: (e as Error).message, filenames: [] } }));
    }
  }

  async function handleExportAll() {
    setAllLoading(true);
    try {
      const result = await exportDeliverable('all');
      const newStatuses: Record<string, ExportStatus> = {};
      for (const d of DELIVERABLES) {
        newStatuses[d.id] = { loading: false, success: true, error: null, filenames: result.filenames };
      }
      setStatuses(newStatuses);
    } catch (e) {
      for (const d of DELIVERABLES) {
        setStatuses((s) => ({ ...s, [d.id]: { loading: false, success: false, error: (e as Error).message, filenames: [] } }));
      }
    } finally {
      setAllLoading(false);
    }
  }

  const coreDeliverables = DELIVERABLES.filter((d) => d.section === 'core');
  const itcmfDeliverables = DELIVERABLES.filter((d) => d.section === 'itcmf');

  function renderCard(d: DeliverableDef) {
    const status = statuses[d.id];
    const Icon = d.icon;

    return (
      <div
        key={d.id}
        className="bg-surface-medium border border-border rounded-xl p-5 flex items-center gap-5 transition-colors hover:border-border-hover"
      >
        <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
          <Icon size={20} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-text-primary">{d.name}</h3>
            <span className="text-[10px] px-2 py-0.5 bg-surface-elevated text-text-tertiary rounded-md font-medium">{d.format}</span>
          </div>
          <p className="text-xs text-text-tertiary mt-1">{d.description}</p>
          {status?.success && status.filenames.length > 0 && (
            <p className="text-xs text-green-400 mt-1.5">{status.filenames.join(', ')}</p>
          )}
          {status?.error && <p className="text-xs text-red-400 mt-1.5">{status.error}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {status?.loading ? <Loader2 size={16} className="animate-spin text-accent" /> :
           status?.success ? <CheckCircle size={16} className="text-green-400" /> :
           status?.error ? <AlertCircle size={16} className="text-red-400" /> : null}
          <button
            onClick={() => handleExport(d.id)}
            disabled={status?.loading}
            className="px-4 py-2 text-xs font-semibold text-accent border border-accent/30 rounded-lg hover:bg-accent/10 disabled:opacity-50 transition-all"
          >
            Export
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Export Deliverables</h2>
          <p className="text-sm text-text-tertiary mt-1">Generate assessment reports and workbooks.</p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={allLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-page-bg text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {allLoading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          Export All
        </button>
      </div>

      <h3 className="text-[11px] font-semibold text-accent-bright uppercase tracking-widest mb-3">Core Deliverables</h3>
      <div className="space-y-3 mb-8">{coreDeliverables.map(renderCard)}</div>

      <h3 className="text-[11px] font-semibold text-accent-bright uppercase tracking-widest mb-3">IT-CMF Specific Deliverables</h3>
      <div className="space-y-3">{itcmfDeliverables.map(renderCard)}</div>

      <p className="text-xs text-text-tertiary mt-6">
        Exports are saved to the <code className="bg-surface-elevated px-1.5 py-0.5 rounded-md text-text-secondary">exports/</code> directory.
      </p>
    </div>
  );
}
