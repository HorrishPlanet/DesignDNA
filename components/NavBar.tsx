import React from 'react';
import { LayoutDashboard, Library, FlaskConical } from 'lucide-react';

interface NavBarProps {
  currentView: 'analyzer' | 'library' | 'playground';
  onNavigate: (view: 'analyzer' | 'library' | 'playground') => void;
  count: number;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate, count }) => {
  const items = [
    { id: 'analyzer', label: 'Analyzer', icon: LayoutDashboard },
    { id: 'library', label: 'DNA Library', icon: Library, badge: count },
    { id: 'playground', label: 'Playground', icon: FlaskConical },
  ] as { id: 'analyzer' | 'library' | 'playground'; label: string; icon: React.ElementType; badge?: number }[];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-800">
        {items.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                relative flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 rounded-full ${isActive ? 'bg-sky-400/30' : 'bg-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};