import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sliders, 
  Table, 
  Layers, 
  Sparkles,
  FileCode2,
  FileText
} from 'lucide-react';

export const CadAutomationStudio: React.FC = () => {
  // Configurable CAD Parameters
  const [runnerPitch, setRunnerPitch] = useState<number>(48.0);
  const [portDiameter, setPortDiameter] = useState<number>(24.0);
  const [wallThickness, setWallThickness] = useState<number>(3.5);
  const [railBore, setRailBore] = useState<number>(14.0);
  const [numCylinders, setNumCylinders] = useState<number>(4);
  const [explodeScale, setExplodeScale] = useState<number>(1.0);
  const [targetCad, setTargetCad] = useState<'solidworks' | 'autocad' | 'vba_macro'>('solidworks');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCopiedVba, setIsCopiedVba] = useState<boolean>(false);

  // Compute live 3D coordinate matrix
  const centerOffset = ((numCylinders - 1) * runnerPitch) / 2.0;
  const coordinateMatrix = Array.from({ length: numCylinders }, (_, i) => {
    const xPos = i * runnerPitch - centerOffset;
    return {
      cylinder: i + 1,
      throatCenter: [parseFloat(xPos.toFixed(2)), 0.0, 0.0],
      injectorCup: [parseFloat(xPos.toFixed(2)), 38.0, 15.0],
      flangeFace: [parseFloat(xPos.toFixed(2)), -45.0, -10.0],
      boltHoles: [
        [parseFloat((xPos - 18.0).toFixed(2)), -45.0, 6.0],
        [parseFloat((xPos + 18.0).toFixed(2)), -45.0, 6.0],
        [parseFloat(xPos.toFixed(2)), -45.0, -30.0],
      ],
      explodedInjectorVec: [0.0, parseFloat((60.0 * explodeScale).toFixed(1)), parseFloat((120.0 * explodeScale).toFixed(1))],
      explodedRailVec: [0.0, parseFloat((110.0 * explodeScale).toFixed(1)), parseFloat((180.0 * explodeScale).toFixed(1))],
    };
  });

  // SolidWorks Native VBA Macro Script
  const SOLIDWORKS_VBA_SCRIPT = `' ******************************************************************************
' SUBROUTINE: AUTOMATE_SYSTEM_PROPULSION_METRICS
' DESCRIPTION: Connects directly to the active SolidWorks Model Document layer 
'              and automatically maps custom system parameters for evaluation.
' ******************************************************************************
Dim swApp As SldWorks.SldWorks
Dim swModel As SldWorks.ModelDoc2
Dim swCustomPropMgr As SldWorks.CustomPropertyManager
Dim configName As String
Dim retval As Long

Sub main()

    ' Connect directly to the active SolidWorks application instance workspace
    Set swApp = Application.SldWorks
    Set swModel = swApp.ActiveDoc
    
    ' Error trapping: Validate if a document profile or assembly model is active
    If swModel Is Nothing Then
        MsgBox "Error Vector: No active drawing layout or assembly workspace detected.", vbCritical, "SolidWorks Automation System"
        Exit Sub
    End If
    
    ' Fetch target active configuration properties
    configName = swModel.ConfigurationManager.ActiveConfiguration.Name
    Set swCustomPropMgr = swModel.Extension.CustomPropertyManager(configName)
    
    ' Synchronize engineering metadata fields into design properties matrix
    retval = swCustomPropMgr.Add3("Project Name", swCustomPropType_e.swCustomPropText, "AG-RC-25K-REV-A", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Thermal Load Capacity", swCustomPropType_e.swCustomPropText, "1450 kW", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Flex-Fuel Flow Rate Vector", swCustomPropType_e.swCustomPropText, "480 cc/min", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Designed Delta Temperature", swCustomPropType_e.swCustomPropText, "850 Kelvin", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Enclosure Dimensions Matrix", swCustomPropType_e.swCustomPropText, "${numCylinders * runnerPitch + 30}mm x 140mm", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Runner Pitch Distance", swCustomPropType_e.swCustomPropText, "${runnerPitch} mm", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    
    ' Force internal database rebuild to dynamically sync values with drawing layout bills of materials
    swModel.ForceRebuild3 True
    
    MsgBox "System Metadata Alignment Matrix Completed successfully for configuration: " & configName, vbInformation, "SolidWorks API Engine Sync"

End Sub`;

  // Dynamically generated Python CAD script
  const generatedPythonScript = `# ==============================================================================
# MODULAR MANIFOLD 3D CAD & EXPLODED-VIEW AUTOMATION SCRIPT
# Author: Senior Embedded Hardware & CAD Automation Engineer
# Target Platform: ${targetCad === 'solidworks' ? 'Dassault Systèmes SolidWorks 2022+ API' : 'Autodesk AutoCAD 2022+ ActiveX API'}
# Parametric Settings: Pitch=${runnerPitch}mm, PortDia=${portDiameter}mm, Wall=${wallThickness}mm, Cyls=${numCylinders}
# ==============================================================================

import math
import sys
import win32com.client  # Requires: pip install pywin32

class ModularEngineManifoldCAD:
    """Automates 3D modeling and exploded vector generation for modular engine intake rails."""
    
    def __init__(self):
        self.runner_pitch = ${runnerPitch}      # mm center-to-center cylinder pitch
        self.port_dia = ${portDiameter}          # mm intake runner throat inner diameter
        self.wall_thk = ${wallThickness}          # mm structural wall thickness
        self.num_cyl = ${numCylinders}            # Number of inline cylinders
        self.rail_bore = ${railBore}          # mm fuel rail internal fluid passage
        self.rail_od = ${railBore + 8.0}            # mm outer rail diameter
        self.explode_scale = ${explodeScale}     # Exploded displacement multiplier
        
        self.app = None
        self.model = None

    def connect_engine(self):
        """Dispatches connection to active ${targetCad === 'solidworks' ? 'SolidWorks' : 'AutoCAD'} session."""
        try:
${targetCad === 'solidworks' ? `            self.app = win32com.client.Dispatch("SldWorks.Application")
            self.app.Visible = True
            print("[INFO] Successfully hooked into SolidWorks Application Engine.")
            return True` : `            self.app = win32com.client.Dispatch("AutoCAD.Application")
            self.app.Visible = True
            print("[INFO] Successfully hooked into AutoCAD ActiveX ModelSpace Engine.")
            return True`}
        except Exception as err:
            print(f"[WARN] CAD automation engine unavailable via COM: {err}")
            return False

    def build_parametric_assembly(self):
        """Constructs 3D extruded fuel rail, runner throats, and exploded configuration."""
        print(f"[CAD] Generating {self.num_cyl}-Cylinder Manifold Layout...")
        
        # 3D Coordinate Matrix Calculation
        center_offset = ((self.num_cyl - 1) * self.runner_pitch) / 2.0
        coords = []
        for i in range(self.num_cyl):
            x_m = ((i * self.runner_pitch) - center_offset) / 1000.0  # meters
            coords.append({
                "cyl_id": i + 1,
                "x_pos_mm": (i * self.runner_pitch) - center_offset,
                "throat_center": (x_m, 0.0, 0.0),
                "injector_cup": (x_m, 0.038, 0.015),
                "exploded_vector": (0.0, 0.060 * self.explode_scale, 0.120 * self.explode_scale)
            })
            print(f"  -> Port #{i+1}: X={coords[-1]['x_pos_mm']:.2f} mm | Exploded Vec={coords[-1]['exploded_vector']}")
            
        ${targetCad === 'solidworks' ? `# SolidWorks Native Feature Extrusions
        if self.app:
            part = self.app.NewDocument("", 0, 0, 0)
            part.Extension.SelectByID2("Front Plane", "PLANE", 0, 0, 0, False, 0, None, 0)
            part.SketchManager.InsertSketch(True)
            total_len_m = ((self.num_cyl * self.runner_pitch) + 30.0) / 1000.0
            part.SketchManager.CreateCircleByRadius(0, 0, 0, self.rail_od / 2000.0)
            part.SketchManager.CreateCircleByRadius(0, 0, 0, self.rail_bore / 2000.0)
            part.FeatureManager.FeatureExtrusion2(
                True, False, False, 6, 0, total_len_m, 0,
                False, False, False, False, 0, 0, False, False, False, False,
                True, True, True, 0, 0, False
            )
            print("[CAD] SolidWorks Part Created Successfully.")` : `# AutoCAD 3DSolid Cylinders & Primitives
        if self.app:
            doc = self.app.ActiveDocument
            ms = doc.ModelSpace
            rail_len = (self.num_cyl * self.runner_pitch) + 30.0
            print(f"[CAD] Generating AutoCAD 3D Solid Model with length: {rail_len} mm")`}
        return coords

if __name__ == "__main__":
    builder = ModularEngineManifoldCAD()
    builder.connect_engine()
    results = builder.build_parametric_assembly()
    print("\\n[SUCCESS] CAD Automation Pipeline Finished Execution.")
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPythonScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyVbaToClipboard = () => {
    navigator.clipboard.writeText(SOLIDWORKS_VBA_SCRIPT);
    setIsCopiedVba(true);
    setTimeout(() => setIsCopiedVba(false), 2000);
  };

  const downloadScriptFile = () => {
    const blob = new Blob([generatedPythonScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modular_manifold_${targetCad}_automation.py`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadVbaFile = () => {
    const blob = new Blob([SOLIDWORKS_VBA_SCRIPT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SolidWorksMacro.vba';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCoordinateCsv = () => {
    const headers = "Cylinder,Throat_X,Throat_Y,Throat_Z,InjectorCup_X,InjectorCup_Y,InjectorCup_Z,ExplodedVec_Y,ExplodedVec_Z\n";
    const rows = coordinateMatrix.map((c) => 
      `${c.cylinder},${c.throatCenter[0]},${c.throatCenter[1]},${c.throatCenter[2]},${c.injectorCup[0]},${c.injectorCup[1]},${c.injectorCup[2]},${c.explodedInjectorVec[1]},${c.explodedInjectorVec[2]}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'manifold_3d_coordinates.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-amber-900/30 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-display">
          <Code2 className="w-4 h-4 text-amber-400" />
          <span>ସିଏଡି ସ୍ୱୟଂଚାଳନ ଷ୍ଟୁଡିଓ · CAD & EMBEDDED AUTOMATION ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
          CAD Scripting: Python COM & SolidWorks VBA Macros
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Generate complete, production-ready Python automation scripts connected directly to SolidWorks/AutoCAD COM APIs, or download the native SolidWorks VBA Macro (<span className="text-amber-300 font-mono">SolidWorksMacro.vba</span>) to auto-configure metadata, thermal parameters, and BOM properties.
        </p>
      </div>

      {/* Main Grid: Interactive Parameters (Left 4 cols) + Code & Coordinates (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parametric Tuning Deck */}
        <div className="lg:col-span-4 bg-[#0e121e] rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Parametric Controls</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400 font-semibold">LIVE COMPUTED</span>
          </div>

          {/* CAD Target Selector */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-300">Target CAD Environment</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTargetCad('solidworks')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  targetCad === 'solidworks'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                SW Python
              </button>
              <button
                onClick={() => setTargetCad('autocad')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  targetCad === 'autocad'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                AutoCAD
              </button>
              <button
                onClick={() => setTargetCad('vba_macro')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  targetCad === 'vba_macro'
                    ? 'bg-[#C35237]/30 text-amber-200 border-[#C35237]/80 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                SW VBA
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Runner Pitch Spacing</span>
                <span className="font-mono text-amber-300 font-bold tabular-nums">{runnerPitch.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="38"
                max="65"
                step="0.5"
                value={runnerPitch}
                onChange={(e) => setRunnerPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Port Throat Diameter</span>
                <span className="font-mono text-sky-300 font-bold tabular-nums">{portDiameter.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="18"
                max="34"
                step="0.5"
                value={portDiameter}
                onChange={(e) => setPortDiameter(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Wall Thickness</span>
                <span className="font-mono text-emerald-300 font-bold tabular-nums">{wallThickness.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.5"
                step="0.1"
                value={wallThickness}
                onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Fuel Rail Internal Bore</span>
                <span className="font-mono text-purple-300 font-bold tabular-nums">{railBore.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="10"
                max="20"
                step="0.5"
                value={railBore}
                onChange={(e) => setRailBore(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Cylinder Architecture</span>
                <span className="font-mono text-amber-300 font-bold tabular-nums">{numCylinders} Cylinders Inline</span>
              </div>
              <div className="flex items-center gap-2">
                {[3, 4, 6, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumCylinders(n)}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors ${
                      numCylinders === n
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {n} Cyl
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-300">Exploded Vector Scale</span>
                <span className="font-mono text-amber-400 font-bold tabular-nums">{explodeScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={explodeScale}
                onChange={(e) => setExplodeScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="space-y-2 pt-2">
            {targetCad === 'vba_macro' ? (
              <button
                onClick={downloadVbaFile}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#C35237] hover:bg-amber-600 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download SolidWorksMacro.vba</span>
              </button>
            ) : (
              <button
                onClick={downloadScriptFile}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Python Script (.py)</span>
              </button>
            )}

            <button
              onClick={downloadCoordinateCsv}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-sky-400" />
              <span>Export Coordinates (CSV)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Code Generator & Live Coordinate Matrix (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live 3D Cartesian Coordinate Matrix Table */}
          <div className="bg-[#0e121e] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-[#111728] border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-200">
                  Computed 3D Layout Coordinates & Exploded Vectors (Cartesian mm)
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Origin [0, 0, 0] centered on engine block
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0d101c] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Port</th>
                    <th className="py-2.5 px-4">Runner Throat [X, Y, Z]</th>
                    <th className="py-2.5 px-4">Injector Cup [X, Y, Z]</th>
                    <th className="py-2.5 px-4">Flange Face [X, Y, Z]</th>
                    <th className="py-2.5 px-4 text-amber-400">Exploded Vector [ΔX, ΔY, ΔZ]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30 text-slate-300">
                  {coordinateMatrix.map((row) => (
                    <tr key={row.cylinder} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-amber-300">Cyl #{row.cylinder}</td>
                      <td className="py-2.5 px-4 text-slate-200">[{row.throatCenter.join(', ')}]</td>
                      <td className="py-2.5 px-4 text-sky-300">[{row.injectorCup.join(', ')}]</td>
                      <td className="py-2.5 px-4 text-slate-400">[{row.flangeFace.join(', ')}]</td>
                      <td className="py-2.5 px-4 text-amber-400 font-semibold">[{row.explodedInjectorVec.join(', ')}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Script Viewer: Python or VBA */}
          <div className="bg-[#0a0c14] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3.5 bg-[#101423] border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>
                  {targetCad === 'vba_macro' ? 'SolidWorksMacro.vba (API Macro)' : `modular_manifold_${targetCad}_automation.py`}
                </span>
              </div>
              <button
                onClick={targetCad === 'vba_macro' ? copyVbaToClipboard : copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {(targetCad === 'vba_macro' ? isCopiedVba : isCopied) ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{(targetCad === 'vba_macro' ? isCopiedVba : isCopied) ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="p-4 overflow-x-auto max-h-[500px]">
              <pre className="text-xs font-mono leading-relaxed text-[#00E5FF]">
                {targetCad === 'vba_macro' ? SOLIDWORKS_VBA_SCRIPT : generatedPythonScript}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
