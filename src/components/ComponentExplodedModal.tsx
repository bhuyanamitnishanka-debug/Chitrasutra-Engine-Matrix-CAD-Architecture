import React, { useState } from 'react';
import { EngineComponent } from '../types/engine';
import { 
  X, 
  Maximize2, 
  Sliders, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Info,
  CheckCircle2,
  Minimize2
} from 'lucide-react';

interface ComponentExplodedModalProps {
  component: EngineComponent | null;
  onClose: () => void;
}

export const ComponentExplodedModal: React.FC<ComponentExplodedModalProps> = ({
  component,
  onClose,
}) => {
  const [explodeRatio, setExplodeRatio] = useState<number>(0.65);
  const [activeTab, setActiveTab] = useState<'exploded' | 'subcomponents' | 'electrochemical' | 'cad-matrix'>('exploded');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative flex flex-col bg-[#0d101b] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl max-h-[92vh]'
        }`}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111625] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 font-display">
                  {component.sanskritName}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">{component.hindiName}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                {component.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sub-Header Tabs */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#0e1220] border-b border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('exploded')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'exploded'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exploded View Vector
            </button>
            <button
              onClick={() => setActiveTab('subcomponents')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'subcomponents'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sub-Assemblies & Tolerances ({component.subComponents.length})
            </button>
            <button
              onClick={() => setActiveTab('electrochemical')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'electrochemical'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Electrochemical Alternative
            </button>
            <button
              onClick={() => setActiveTab('cad-matrix')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                activeTab === 'cad-matrix'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CAD Coordinates & Vectors
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span className="text-[11px] font-mono">Module: {component.moduleTitle.split(':')[0]}</span>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'exploded' && (
            <div className="space-y-6">
              {/* Exploded Slider Bar */}
              <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Interactive Explode Vector</span>
                    <p className="text-[11px] text-slate-400">Scrub to pull sub-assemblies apart along their 3D toolpath axes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodeRatio}
                    onChange={(e) => setExplodeRatio(parseFloat(e.target.value))}
                    className="w-48 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-xs font-mono font-bold text-amber-300 tabular-nums min-w-[3rem]">
                    {Math.round(explodeRatio * 100)}%
                  </span>
                </div>
              </div>

              {/* Dynamic SVG Exploded Diagram Viewport */}
              <div className="relative w-full h-80 bg-[#07090f] rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Blueprint grid background */}
                <div 
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #d97706 1px, transparent 1px), linear-gradient(to bottom, #d97706 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                  }}
                />

                <svg className="w-full h-full relative z-10" viewBox="-300 -180 600 360">
                  {/* Central Assembly Anchor */}
                  <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                    ORIGIN
                  </text>

                  {/* Sub-components exploded along vectors */}
                  {component.subComponents.map((sub, idx) => {
                    const dispX = sub.explodedOffset.x * explodeRatio * 1.8;
                    const dispY = sub.explodedOffset.y * explodeRatio * 1.8;

                    return (
                      <g key={sub.id} className="transition-transform duration-75">
                        {/* Exploded Guide Line */}
                        <line
                          x1="0"
                          y1="0"
                          x2={dispX}
                          y2={dispY}
                          stroke="rgba(245, 158, 11, 0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />

                        {/* Part Node Box */}
                        <rect
                          x={dispX - 60}
                          y={dispY - 24}
                          width="120"
                          height="48"
                          rx="6"
                          fill="#131a2c"
                          stroke={idx === 0 ? "#f59e0b" : "#38bdf8"}
                          strokeWidth="1.5"
                        />

                        {/* Part Text */}
                        <text
                          x={dispX}
                          y={dispY - 6}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="Plus Jakarta Sans"
                        >
                          {sub.name.length > 20 ? sub.name.substring(0, 18) + '...' : sub.name}
                        </text>
                        <text
                          x={dispX}
                          y={dispY + 10}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="8"
                          fontFamily="JetBrains Mono"
                        >
                          {sub.sanskritName}
                        </text>

                        {/* Coordinate Vector Bubble */}
                        <text
                          x={dispX}
                          y={dispY + 34}
                          textAnchor="middle"
                          fill="#d97706"
                          fontSize="8"
                          fontFamily="JetBrains Mono"
                        >
                          Δ [{Math.round(dispX)}, {Math.round(dispY)}] mm
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Component Key Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Pressure Rating</span>
                  <p className="text-sm font-semibold text-slate-100 font-mono mt-1">{component.pressureRating}</p>
                </div>
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Operating Temperature</span>
                  <p className="text-sm font-semibold text-slate-100 font-mono mt-1">{component.operatingTemp}</p>
                </div>
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Material Specification</span>
                  <p className="text-sm font-semibold text-slate-100 mt-1">{component.materialSpec}</p>
                </div>
              </div>

              {/* Functional Role Description */}
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Engineering Functional Analysis</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{component.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'subcomponents' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111728] text-slate-300 border-b border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Sub-Component</th>
                      <th className="py-3 px-4">Sanskrit Term</th>
                      <th className="py-3 px-4">Material Specification</th>
                      <th className="py-3 px-4">Tolerance / Fit Standard</th>
                      <th className="py-3 px-4">Functional Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/20 text-slate-300">
                    {component.subComponents.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-100">{sub.name}</td>
                        <td className="py-3 px-4 font-display text-amber-300">{sub.sanskritName}</td>
                        <td className="py-3 px-4">{sub.material}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400">{sub.tolerance}</td>
                        <td className="py-3 px-4 text-slate-400">{sub.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'electrochemical' && (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Electrochemical Evolution: {component.electrochemicalAlternative.componentName}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {component.electrochemicalAlternative.conversionDetail}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Primary Advantage over High-Pressure CNG</span>
                  </div>
                  <p className="text-xs text-slate-300">{component.electrochemicalAlternative.advantage}</p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Fluid / Signal Interface Adaptation</span>
                  </div>
                  <p className="text-xs text-slate-300">{component.electrochemicalAlternative.flowAdaptation}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cad-matrix' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-sky-300">3D Coordinate Geometry & Exploded Vector</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Origin (X, Y, Z) mm</span>
                    <span className="text-sky-300 font-bold">
                      [{component.cadCoordinates.origin.join(', ')}]
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Exploded Vector (Vx, Vy, Vz)</span>
                    <span className="text-amber-400 font-bold">
                      [{component.cadCoordinates.explodedVector.join(', ')}]
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Bounding Envelope (L, W, H) mm</span>
                    <span className="text-emerald-400 font-bold">
                      [{component.cadCoordinates.boundingVolume.join(', ')}]
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <span className="text-amber-400 font-semibold block">// SolidWorks API ExplodeStep Binding</span>
                <pre className="text-[11px] leading-relaxed overflow-x-auto text-slate-400">
{`# SolidWorks Assembly Explode Step Generator
explodeStep = swAssembly.CreateExplodeStep()
explodeStep.SetComponents(componentHandle)
explodeStep.SetExplodeDistance(${Math.round(
  Math.sqrt(
    Math.pow(component.cadCoordinates.explodedVector[0], 2) +
    Math.pow(component.cadCoordinates.explodedVector[1], 2) +
    Math.pow(component.cadCoordinates.explodedVector[2], 2)
  )
)} / 1000.0) # meters
explodeStep.SetExplodeDirection(
    ${component.cadCoordinates.explodedVector[0] / 100.0},
    ${component.cadCoordinates.explodedVector[1] / 100.0},
    ${component.cadCoordinates.explodedVector[2] / 100.0}
)`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#111625] border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Signal Logic:</span>
            <span className="font-mono text-slate-200">{component.signalLogic}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
