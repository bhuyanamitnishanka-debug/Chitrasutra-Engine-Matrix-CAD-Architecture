import React, { useState } from 'react';
import { 
  Cpu, 
  Flame, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Settings2,
  Layers,
  Sparkles
} from 'lucide-react';

export const ElectrochemicalGuide: React.FC = () => {
  // Live simulation interactive parameters
  const [engineRpm, setEngineRpm] = useState<number>(2400);
  const [manifoldPressureBar, setManifoldPressureBar] = useState<number>(0.65);

  // Computed stoichiometric metrics
  // Air mass flow roughly scales with RPM and MAP
  const airMassGramsPerSec = (engineRpm / 60) * 0.8 * manifoldPressureBar * 1.6;
  // Stoichiometric air-fuel ratio: CNG ~17.2:1, Reformate Syngas/H2 ~14.6:1
  const reformateFuelMassGramsPerSec = airMassGramsPerSec / 15.2;
  // Injector pulse width in milliseconds (typical 4-stroke 4-cyl sequential injection)
  const pulseWidthMs = (reformateFuelMassGramsPerSec / 4) * 8.4;
  // Liquid electrochemical dosing pump flow in mL/min
  const liquidPumpDosingRateMlMin = reformateFuelMassGramsPerSec * 48.0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-amber-900/30 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-display">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>श्वेतपत्र एवं तकनीकी आलेख · ADVANCED CONVERSION WHITEPAPER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
          Replacing 200-Bar CNG Cylinders with Liquid Electrochemical Reformer
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive step-by-step engineering documentation for retrofitting vehicular high-pressure gas storage with an atmospheric liquid electrochemical cell (Liquid Organic Hydrogen Carrier / Formate fuel array) while keeping 100% of OEM CNG ECU firmware and 4-port injector rail hardware completely intact.
        </p>
      </div>

      {/* Comparative Architecture Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Original CNG Setup */}
        <div className="p-6 bg-[#0e121e] rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
              Legacy Mechanical System
            </span>
            <span className="text-xs text-slate-500 font-display">200-Bar Compressed Gas</span>
          </div>
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Flame className="w-5 h-5 text-sky-400" />
            <span>Dual CNG Cylinders + Mechanical Depressurization</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-slate-500 font-mono">01.</span>
              <span><strong>Storage State:</strong> Supercritical gas compressed to 200–260 bar in heavy carbon/steel vessels (78 kg dry tare weight).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-500 font-mono">02.</span>
              <span><strong>Thermodynamics:</strong> Severe Joule-Thomson cooling during mass flow expansion requires high-flow 90°C engine coolant line loops to prevent icing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-500 font-mono">03.</span>
              <span><strong>Safety Envelope:</strong> High explosive rupture hazard requiring annual hydrostatic recertification and rupture relief discs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-500 font-mono">04.</span>
              <span><strong>Volumetric Efficiency:</strong> ~9.2 MJ/L energy density at 200 bar.</span>
            </li>
          </ul>
        </div>

        {/* Right: Liquid Electrochemical Evolution */}
        <div className="p-6 bg-[#0c1619] rounded-2xl border border-emerald-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Modern Electrochemical Upgrade
            </span>
            <span className="text-xs text-emerald-400/80 font-display">Ambient Liquid State (1.0 Bar)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Liquid Organic Carrier + Micro-Catalytic Reformer</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Storage State:</strong> Stored as non-flammable liquid (Aqueous Formate / LOHC) in lightweight HDPE plastic fuel cell at 1.0 bar (tare weight: 14 kg).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Thermodynamics:</strong> Scavenges engine waste heat (coolant + exhaust thermal loop) to catalyze endothermic dehydrogenation, delivering fuel gas at steady 2.2 bar.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero Exploding Gas Hazard:</strong> Gas is created strictly on-demand in micro-quantities; maximum gas volume in the vehicle is &lt; 0.5 liters at any instant!</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Volumetric Efficiency:</strong> ~15.4 MJ/L energy density (1.67x higher vehicle cruising range per tank).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive ECU Pulse-Width & Stoichiometric Emulation Simulator */}
      <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-amber-400" />
              <span>Live ECU Injection Timing & Liquid Metering Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrates how the liquid dosing pump dynamically tracks engine load to supply the injector rail at exactly 2.2 bar without altering ECU injection pulse algorithms.
            </p>
          </div>
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-mono border border-emerald-500/30 flex items-center gap-1.5 self-start">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>ECU FIRING STATUS: SYNCHRONIZED</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Engine Speed (RPM)</span>
              <span className="font-mono text-amber-300 font-bold tabular-nums">{engineRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="6000"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>800 (Idle)</span>
              <span>3000 (Cruise)</span>
              <span>6000 (Redline)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Manifold Absolute Pressure (MAP)</span>
              <span className="font-mono text-sky-300 font-bold tabular-nums">{manifoldPressureBar.toFixed(2)} bar</span>
            </div>
            <input
              type="range"
              min="0.25"
              max="1.20"
              step="0.05"
              value={manifoldPressureBar}
              onChange={(e) => setManifoldPressureBar(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.25 (Decel Vacuum)</span>
              <span>0.70 (Part Load)</span>
              <span>1.20 (WOT Boost)</span>
            </div>
          </div>
        </div>

        {/* Computed Live Telemetry Readouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">ECU Injector Pulse Width</span>
            <p className="text-lg font-bold text-amber-300 font-mono tabular-nums">{pulseWidthMs.toFixed(2)} ms</p>
            <span className="text-[10px] text-slate-500">Unchanged OEM timing</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Liquid Dosing Pump Rate</span>
            <p className="text-lg font-bold text-emerald-400 font-mono tabular-nums">{liquidPumpDosingRateMlMin.toFixed(1)} mL/min</p>
            <span className="text-[10px] text-slate-500">Proportional feedback</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Fuel Rail Differential Pressure</span>
            <p className="text-lg font-bold text-sky-300 font-mono tabular-nums">2.20 bar</p>
            <span className="text-[10px] text-slate-500">Constant delta over MAP</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400">Lambda Closed Loop (λ)</span>
            <p className="text-lg font-bold text-purple-300 font-mono tabular-nums">1.00 ± 0.02</p>
            <span className="text-[10px] text-slate-500">Zero check engine MIL</span>
          </div>
        </div>
      </div>

      {/* 7-Step Precision Retrofit Execution Guide */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Execution Protocol
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-display text-slate-400">7-PHASE MECHANICAL & ELECTRICAL CONVERSION</span>
        </div>

        <div className="space-y-4">
          {[
            {
              phase: 'Phase 1: Safe Venting & High-Pressure Decommissioning',
              icon: ShieldAlert,
              color: 'text-amber-400',
              detail: 'Isolate the mechanical service valve at the cylinder neck. Run engine until remaining line pressure drops below 0.5 bar, extinguishing the engine. Connect an inert dry Nitrogen (N2) flushing rig and purge the high-pressure SS316 line at 3.0 bar for 180 seconds to displace all residual combustible gas.',
            },
            {
              phase: 'Phase 2: Removal of CNG Cylinders & Chassis Cradle De-stressing',
              icon: Layers,
              color: 'text-sky-400',
              detail: 'Unbolt the four M12 cradle bolts securing the dual tanks. Disconnect the Swagelok twin-ferrule bulkhead fitting. Remove the 78 kg composite cylinder assembly from the vehicle trunk/underbody, freeing 90 liters of cargo volume.',
            },
            {
              phase: 'Phase 3: Installing the Atmospheric Liquid Storage Tank',
              icon: CheckCircle2,
              color: 'text-emerald-400',
              detail: 'Mount a rotational-molded high-density polyethylene (HDPE) or Al-5052 fuel reservoir in the freed space. Install a brushless 12V DC diaphragm micro-dosing pump (operating at 0.5–3.5 bar, 0–250 mL/min flow capacity). Fill with aqueous potassium formate solution (HCOOK + H2O) or perhydro-dibenzyltoluene (LOHC).',
            },
            {
              phase: 'Phase 4: Integrating the Catalytic Micro-Reformer Unit',
              icon: Cpu,
              color: 'text-purple-400',
              detail: 'Position the compact micro-reformer (measuring 280 x 140 x 110 mm) near the engine firewall. Plumb the vehicle engine coolant lines (85°C–90°C) into the reformer jacket to supply the necessary reaction heat. Inside the reformer, a ruthenium/carbon (Ru/C) catalytic bed instantly splits the liquid formate into clean H2/CO2 reformate gas at a stoichiometric 2.2 bar.',
            },
            {
              phase: 'Phase 5: Interfacing with the Existing Low-Pressure Fuel Filter',
              icon: ArrowRight,
              color: 'text-amber-300',
              detail: 'Route the reformer gas exit tube through a water-separation coalescing filter (upgraded with hydrophobic PTFE membrane) and connect directly to the existing 12mm hose barb of the original CNG low-pressure filter. The gas enters the fuel filter at 2.2 bar, matching the exact pressure previously delivered by the mechanical pressure regulator!',
            },
            {
              phase: 'Phase 6: Retaining 100% of ECU Wiring & Injector Rail Logic',
              icon: Zap,
              color: 'text-emerald-300',
              detail: 'Keep the 56-pin automotive connector plugged into the CNG ECU. Connect the 12V high-side shut-off solenoid wire (ECU Pin 14) to the micro-reformer safety relay, enabling the ECU to instantly shut off fuel generation within 20ms of key-off or airbag deployment. Connect the stock fuel pressure gauge sensor (0.5V–4.5V) to the reformer buffer tank, preserving all stock dashboard instrument cluster readouts.',
            },
            {
              phase: 'Phase 7: Pre-Ignition Pressure Proofing & First Start Validation',
              icon: CheckCircle2,
              color: 'text-sky-300',
              detail: 'Power up the auxiliary ignition circuit. The dosing pump primes the reformer core. Within 8 seconds, buffer pressure stabilizes at 2.2 bar. Crank engine: OEM ECU fires injectors in 1-3-4-2 sequence with exact stock pulse widths. The engine idles smoothly at 800 RPM with lambda λ = 1.00 and zero check-engine trouble codes (DTCs).',
            },
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                className="p-5 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-start gap-4"
              >
                <div className={`p-2.5 rounded-lg bg-slate-950 border border-slate-800 ${item.color} shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-slate-100 font-display">
                    {item.phase}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
