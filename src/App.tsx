/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopNavigation, ActiveTabType } from './components/TopNavigation';
import { ChitrasutraCanvas } from './components/ChitrasutraCanvas';
import { ComponentExplodedModal } from './components/ComponentExplodedModal';
import { GraphicNovelAssembly } from './components/GraphicNovelAssembly';
import { ElectrochemicalGuide } from './components/ElectrochemicalGuide';
import { CadAutomationStudio } from './components/CadAutomationStudio';
import { ChitrasutraSlideDeck } from './components/ChitrasutraSlideDeck';
import { GCodeToolpathCenter } from './components/GCodeToolpathCenter';
import { EngineComponent } from './types/engine';
import { ENGINE_COMPONENTS, ASSEMBLY_STEPS } from './data/engineData';
import { Layers, Presentation, Terminal, BookOpen, Cpu, Code2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('canvas');
  const [selectedComponent, setSelectedComponent] = useState<EngineComponent | null>(null);

  // Full System Engineering Report Export Handler
  const handleExportReport = () => {
    const reportData = {
      title: "Chitrasutra Engine Matrix & Modular Propulsion Architecture",
      palette: {
        charcoal: "#0C0C0E",
        terracotta: "#C35237",
        electricCyan: "#00E5FF",
        khadiGold: "#8F7142"
      },
      physicsEngine: "Matter.js 2D Rigid Body Dynamics with Elastic Constraints",
      standard: "ISO 15500 / ISO 11439 / SAE J2343 Compliant",
      generatedAt: new Date().toISOString(),
      modules: {
        moduleA: {
          name: "Module A: The Power Grid & Storage Foundation",
          components: ENGINE_COMPONENTS.filter(c => c.moduleId === 'module-a'),
        },
        moduleB: {
          name: "Module B: The System Brain & Control Hub",
          components: ENGINE_COMPONENTS.filter(c => c.moduleId === 'module-b'),
        },
        moduleC: {
          name: "Module C: The Execution Rail & Combustion Matrix",
          components: ENGINE_COMPONENTS.filter(c => c.moduleId === 'module-c'),
        },
      },
      assemblySequence: ASSEMBLY_STEPS,
      gCodeToolpathRev: "MANIFOLD_SPACER_TOOLPATH_REVISION_3.NC",
      mhdSmrNuclearArchitecture: {
        concept: "Magnetohydrodynamic Small Modular Reactor (MHD-SMR) & Continuous Nuclear Battery",
        coreMatrix: "Transparent Reinforced Quartz Tubes with Molten Fluoride/Chloride Salt (Atmospheric 1.05 bar)",
        directExtraction: "Glass-Insulated Multi-Pull Induction Rails with Chitrasutra Symmetric Copper Coils",
        brain: "Solid-State Electromagnetic Control Grid with Lorentz Force Vectors (F = J x B)",
        housing: "Lost-Wax Cast Bronze and Copper Armature (Madhuchishta-Vidhana)",
        observatory: "Planetarium Glass Dome Research Digital Twin Platform"
      },
      electrochemicalConversionWhitepaper: {
        concept: "Atmospheric Liquid Organic Hydrogen Carrier / Aqueous Formate Micro-Reformer",
        fuelRailFeedPressure: "2.20 bar regulated differential over intake manifold",
        ecuCompatibility: "100% OEM firmware retention via synthetic MAP & analog telemetry conditioning",
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chitrasutra_engine_master_blueprint.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-slate-100 flex flex-col font-sans selection:bg-[#C35237]/40 selection:text-amber-200">
      {/* Top Bar Contract Navigation */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportReport={handleExportReport}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'canvas' && (
          <div className="flex-1 flex flex-col">
            <ChitrasutraCanvas
              onSelectComponent={(comp) => setSelectedComponent(comp)}
              selectedComponentId={selectedComponent?.id || null}
            />
          </div>
        )}

        {activeTab === 'slides' && (
          <div className="flex-1 overflow-y-auto">
            <ChitrasutraSlideDeck />
          </div>
        )}

        {activeTab === 'gcode' && (
          <div className="flex-1 overflow-y-auto">
            <GCodeToolpathCenter />
          </div>
        )}

        {activeTab === 'graphic-novel' && (
          <div className="flex-1 overflow-y-auto">
            <GraphicNovelAssembly />
          </div>
        )}

        {activeTab === 'electrochemical' && (
          <div className="flex-1 overflow-y-auto">
            <ElectrochemicalGuide />
          </div>
        )}

        {activeTab === 'cad-automation' && (
          <div className="flex-1 overflow-y-auto">
            <CadAutomationStudio />
          </div>
        )}
      </main>

      {/* Component Exploded Modal */}
      <ComponentExplodedModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="xl:hidden sticky bottom-0 z-30 flex items-center justify-around px-2 py-2 bg-[#0C0C0E]/95 backdrop-blur-md border-t border-slate-800">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'canvas' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Physics</span>
        </button>
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'slides' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>Slides</span>
        </button>
        <button
          onClick={() => setActiveTab('gcode')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'gcode' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>G-Code</span>
        </button>
        <button
          onClick={() => setActiveTab('graphic-novel')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'graphic-novel' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Novel</span>
        </button>
        <button
          onClick={() => setActiveTab('electrochemical')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'electrochemical' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Cell</span>
        </button>
        <button
          onClick={() => setActiveTab('cad-automation')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'cad-automation' ? 'text-[#00E5FF]' : 'text-slate-400'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>CAD</span>
        </button>
      </div>

      {/* Quiet Technical Footer */}
      <footer className="px-6 py-3.5 border-t border-slate-800/80 bg-[#08090D] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>Chitrasutra Engine Matrix</span>
          <span>·</span>
          <span>Matter.js Physics Integration</span>
          <span>·</span>
          <span>Khadi Canvas Scroll Blueprint</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-[#C35237]">#C35237 Terracotta</span>
          <span className="text-[#00E5FF]">#00E5FF Cyan</span>
          <span className="text-[#8F7142]">#8F7142 Khadi</span>
        </div>
      </footer>
    </div>
  );
}
