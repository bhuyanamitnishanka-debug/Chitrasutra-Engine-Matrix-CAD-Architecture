import React, { useState } from 'react';
import { ASSEMBLY_STEPS } from '../data/engineData';
import { 
  Wrench, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ChevronRight, 
  Check, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const GraphicNovelAssembly: React.FC = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const currentStep = ASSEMBLY_STEPS[selectedStepIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-amber-900/30 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-display">
          <span>चित्रकथा संकलन · SECTION 03</span>
          <span className="text-slate-600">/</span>
          <span>ENGINEERING GRAPHIC NOVEL SEQUENCE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
          Modular Assembly Narrative & Toolpath Vectors
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          A 3-step sequential engineering assembly manual formatted as an architectural graphic novel storyboard. 
          Follow the precise step-by-step procedure locking Module A to Module B, and docking into Module C with ISO-standard aerospace tolerances.
        </p>
      </div>

      {/* 3-Step Sequential Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ASSEMBLY_STEPS.map((step, idx) => (
          <button
            key={step.stepNumber}
            onClick={() => setSelectedStepIndex(idx)}
            className={`flex flex-col p-4 rounded-xl text-left border transition-all ${
              selectedStepIndex === idx
                ? 'bg-amber-950/20 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                ACT 0{step.stepNumber}
              </span>
              {selectedStepIndex > idx ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
              ) : (
                <span className="text-[11px] font-display text-slate-500">मण्डल {idx + 1}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-200 line-clamp-1">
              {step.title}
            </span>
            <span className="text-[11px] text-amber-300/80 font-display mt-1">
              {step.sanskritSutra}
            </span>
          </button>
        ))}
      </div>

      {/* Main Graphic Novel Storyboard Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Graphic Novel Comic Panel Visual (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b0e18] rounded-2xl border-2 border-amber-900/40 p-6 shadow-2xl relative overflow-hidden space-y-6">
          {/* Halftone / Sketch decorative grid */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Panel Header Stamp */}
          <div className="flex items-center justify-between border-b border-amber-800/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs rounded border border-amber-500/30">
                FRAME 0{currentStep.stepNumber} // CUTAWAY SCHEMATIC
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              MODULES: {currentStep.modulesInvolved.join(' ➔ ')}
            </span>
          </div>

          {/* Narrative Scene Panel Artwork (SVG Drawing) */}
          <div className="relative w-full h-72 bg-[#060810] rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 600 300">
              {/* Technical Drawing Grids */}
              <defs>
                <pattern id="cad-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(217, 119, 6, 0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="300" fill="url(#cad-grid)" />

              {/* Dynamic Graphic Novel Assembly Scene based on Step */}
              {currentStep.stepNumber === 1 && (
                <g>
                  {/* Chassis Cradle Saddles */}
                  <rect x="120" y="80" width="360" height="140" rx="8" fill="#131a2a" stroke="#d97706" strokeWidth="2" strokeDasharray="6 3" />
                  
                  {/* Twin Cylinders sliding downward with motion arrows */}
                  <g className="animate-pulse">
                    <rect x="140" y="100" width="320" height="42" rx="12" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="140" y="155" width="320" height="42" rx="12" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  </g>

                  {/* Motion Vector Arrows (Downward seating) */}
                  <path d="M 300 40 L 300 85 M 290 75 L 300 85 L 310 75" stroke="#f59e0b" strokeWidth="3" fill="none" />
                  <text x="300" y="32" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                    SEAT CYLINDERS (CRADLE PCD: 65 Nm)
                  </text>

                  {/* Swagelok Conduit Ferrule Lock */}
                  <circle cx="480" cy="120" r="14" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
                  <text x="480" y="124" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="JetBrains Mono">
                    1.25T
                  </text>
                  <text x="480" y="150" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="Plus Jakarta Sans">
                    Swagelok SS316L
                  </text>
                </g>
              )}

              {currentStep.stepNumber === 2 && (
                <g>
                  {/* Bulkhead Interface */}
                  <line x1="80" y1="50" x2="80" y2="250" stroke="#64748b" strokeWidth="4" />
                  <text x="70" y="150" textAnchor="middle" transform="rotate(-90 70 150)" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                    FIREWALL BULKHEAD
                  </text>

                  {/* Heated Regulator Block */}
                  <rect x="160" y="90" width="130" height="110" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="225" cy="145" r="28" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
                  <text x="225" y="149" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily="JetBrains Mono">
                    REGULATOR
                  </text>

                  {/* Coolant Loop Elbows */}
                  <path d="M 225 90 L 225 60 L 320 60" stroke="#f97316" strokeWidth="3" fill="none" />
                  <text x="280" y="52" fill="#fb923c" fontSize="9" fontFamily="JetBrains Mono">COOLANT 90°C</text>

                  {/* ECU Module on Right */}
                  <rect x="380" y="80" width="150" height="130" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="455" y="145" textAnchor="middle" fill="#bae6fd" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                    CNG ECU (56-PIN)
                  </text>

                  {/* Gold Wiring Loom */}
                  <path d="M 290 160 C 330 160, 340 180, 380 180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" fill="none" />
                </g>
              )}

              {currentStep.stepNumber === 3 && (
                <g>
                  {/* Cylinder Head Intake Ports */}
                  <rect x="100" y="180" width="400" height="60" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  {[160, 240, 320, 400].map((cx, i) => (
                    <ellipse key={i} cx={cx} cy="210" rx="20" ry="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  ))}
                  <text x="300" y="260" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                    ENGINE CYLINDER HEAD PORTS (PITCH 48.00 mm)
                  </text>

                  {/* Blue Injector Rail Lowering Down */}
                  <g className="animate-bounce">
                    <rect x="120" y="80" width="360" height="28" rx="6" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
                    {[160, 240, 320, 400].map((cx, i) => (
                      <g key={i}>
                        <rect x={cx - 14} y="108" width="28" height="28" rx="4" fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" />
                        <line x1={cx} y1="136" x2={cx} y2="175" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                      </g>
                    ))}
                  </g>

                  {/* Assembly Alignment Arrows */}
                  <path d="M 80 100 L 80 170 M 74 160 L 80 170 L 86 160" stroke="#34d399" strokeWidth="2" fill="none" />
                  <text x="75" y="135" textAnchor="middle" transform="rotate(-90 75 135)" fill="#34d399" fontSize="9" fontFamily="JetBrains Mono">
                    CLICK SEAT (9.8 Nm)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Graphic Novel Narrative Dialogue Bubble */}
          <div className="p-4 bg-[#141b2d] rounded-xl border border-amber-500/30 relative">
            {/* Comic Bubble Pointer */}
            <div className="absolute -top-2 left-8 w-4 h-4 bg-[#141b2d] border-t border-l border-amber-500/30 transform rotate-45" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-xs text-slate-950 shrink-0">
                ENG
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300">
                  Lead Propulsion Architect:
                </span>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  {currentStep.actionDialogue}
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Lead Context */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.narrativeLead}
          </p>
        </div>

        {/* Right Column: Rigorous Technical Specifications & Vector Tables (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fastener Torque & Safety Card */}
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Wrench className="w-4 h-4" />
              <span>Fastener Torque & Clamping Protocols</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-200">
              {currentStep.fastenerTorque}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety & Proof Testing Mandate</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {currentStep.safetyProtocol}
            </div>
          </div>

          {/* Tolerance Window Matrix */}
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Cpu className="w-4 h-4" />
              <span>Physical Tolerance & Fit Margins</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-sky-200">
              {currentStep.toleranceWindow}
            </div>
          </div>

          {/* 5-Axis CNC Toolpath Vectors */}
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Terminal className="w-4 h-4" />
              <span>CNC Toolpath Vector (G-Code Stream)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-nowrap">
              {currentStep.gCodeToolpath}
            </div>
          </div>

          {/* QA Inspection Signoff */}
          <div className="p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-start gap-3 text-xs">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-300 block">Quality Assurance Gate:</span>
              <span className="text-slate-300">{currentStep.qualityCheck}</span>
            </div>
          </div>

          {/* Next Step Nav */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={selectedStepIndex === 0}
              onClick={() => setSelectedStepIndex((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
            >
              Previous Frame
            </button>
            <button
              disabled={selectedStepIndex === ASSEMBLY_STEPS.length - 1}
              onClick={() => setSelectedStepIndex((prev) => Math.min(prev + 1, ASSEMBLY_STEPS.length - 1))}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors disabled:opacity-40"
            >
              <span>Next Assembly Act</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
