import { Link, useParams } from 'react-router-dom';
import { useStore } from '@/store';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  const { entityId, areaId } = useParams();
  const { data } = useStore();
  if (!data) return null;

  const segments: { label: string; path: string }[] = [];

  if (entityId) {
    for (const mc of data.macro_capabilities) {
      const cc = mc.critical_capabilities.find((c) => c.id === entityId);
      if (cc) {
        segments.push({ label: mc.name, path: '/dashboard' });
        segments.push({ label: cc.name, path: `/critical-capabilities/${entityId}` });
        if (areaId) {
          const area = cc.capability_areas.find((ca) => ca.id === areaId);
          if (area) segments.push({ label: area.name, path: `/critical-capabilities/${entityId}/${areaId}` });
        }
        break;
      }
    }
  }

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 mb-5 text-[11px]">
      <Link to="/dashboard" className="text-text-tertiary hover:text-accent transition-colors">
        Home
      </Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={seg.path} className="flex items-center gap-1.5">
            <ChevronRight size={10} className="text-text-tertiary" />
            {isLast ? (
              <span className="text-text-secondary font-medium">{seg.label}</span>
            ) : (
              <Link to={seg.path} className="text-text-tertiary hover:text-accent transition-colors">
                {seg.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
