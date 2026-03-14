import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './store';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { StatsFooter } from './components/StatsFooter';
import { ClientInfoPage } from './pages/ClientInfo';
import { DashboardPage } from './pages/Dashboard';
import { CriticalCapabilitySummaryPage } from './pages/CriticalCapabilitySummary';
import { CapabilityAreaPage } from './pages/CapabilityArea';
import { ExportPage } from './pages/Export';
import { SettingsPage } from './pages/Settings';
import { HelpPage } from './pages/Help';

const STORAGE_KEY = 'it-cmf-sidebar';
const SIDEBAR_MIN = 180;
const SIDEBAR_MAX = 480;
const SIDEBAR_DEFAULT = 350;
const SIDEBAR_COLLAPSED = 56;

function AppShell() {
  const location = useLocation();

  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as {
        width?: number;
        collapsed?: boolean;
      };
    } catch {
      return {};
    }
  })();

  const [sidebarWidth, setSidebarWidth] = useState(stored.width ?? SIDEBAR_DEFAULT);
  const [collapsed, setCollapsed] = useState(stored.collapsed ?? false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isResizing = useRef(false);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ width: sidebarWidth, collapsed }));
  }, [sidebarWidth, collapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Sidebar resize drag
  const onMouseDownDivider = useCallback(
    (e: React.MouseEvent) => {
      if (collapsed) return;
      e.preventDefault();
      isResizing.current = true;
      const startX = e.clientX;
      const startWidth = sidebarWidth;

      const onMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const delta = ev.clientX - startX;
        const next = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, startWidth + delta));
        setSidebarWidth(next);
      };
      const onUp = () => {
        isResizing.current = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [collapsed, sidebarWidth]
  );

  const effectiveWidth = collapsed ? SIDEBAR_COLLAPSED : sidebarWidth;
  const pageKey = location.pathname;

  return (
    <div className="flex flex-col h-screen bg-page-bg text-text-primary overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          width={effectiveWidth}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        {!collapsed && (
          <div
            className="w-1 cursor-col-resize hover:bg-accent/40 transition-colors shrink-0"
            onMouseDown={onMouseDownDivider}
          />
        )}

        <main className="flex-1 overflow-auto p-6" key={pageKey}>
          <div className="page-enter">
            <Routes>
              <Route path="/" element={<ClientInfoPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/critical-capabilities/:entityId" element={<CriticalCapabilitySummaryPage />} />
              <Route path="/critical-capabilities/:entityId/:areaId" element={<CapabilityAreaPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </div>
        </main>
      </div>

      <StatsFooter />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StoreProvider>
  );
}
