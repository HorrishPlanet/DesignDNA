import React, { useState, useEffect } from 'react';
import { DesignDNA, DraftComponent } from '../types';
import { Sliders, Copy, Wand2, Play, Loader2 } from 'lucide-react';
import { generateDesignDraft } from '../services/geminiService';
import { DraftPreview } from './DraftPreview';

interface PlaygroundModuleProps {
  library: DesignDNA[];
  initialDNA?: DesignDNA | null;
}

export const PlaygroundModule: React.FC<PlaygroundModuleProps> = ({ library, initialDNA }) => {
  const [selectedId, setSelectedId] = useState<string>(initialDNA?.id || "");
  const [modifiers, setModifiers] = useState({
    blur: 50,
    complexity: 50,
    warmth: 50,
    mood: 'neutral' as 'neutral' | 'dark' | 'light' | 'colorful'
  });
  
  const [finalPrompt, setFinalPrompt] = useState("");
  const [draftResult, setDraftResult] = useState<DraftComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedDNA = library.find(d => d.id === selectedId);

  // Initial prompt generation (local logic only)
  useEffect(() => {
    if (selectedDNA) {
      updateLocalPrompt();
    }
  }, [selectedDNA, modifiers]);

  const updateLocalPrompt = () => {
    if (!selectedDNA) return;
    const moodStr = modifiers.mood === 'neutral' ? '' : `${modifiers.mood} mode,`;
    const blurStr = modifiers.blur > 70 ? 'soft focus, ethereal' : modifiers.blur < 30 ? 'sharp, crisp' : '';
    const newPrompt = `[DRAFT PREVIEW PENDING]\n\nContext: ${selectedDNA.styleTags.join(', ')}\nAesthetic: ${selectedDNA.colors.mood}\nModifiers: ${moodStr} ${blurStr}`;
    if (!draftResult) {
        setFinalPrompt(newPrompt);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedDNA) return;
    
    setIsGenerating(true);
    setDraftResult(null); // Clear previous draft
    try {
      // Call the service (which simulates the API)
      const result = await generateDesignDraft(selectedDNA, modifiers);
      setFinalPrompt(result.finalPrompt);
      setDraftResult(result.draft);
    } catch (e) {
      console.error(e);
      alert("Failed to generate draft. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (library.length === 0) {
     return <div className="text-center text-slate-500 py-10">Library is empty. Analyze designs first.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* COLUMN 1: CONTROLS (3 Cols) */}
      <div className="lg:col-span-3 flex flex-col bg-slate-900/50 p-5 rounded-2xl border border-slate-800 h-full overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4" /> Configuration
        </h3>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Style DNA</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-sky-500 outline-none"
              value={selectedId}
              onChange={(e) => {
                  setSelectedId(e.target.value);
                  setDraftResult(null);
              }}
            >
              <option value="" disabled>Select a style...</option>
              {library.map(d => (
                <option key={d.id} value={d.id}>
                  {d.styleTags[0]} ({new Date(d.timestamp).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {selectedDNA && (
            <>
               <div className="space-y-4">
                 <div className="space-y-2">
                   <div className="flex justify-between text-xs text-slate-400">
                     <span>Minimal</span>
                     <span>Complex</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={modifiers.complexity} 
                     onChange={e => setModifiers({...modifiers, complexity: parseInt(e.target.value)})}
                     className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                   />
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between text-xs text-slate-400">
                     <span>Sharp</span>
                     <span>Soft</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={modifiers.blur} 
                     onChange={e => setModifiers({...modifiers, blur: parseInt(e.target.value)})}
                     className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                   />
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between text-xs text-slate-400">
                     <span>Cold</span>
                     <span>Warm</span>
                   </div>
                   <input 
                     type="range" min="0" max="100" 
                     value={modifiers.warmth} 
                     onChange={e => setModifiers({...modifiers, warmth: parseInt(e.target.value)})}
                     className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                   />
                 </div>
               </div>

               <div>
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Mood</label>
                <div className="grid grid-cols-2 gap-2">
                  {['neutral', 'dark', 'light', 'colorful'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setModifiers({...modifiers, mood: m as any})}
                      className={`px-2 py-1.5 rounded text-xs capitalize transition-all border ${
                        modifiers.mood === m 
                        ? 'bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-900/50' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {selectedDNA && (
            <button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className={`mt-6 w-full py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                    isGenerating 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white'
                }`}
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                {isGenerating ? "Generating..." : "Generate Draft"}
            </button>
        )}
      </div>

      {/* COLUMN 2: PROMPT (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col h-full bg-black/40 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Prompt</h3>
             <button 
                onClick={() => navigator.clipboard.writeText(finalPrompt)}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copy"
             >
                <Copy className="w-3 h-3" />
             </button>
        </div>
        <textarea 
            className="flex-1 w-full p-4 bg-transparent border-none resize-none text-slate-300 font-mono text-xs leading-relaxed focus:ring-0 outline-none"
            value={finalPrompt}
            readOnly
        />
      </div>

      {/* COLUMN 3: PREVIEW (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col h-full">
         {!selectedDNA ? (
             <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600">
                 <div className="text-center">
                    <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select DNA to start</p>
                 </div>
             </div>
         ) : draftResult ? (
             <DraftPreview component={draftResult} />
         ) : (
             <div className="flex-1 bg-slate-900/20 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                 {isGenerating && (
                     <div className="absolute inset-0 bg-slate-950/80 z-10 flex flex-col items-center justify-center gap-3">
                         <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                         <p className="text-sky-400 text-xs font-mono animate-pulse">Constructing UI Draft...</p>
                     </div>
                 )}
                 <div className="text-center text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium">Visual Preview Area</p>
                    <p className="text-xs mt-1">Click "Generate Draft" to build UI</p>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};
