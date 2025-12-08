import React from 'react';
import { DraftComponent } from '../types';
import { Image as ImageIcon } from 'lucide-react';

interface DraftPreviewProps {
  component: DraftComponent;
}

const DraftNode: React.FC<{ node: DraftComponent }> = ({ node }) => {
  const { type, styles, content, children } = node;

  // Base render logic based on type
  switch (type) {
    case 'container':
    case 'card':
      return (
        <div className={styles}>
          {children?.map((child, i) => <DraftNode key={i} node={child} />)}
        </div>
      );
    
    case 'header':
      return (
        <h3 className={styles}>
          {content}
          {children?.map((child, i) => <DraftNode key={i} node={child} />)}
        </h3>
      );
      
    case 'text':
      return (
        <p className={styles}>
          {content}
        </p>
      );
      
    case 'button':
      return (
        <button className={styles}>
          {content}
        </button>
      );
      
    case 'input':
      return (
        <input 
          type="text" 
          className={styles} 
          placeholder={content || "Input..."} 
          readOnly 
        />
      );
      
    case 'image':
      return (
        <div className={`${styles} flex items-center justify-center bg-slate-800/50 border border-slate-700/50`}>
          <ImageIcon className="w-8 h-8 opacity-20" />
        </div>
      );
      
    default:
      return null;
  }
};

export const DraftPreview: React.FC<DraftPreviewProps> = ({ component }) => {
  return (
    <div className="w-full h-full overflow-hidden bg-slate-950/50 rounded-lg border border-slate-800 relative">
      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-slate-500 font-mono z-10">
        LIVE PREVIEW
      </div>
      <div className="w-full h-full overflow-auto p-4 custom-scrollbar">
         {/* Wrap in a safe transform container to prevent breaking out */}
         <div className="w-full">
            <DraftNode node={component} />
         </div>
      </div>
    </div>
  );
};
