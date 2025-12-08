import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { analyzeDesignDNA } from '../services/geminiService';
import { ImageUpload, DesignDNA } from '../types';
import { Save, Loader2, ArrowRight } from 'lucide-react';

interface AnalyzerModuleProps {
  onSave: (dna: DesignDNA) => void;
  onNavigate: (view: 'library') => void;
}

export const AnalyzerModule: React.FC<AnalyzerModuleProps> = ({ onSave, onNavigate }) => {
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [result, setResult] = useState<DesignDNA | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (uploaded: ImageUpload | null) => {
    setImage(uploaded);
    setResult(null);
    if (!uploaded) return;

    setLoading(true);
    try {
      const dna = await analyzeDesignDNA(uploaded.base64, uploaded.mimeType);
      const fullRecord: DesignDNA = {
        ...dna,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageUrl: uploaded.previewUrl,
      };
      setResult(fullRecord);
    } catch (e) {
      alert("Analysis failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      onSave(result);
      onNavigate('library');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Design Vision Analyzer</h2>
        <p className="text-slate-400">Upload an interface to extract its DNA structure</p>
      </div>

      <ImageUploader onImageSelected={handleAnalyze} isLoading={loading} />

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500 mb-4" />
          <p className="text-sky-300">Decideding Design DNA...</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Analysis Result</h3>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium"
            >
              <Save className="w-4 h-4" /> Save to Library
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Color System</h4>
              <div className="flex gap-2 mb-3">
                {result.colors.palette.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full shadow-lg border border-white/10" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
              <p className="text-slate-300 text-sm">{result.colors.mood}</p>
            </div>

            {/* Tags */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Style Tags</h4>
              <div className="flex flex-wrap gap-2">
                {result.styleTags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

             {/* Layout */}
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 md:col-span-2">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Layout & Composition</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="text-slate-500 block">Grid System</span>
                   <span className="text-slate-200">{result.layout.grid}</span>
                </div>
                <div>
                   <span className="text-slate-500 block">Structure</span>
                   <span className="text-slate-200">{result.layout.structure}</span>
                </div>
              </div>
            </div>
            
             {/* Prompt Preview */}
             <div className="bg-black/30 p-4 rounded-xl border border-slate-800 md:col-span-2 font-mono text-xs text-slate-400">
                {result.basePrompt}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
