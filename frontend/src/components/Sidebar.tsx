import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DollarSign,
  Target,
  Cpu,
  TrendingUp,
  Building2,
  Calculator,
  BarChart3,
  Banknote,
  Shield,
  BookOpen,
  Users,
  Lock,
  ClipboardList,
  FolderKanban,
  Handshake,
  Code,
  Server,
  Palette,
  GraduationCap,
  Lightbulb,
  RefreshCw,
  Globe,
  Landmark,
  GitBranch,
  Briefcase,
  Settings,
  LayoutDashboard,
  Download,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '@/store';
import { ccScore, ccCompletion, macroScore, macroCompletion } from '@/scoring';
import type { MacroCapability, CriticalCapability, CapabilityArea } from '@/types';

// ─── CC icon map ────────────────────────────────────────────────────────────
const CC_ICONS: Record<string, LucideIcon> = {
  aa: DollarSign,
  bp: Briefcase,
  bpm: GitBranch,
  cfp: BarChart3,
  dsm: Target,
  eim: Globe,
  git: Lightbulb,
  gov: Landmark,
  im: Lightbulb,
  ldp: Users,
  ocm: RefreshCw,
  odp: Building2,
  rm: Shield,
  sai: BarChart3,
  ssm: Handshake,
  sp: Target,
  bgm: Calculator,
  bop: BarChart3,
  ff: Banknote,
  cam: ClipboardList,
  da: BarChart3,
  eam: Cpu,
  ism: Shield,
  km: BookOpen,
  pam: Users,
  pdp: Lock,
  pgm: FolderKanban,
  pm: ClipboardList,
  rem: Handshake,
  sd: Code,
  srp: Server,
  tim: Server,
  ued: Palette,
  utm: GraduationCap,
  bar: TrendingUp,
  ppm: FolderKanban,
  tco: DollarSign,
};

// ─── Macro-capability labels ──────────────────────────────────────────────────
const MACRO_LABELS: Record<string, string> = {
  'managing-it-like-a-business': 'MANAGING IT LIKE A BUSINESS',
  'managing-the-it-budget': 'MANAGING THE IT BUDGET',
  'managing-the-it-capability': 'MANAGING THE IT CAPABILITY',
  'managing-it-for-business-value': 'MANAGING IT FOR BUSINESS VALUE',
};

// ─── Score colour helper ──────────────────────────────────────────────────────
function scoreColor(score: number | null): string {
  if (score === null) return '#8A8A8E';
  if (score < 1.8) return '#ef4444';
  if (score < 2.6) return '#f97316';
  if (score < 3.4) return '#eab308';
  if (score < 4.2) return '#84cc16';
  return '#22c55e';
}

// ─── ProgressRing ─────────────────────────────────────────────────────────────
function ProgressRing({
  completion,
  score,
  size = 28,
}: {
  completion: number;
  score: number | null;
  size?: number;
}) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * completion;
  const color = scoreColor(score);

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2A2E" strokeWidth={2} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── ScoreBadge ─────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  return (
    <span
      className="text-[10px] font-bold tabular-nums ml-auto shrink-0"
      style={{ color: scoreColor(score) }}
    >
      {score.toFixed(1)}
    </span>
  );
}

// ─── NavLink class helpers ──────────────────────────────────────────────────
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-2 px-3 py-1.5 mx-1 rounded text-[13px] transition-colors',
    isActive
      ? 'bg-accent/15 text-accent-bright font-medium'
      : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary',
  ].join(' ');

const collapsedNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center justify-center w-full py-2 transition-colors',
    isActive ? 'text-accent-bright' : 'text-text-tertiary hover:text-text-secondary',
  ].join(' ');

// ─── ExpandableSection (CC → capability areas) ─────────────────────────────
function ExpandableSection({
  cc,
  collapsed: sidebarCollapsed,
}: {
  cc: CriticalCapability;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const score = ccScore(cc);
  const completion = ccCompletion(cc);
  const Icon = CC_ICONS[cc.id] ?? Layers;

  if (sidebarCollapsed) {
    return (
      <NavLink to={`/critical-capabilities/${cc.id}`} className={collapsedNavLinkClass} title={cc.name}>
        <Icon size={16} />
      </NavLink>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mx-1">
        <NavLink
          to={`/critical-capabilities/${cc.id}`}
          className={({ isActive }) =>
            [
              'flex-1 flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors min-w-0',
              isActive
                ? 'bg-accent/15 text-accent-bright font-medium'
                : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary',
            ].join(' ')
          }
        >
          <ProgressRing completion={completion} score={score} size={22} />
          <span className="truncate flex-1">{cc.name}</span>
          <ScoreBadge score={score} />
        </NavLink>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 rounded text-text-tertiary hover:text-text-secondary hover:bg-sidebar-hover transition-colors shrink-0"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {open && (
        <div className="ml-4 mt-0.5 mb-1 border-l border-border-subtle pl-2">
          {cc.capability_areas.map((ca: CapabilityArea) => (
            <NavLink
              key={ca.id}
              to={`/critical-capabilities/${cc.id}/${ca.id}`}
              className={({ isActive }) =>
                [
                  'block py-1 px-2 text-[12px] rounded transition-colors truncate',
                  isActive
                    ? 'text-accent-bright font-medium'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-sidebar-hover',
                ].join(' ')
              }
            >
              {ca.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MacroSection ─────────────────────────────────────────────────────────────
function MacroSection({
  mc,
  collapsed: sidebarCollapsed,
  open,
  onToggle,
}: {
  mc: MacroCapability;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const score = macroScore(mc);
  const completion = macroCompletion(mc);
  const label = MACRO_LABELS[mc.id] ?? mc.name.toUpperCase();

  if (sidebarCollapsed) {
    return (
      <div className="py-1">
        {mc.critical_capabilities.map((cc) => (
          <ExpandableSection key={cc.id} cc={cc} collapsed={sidebarCollapsed} />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-sidebar-hover transition-colors group"
      >
        <span className="text-[10px] font-semibold text-accent-bright tracking-widest flex-1 text-left">
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <ProgressRing completion={completion} score={score} size={18} />
          <ScoreBadge score={score} />
          {open ? (
            <ChevronUp size={11} className="text-text-tertiary group-hover:text-text-secondary" />
          ) : (
            <ChevronDown size={11} className="text-text-tertiary group-hover:text-text-secondary" />
          )}
        </div>
      </button>

      {open && (
        <div className="pb-1">
          {mc.critical_capabilities.map((cc) => (
            <ExpandableSection key={cc.id} cc={cc} collapsed={sidebarCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar({
  width,
  collapsed,
  onToggleCollapse,
}: {
  width: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { data, saveStatus } = useStore();

  const initialOpen = () => {
    const map: Record<string, boolean> = {};
    if (data) {
      for (const mc of data.macro_capabilities) map[mc.id] = true;
    } else {
      for (const id of Object.keys(MACRO_LABELS)) map[id] = true;
    }
    return map;
  };
  const [macroOpen, setMacroOpen] = useState<Record<string, boolean>>(initialOpen);

  const toggleMacro = (id: string) =>
    setMacroOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const saveLabel =
    saveStatus === 'saving'
      ? 'Saving\u2026'
      : saveStatus === 'saved'
        ? 'Saved'
        : saveStatus === 'error'
          ? 'Error'
          : null;

  return (
    <nav
      style={{ width }}
      className="h-full bg-sidebar shrink-0 border-r border-border flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-border shrink-0">
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <img src="/peraton-logo.png" alt="Peraton" className="w-[140px]" />
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2">
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-text-primary truncate">
                IT-CMF Assessment
              </div>
              {saveLabel && (
                <div
                  className={`text-[10px] mt-0.5 ${saveStatus === 'error' ? 'text-red-400' : 'text-text-tertiary'}`}
                >
                  {saveLabel}
                </div>
              )}
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-text-tertiary hover:text-text-secondary hover:bg-sidebar-hover transition-colors shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-2">
        <NavLink to="/" className={collapsed ? collapsedNavLinkClass : navLinkClass} title="Client Info">
          <User size={15} className="shrink-0 opacity-70" />
          {!collapsed && 'Client Info'}
        </NavLink>
        <NavLink to="/dashboard" className={collapsed ? collapsedNavLinkClass : navLinkClass} title="Dashboard">
          <LayoutDashboard size={15} className="shrink-0 opacity-70" />
          {!collapsed && 'Dashboard'}
        </NavLink>

        <div className="my-2 mx-3 border-t border-border-subtle" />

        {data?.macro_capabilities.map((mc: MacroCapability) => (
          <MacroSection
            key={mc.id}
            mc={mc}
            collapsed={collapsed}
            open={macroOpen[mc.id] ?? true}
            onToggle={() => toggleMacro(mc.id)}
          />
        ))}

        <div className="my-2 mx-3 border-t border-border-subtle" />
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-border py-2">
        <NavLink to="/export" className={collapsed ? collapsedNavLinkClass : navLinkClass} title="Export">
          <Download size={15} className="shrink-0 opacity-70" />
          {!collapsed && 'Export'}
        </NavLink>
        <NavLink to="/settings" className={collapsed ? collapsedNavLinkClass : navLinkClass} title="Settings">
          <Settings size={15} className="shrink-0 opacity-70" />
          {!collapsed && 'Settings'}
        </NavLink>
        <NavLink to="/help" className={collapsed ? collapsedNavLinkClass : navLinkClass} title="Help">
          <HelpCircle size={15} className="shrink-0 opacity-70" />
          {!collapsed && 'Help'}
        </NavLink>
      </div>
    </nav>
  );
}
