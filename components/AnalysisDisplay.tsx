import React, { useState } from 'react';
import { DesignDNA } from '../types';
import { Copy, Check, Tag, Layout, PenTool } from 'lucide-react';

interface AnalysisDisplayProps {
  result: DesignDNA | null;
  isLoading: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (result?.basePrompt) {
      navigator.clipboard.writeText(result.basePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-slate-700 rounded-full"></div>
          ))}
        </div>
        <div className="h-4 bg-slate-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 mb-8"></div>
        <div className="h-32 bg-slate-700 rounded w-full"></div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6 animate-fade-in">
      {/* Style Tags */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-sky-400 mb-4">
          <Tag className="w-5 h-5" />
          Style Keywords
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.styleTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-sky-900/30 text-sky-200 text-sm font-medium rounded-full border border-sky-700/50 hover:bg-sky-900/50 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Layout Description */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-400 mb-4">
          <Layout className="w-5 h-5" />
          Layout Structure
        </h3>
        <div className="space-y-2 text-slate-300 leading-relaxed">
          <p><span className="text-slate-500 font-medium">Grid:</span> {result.layout.grid}</p>
          <p><span className="text-slate-500 font-medium">Hierarchy:</span> {result.layout.hierarchy}</p>
          <p><span className="text-slate-500 font-medium">Structure:</span> {result.layout.structure}</p>
          <p><span className="text-slate-500 font-medium">Spacing:</span> {result.layout.spacing}</p>
        </div>
      </div>

      {/* Generation Prompt */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm group">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-400">
            <PenTool className="w-5 h-5" />
            Generation Prompt
          </h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-700/50 hover:bg-slate-700 hover:text-white rounded-md transition-all border border-slate-600"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <pre className="p-4 bg-black/40 rounded-lg text-slate-300 text-sm whitespace-pre-wrap leading-relaxed border border-slate-700/50 font-mono">
            {result.basePrompt}
          </pre>
        </div>
      </div>
    </div>
  );
};