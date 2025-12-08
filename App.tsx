import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { AnalyzerModule } from './components/AnalyzerModule';
import { LibraryModule } from './components/LibraryModule';
import { PlaygroundModule } from './components/PlaygroundModule';
import { DesignDNA } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'analyzer' | 'library' | 'playground'>('analyzer');
  const [library, setLibrary] = useState<DesignDNA[]>([]);
  const [selectedDNA, setSelectedDNA] = useState<DesignDNA | null>(null);

  // Load library from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('design_dna_library');
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load library");
      }
    }
  }, []);

  // Save to local storage whenever library changes
  useEffect(() => {
    localStorage.setItem('design_dna_library', JSON.stringify(library));
  }, [library]);

  const handleSaveDNA = (dna: DesignDNA) => {
    setLibrary(prev => [dna, ...prev]);
  };

  const handleDeleteDNA = (id: string) => {
    setLibrary(prev => prev.filter(item => item.id !== id));
  };

  const handleUseInPlayground = (dna: DesignDNA) => {
    setSelectedDNA(dna);
    setCurrentView('playground');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-sky-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8">
        <header className="mb-8">
          <NavBar 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            count={library.length} 
          />
        </header>

        <main className="max-w-6xl mx-auto min-h-[600px]">
          {currentView === 'analyzer' && (
            <AnalyzerModule onSave={handleSaveDNA} onNavigate={setCurrentView} />
          )}
          
          {currentView === 'library' && (
            <LibraryModule 
              items={library} 
              onDelete={handleDeleteDNA} 
              onUse={handleUseInPlayground} 
            />
          )}

          {currentView === 'playground' && (
            <PlaygroundModule 
              library={library} 
              initialDNA={selectedDNA} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
