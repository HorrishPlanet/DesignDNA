import React from 'react';
import { DesignDNA } from '../types';
import { Trash2, ExternalLink, Palette } from 'lucide-react';

interface LibraryModuleProps {
  items: DesignDNA[];
  onDelete: (id: string) => void;
  onUse: (dna: DesignDNA) => void;
}

export const LibraryModule: React.FC<LibraryModuleProps> = ({ items, onDelete, onUse }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">Library is Empty</h3>
        <p>Analyze some images to build your DNA collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold text-white">DNA Library</h2>
         <span className="text-slate-400 text-sm">{items.length} styles saved</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((dna) => (
            <div key={dna.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-sky-500/50 transition-colors group">
              <div className="h-32 bg-slate-900 relative overflow-hidden">
                {dna.imageUrl ? (
                  <img src={dna.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                )}
                <div className="absolute bottom-2 right-2 flex gap-1">
                   {dna.colors.palette.slice(0, 3).map((c, i) => (
                     <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                   ))}
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {dna.styleTags.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{dna.layout.structure}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                  <button 
                    onClick={() => onUse(dna)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded uppercase tracking-wide transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> Use in Playground
                  </button>
                  <button 
                    onClick={() => onDelete(dna.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};
