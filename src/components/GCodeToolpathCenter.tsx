import React, { useState } from 'react';
import { 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Wrench, 
  Sliders, 
  Layers, 
  Play, 
  ShieldCheck 
} from 'lucide-react';

export const GCodeToolpathCenter: React.FC = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');

  const GCODE_TEXT = `( ============================================================================== )
( PROGRAM: MANIFOLD_SPACER_TOOLPATH_REVISION_3                                   )
( MATERIAL: T6 ALUMINUM / WOOTZ METALLURGY MATRIX                                )
( TOOL 01: 6MM DIAMETER FLAT ENDMILL - CARBIDE COATED                            )
( POST-PROCESSOR: FANUC / ISO STANDARD COMPLIANT G-CODE                          )
( ============================================================================== )

G90 G21 G17 G40 G49 G80 ( Absolute coordinates, Metric units, XY plane selection )
G28 G91 Z0.0           ( Return home safely along the vertical axis )
M06 T01                ( Load specified 6mm cutting tool into spindle )
M03 S5500 M08          ( Activate spindle clockwise at 5500 RPM, flood coolant ON )

( PHASE 1: EXECUTE EXTERNAL BOUNDARY PROFILE CUTS )
G00 G90 X20.000 Y20.000 Z5.000 ( Rapid traverse to coordinate safety boundary position )
G01 Z-2.500 F850               ( Feed plunge deep into material surface block )
G01 X180.000 Y20.000 F1200     ( Linear pass cutting the front profile face )
G01 X180.000 Y120.000          ( Move upward to trim the right-hand manifold side )
G02 X160.000 Y140.000 R20.000  ( Circular interpolation cutting a clean corner radius )
G01 X40.000 Y140.000           ( Linear clearing pass along the back boundary wall )
G02 X20.000 Y120.000 R20.000   ( Circular blend to complete corner profile arc )
G01 Y20.000                    ( Final trace pass to secure clean outer layout dimensions )

( PHASE 2: MILLING INNER ATOMIZATION CYLINDER PORTS )
G00 Z5.000                     ( Retract cutting tool back to absolute clearance height )
G00 X50.000 Y70.000            ( Rapid motion to primary injector cell center coordinate )
G01 Z-5.000 F600               ( Enter depth profile matrix for primary engine bore )
G03 X50.000 Y70.000 I15.000 J0.000 F950 ( Counter-clockwise circular helical sweep pocketing )

G00 Z5.000                     ( Retract cutting tool back to absolute clearance height )
G00 X130.000 Y70.000           ( Rapid motion to secondary injector cell center coordinate )
G01 Z-5.000 F600               ( Enter depth profile matrix for secondary engine bore )
G03 X130.000 Y70.000 I15.000 J0.000 F950 ( Counter-clockwise circular helical sweep pocketing )

( PHASE 3: PROGRAM EXIT MATRIX )
G00 Z15.000 M09                ( Retract tool completely, disable flood coolant stream )
G28 G91 Z0.0                   ( Machine safe parking orientation along vertical limits )
M05                            ( Deactivate machine tool spindle rotation completely )
M30                            ( End of toolpath routing program cycle execution )`;

  const copyGcode = () => {
    navigator.clipboard.writeText(GCODE_TEXT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadGcodeFile = () => {
    const blob = new Blob([GCODE_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MANIFOLD_SPACER_TOOLPATH_REV3.nc';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-amber-900/30 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#C35237] font-display">
          <Terminal className="w-4 h-4 text-[#C35237]" />
          <span>सीएनसी जी-कोड टूलपाथ संकलन · MODULE 3: PRODUCTION G-CODE CENTER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
          Pre-Compiled CNC G-Code Sequences (Rev 3)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Production-ready G-code toolpaths optimized for programming a CNC milling center to cut a custom modular manifold spacer block out of a raw T6 Aluminum / Wootz metallurgy slab.
        </p>
      </div>

      {/* Machining Parameters Bento Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#12141c] rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Material Specification</span>
          <p className="text-sm font-bold text-slate-100 font-mono">T6 Al / Wootz Matrix</p>
          <span className="text-[10px] text-slate-500">ISO 2768-mK tolerance</span>
        </div>

        <div className="p-4 bg-[#12141c] rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Cutting Tool (T01)</span>
          <p className="text-sm font-bold text-[#00E5FF] font-mono">Ø6.0mm Flat Endmill</p>
          <span className="text-[10px] text-slate-500">Carbide TiAlN coated</span>
        </div>

        <div className="p-4 bg-[#12141c] rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Spindle Speed</span>
          <p className="text-sm font-bold text-[#C35237] font-mono">5,500 RPM (M03)</p>
          <span className="text-[10px] text-slate-500">Flood coolant ON (M08)</span>
        </div>

        <div className="p-4 bg-[#12141c] rounded-xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400">Contour Feed Rate</span>
          <p className="text-sm font-bold text-amber-300 font-mono">1,200 mm/min</p>
          <span className="text-[10px] text-slate-500">Helical plunge: 600 mm/min</span>
        </div>
      </div>

      {/* Main G-Code Viewer */}
      <div className="bg-[#0A0C12] rounded-2xl border-2 border-slate-800 overflow-hidden shadow-2xl space-y-0">
        <div className="flex items-center justify-between px-6 py-4 bg-[#10131e] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono font-bold text-slate-200">
              MANIFOLD_SPACER_TOOLPATH_REVISION_3.NC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyGcode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy G-Code'}</span>
            </button>

            <button
              onClick={downloadGcodeFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.NC)</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-x-auto max-h-[520px]">
          <pre className="text-xs font-mono text-[#00E5FF] leading-relaxed">
            {GCODE_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
};
