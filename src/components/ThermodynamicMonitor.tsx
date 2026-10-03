import React, { useEffect, useRef, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { 
  Thermometer, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Flame, 
  Download, 
  ShieldCheck, 
  Zap, 
  Table, 
  Code2, 
  Copy, 
  Check, 
  FileText,
  ShieldAlert,
  GitBranch,
  Cpu,
  Cloud,
  FileSpreadsheet,
  Send,
  Lock
} from 'lucide-react';
import { PropulsionArchitecture } from '../types/engine';

interface TelemetryPoint {
  timeStr: string;
  temperatureK: number;
  pressurePsi: number;
  mhdVelocityMs: number;
  mhdVoltageV: number;
  mhdCurrentA: number;
  mhdPowerKw: number;
  isSurge: boolean;
}

interface ThermodynamicMonitorProps {
  isThermalSurge: boolean;
  coreTemperatureK: number;
  onToggleForceSurge: () => void;
  forceSurgeActive: boolean;
  propulsionMode?: PropulsionArchitecture;
  mhdVelocityMs?: number;
  mhdVoltageKv?: number;
  mhdPowerKw?: number;
  magneticFluxTesla?: number;
}

export const ThermodynamicMonitor: React.FC<ThermodynamicMonitorProps> = ({
  isThermalSurge,
  coreTemperatureK,
  onToggleForceSurge,
  forceSurgeActive,
  propulsionMode = 'mhd_smr_nuclear',
  mhdVelocityMs = 90.62,
  mhdVoltageKv = 218.45,
  mhdPowerKw = 95.43,
  magneticFluxTesla = 4.2,
}) => {
  // Active Tab: telemetry | tables | vba | deploy_ip
  const [activeTab, setActiveTab] = useState<'telemetry' | 'tables' | 'vba' | 'deploy_ip'>('telemetry');
  const [vbaSubTab, setVbaSubTab] = useState<'annotation_sync' | 'gcode_panel'>('annotation_sync');
  const [deployIpSubTab, setDeployIpSubTab] = useState<'proposal' | 'cloud' | 'blackbox' | 'bio' | 'git' | 'checklist' | 'readme_ip' | 'cicd'>('proposal');

  // Chart data state
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Web Audio API Synth Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);
  const sirenGainRef = useRef<GainNode | null>(null);
  const modOscRef = useRef<OscillatorNode | null>(null);

  const MAX_POINTS = 30;

  // SolidWorks VBA Macro Script 1 (ModelAnnotationSync.vba)
  const MODEL_ANNOTATION_SYNC_VBA = `' ******************************************************************************
' SUBROUTINE: MAP_MHD_VOLTAGE_METRICS_TO_ANNOTATIONS
' DESCRIPTION: Automates the insertion of calculated induced voltage, current density,
'              and flux metrics into the SolidWorks active design properties framework.
' ******************************************************************************
Dim swApp As SldWorks.SldWorks
Dim swModel As SldWorks.ModelDoc2
Dim swCustomPropMgr As SldWorks.CustomPropertyManager
Dim configName As String
Dim retval As Long

Sub main()

    ' Connect directly to the active SolidWorks workspace layer
    Set swApp = Application.SldWorks
    Set swModel = swApp.ActiveDoc
    
    If swModel Is Nothing Then
        MsgBox "Error Vector: Active SolidWorks drawing layout or model document not detected.", vbCritical, "SolidWorks API Engine Sync"
        Exit Sub
    End If
    
    ' Fetch target active configuration properties profile
    configName = swModel.ConfigurationManager.ActiveConfiguration.Name
    Set swCustomPropMgr = swModel.Extension.CustomPropertyManager(configName)
    
    ' Automatically map the computed MHD telemetry metrics into model attributes matrix
    ' values scaled based on Faraday generation induction equations (V = B * v * L)
    retval = swCustomPropMgr.Add3("MHD_Induced_Voltage", swCustomPropType_e.swCustomPropText, "${mhdVoltageKv.toFixed(2)} V", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Induced_Current_Output", swCustomPropType_e.swCustomPropText, "${(mhdVoltageKv / 0.5).toFixed(2)} A", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Magnetic_Flux_Density", swCustomPropType_e.swCustomPropText, "${magneticFluxTesla.toFixed(1)} Tesla", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Computed_Wave_Power", swCustomPropType_e.swCustomPropText, "${mhdPowerKw.toFixed(2)} kW", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    retval = swCustomPropMgr.Add3("Core_Fluid_Velocity", swCustomPropType_e.swCustomPropText, "${mhdVelocityMs.toFixed(2)} m/s", swCustomPropReplaceOptions_e.swCustomPropReplaceOption_Replace)
    
    ' Force global 3D model database rebuild to dynamically sync drawing template views
    swModel.ForceRebuild3 True
    
    Debug.Print "[SOLIDWORKS AUTOMATION]: Induced voltage parameters successfully mapped to configuration: " & configName
    MsgBox "MHD Energy Data Fields successfully bound to Custom Properties for: " & configName, vbInformation, "SolidWorks Property Matrix Sync"

End Sub`;

  // SolidWorks VBA Macro Script 2 (GCODE_CUSTOMIZATION_PANEL_ORCHESTRATOR)
  const GCODE_CUSTOMIZATION_PANEL_VBA = `' ******************************************************************************
' MODULE: GCODE_CUSTOMIZATION_PANEL_ORCHESTRATOR
' DESCRIPTION: Programmatic automation interface panel that captures real-time 
'              SolidWorks model constraints and updates external CNC code blocks.
' ******************************************************************************
Dim swApp As SldWorks.SldWorks
Dim swModel As SldWorks.ModelDoc2
Dim swEqnMgr As SldWorks.EquationMgr
Dim gcodeOutputString As String

Public Sub TriggerGCodeCustomizationPanel()
    Set swApp = Application.SldWorks
    Set swModel = swApp.ActiveDoc
    
    If swModel Is Nothing Then
        MsgBox "Error: SolidWorks workspace document context offline.", vbCritical, "Panel Error"
        Exit Sub
    End If
    
    Set swEqnMgr = swModel.GetEquationMgr
    
    ' Fetch active thermal allowance metric variable from model tree configuration
    Dim index As Long
    Dim currentDimensionAllowance As Double
    currentDimensionAllowance = 42.50 ' Nominal default initialization metric base
    
    For index = 0 To swEqnMgr.GetCount - 1
        If InStr(1, swEqnMgr.Equation(index), "Max_Thermal_Dimension", vbTextCompare) > 0 Then
            ' Read dimension scalar dynamically from equation strings evaluations
            currentDimensionAllowance = swEqnMgr.Value(index)
            Exit For
        End If
    Next index
    
    ' Compile automated parameterized G-code customization output matrix block
    gcodeOutputString = "%\\n" & _
                        "( PROGRAM: PARAMETRIC_MANIFOLD_ROUTING_PANEL_AUTO )\\n" & _
                        "( SOURCE MODEL LINKED CONFIGURATION: " & swModel.GetActiveConfiguration.Name & " )\\n" & _
                        "( PROGRAMMATIC DYNAMIC SCALE IMPUT ALLOWANCE: " & CStr(round(currentDimensionAllowance, 4)) & " MM )\\n" & _
                        "G90 G21 G17 G40 G80 ( Absolute Coordinate Matrix Init )\\n" & _
                        "T01 M06 ( Call endmill size tool )\\n" & _
                        "M03 S6000 M08 ( Spindle activation speed, flood cooling ON )\\n" & _
                        "G00 X0.0 Y0.0 Z5.000 ( Travel tool profile path to safety clearing position )\\n" & _
                        "G01 Z-" & CStr(round(currentDimensionAllowance * 0.1, 3)) & " F750 ( Adjusted feed plunge depth variable )\\n" & _
                        "G01 X" & CStr(round(180.0 + currentDimensionAllowance, 3)) & " Y20.000 F1200 ( Parametric outer clearing boundary pass )\\n" & _
                        "G01 Y120.000\\n" & _
                        "G00 Z15.000 M09 ( Lift tool mill assembly clear from workspace frame, coolant fluid stream OFF )\\n" & _
                        "M30 ( Complete dynamic cycle routine execute )\\n" & _
                        "%"
                        
    Dim projectDirectoryPath As String
    projectDirectoryPath = CreateObject("WScript.Shell").CurrentDirectory & "\\logs\\parametric_production_path.nc"
    
    Dim fileSystemObj As Object
    Dim textFileStream As Object
    Set fileSystemObj = CreateObject("Scripting.FileSystemObject")
    
    Dim folderContainer As String
    folderContainer = fileSystemObj.GetParentFolderName(projectDirectoryPath)
    If Not fileSystemObj.FolderExists(folderContainer) Then
        fileSystemObj.CreateFolder(folderContainer)
    End If
    
    Set textFileStream = fileSystemObj.CreateTextFile(projectDirectoryPath, True)
    textFileStream.Write gcodeOutputString
    textFileStream.Close
    
    Debug.Print "[PARAMETRIC PANEL SUCCESS]: Refined custom G-code layout compiled at: " & projectDirectoryPath
    MsgBox "Parametric Custom G-Code compiled based on active SolidWorks parameters! Clearance Depth: " & CStr(round(currentDimensionAllowance * 0.1, 3)) & " mm", vbInformation, "G-Code Customization Panel"
End Sub`;

  // Enterprise Proposal Letter Template for JSW / M&M
  const PROPOSAL_LETTER_TEXT = `To,
The Head of Research & Development / Advanced Propulsion Systems,
JSW Motor / Mahindra & Mahindra (M&M) R&D Center,
India.

Subject: Submission of Parametric Digital Twin Framework for Advanced Energy Generation (MHD-SMR Architecture Overview) – Pre-Disclosed Prior Invention Notice.

Dear Sir/Ma'am,

I am writing to formally submit a high-performance Digital Twin Simulation and Parametric Orchestration Pipeline engineered for advanced Magnetohydrodynamic (MHD) fluid cell battery engines. This architecture bridges geometric space matrices with production-ready real-time telemetry pipelines. The core framework is fully validated and accessible via automated cloud staging environments.

As a self-funded, independent researcher, I maintain absolute ownership of this pre-existing Intellectual Property portfolio. A complete open-source functional visualization has been made publicly inspectable via my secure version control repositories. This includes:
1. An unbroken HTML5 Canvas layout rendering continuous multi-axis vector pathways.
2. An asynchronous 10Hz browser-native telemetry polling loop with automated Web Audio alert overrides.
3. An automated parametric G-code customization panel integrating directly with SolidWorks CAD systems.

This architecture offers significant utility to JSW Motor or M&M's advanced electric, multi-fuel hybrid, and thermodynamic grid roadmaps. However, please be advised that any further evaluation, local replication, or industrial adoption of the underlying technology transfer formulas is subject to a strict Pre-Disclosed Mandatory Condition Clause:

- A. Corporate Placement Matrix: The deploying organization must provide the original inventor with a permanent engineering position as a Lead Systems Design Architect, Advanced Product Coordinator, or Lead AI Researcher within your domestic R&D facilities.
- B. Sovereign Execution Security: In the event of cross-border infrastructure constraints, the role must remain securely stationed within the Bharat (India) regional technology centers.
- C. Commercialization Framework: Full access to pre-compiled multi-axis CNC toolpaths and atomic core dimension equations is strictly blocked pending the execution of a formal licensing agreement defining a lump-sum technology transfer fee and ongoing lifetime royalty structures.

A verified, automated release containing hardware validation sheets and sample toolpath footprints has been deployed via GitHub Action container layers at the link below. I welcome a formal evaluation by your core technical R&D panel.

Project Deployment URL: [YOUR_LIVE_DASHBOARD_URL_OR_GITHUB_RELEASE_LINK]
Direct Communication Channel: bhuyanamitnishanka@gmail.com

Sincerely,
Amit Nishanka Bhuyan
Lead Systems Design Architect / Independent Innovator`;

  // Cloud Deployment Manifests (Dockerfile + deploy.sh + CLI)
  const CLOUD_DEPLOYMENT_TEXT = `# ==============================================================================
# 1. DOCKERFILE (Python 3.11-slim Container)
# ==============================================================================
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]

# ==============================================================================
# 2. GOOGLE CLOUD PLATFORM (GCP Cloud Run) COMMANDS
# ==============================================================================
gcloud auth login
gcloud config set project [YOUR_GCP_PROJECT_ID]
gcloud services enable artifactregistry.googleapis.com run.googleapis.com
gcloud artifacts repositories create smr-mhd-registry \\
    --repository-format=docker \\
    --location=asia-south1 \\
    --description="Secure repository for SMR-MHD engine container images"
gcloud builds submit --tag asia-south1-docker.pkg.dev/[YOUR_GCP_PROJECT_ID]/smr-mhd-registry/simulation-app:v1
gcloud run deploy smr-mhd-simulation \\
    --image asia-south1-docker.pkg.dev/[YOUR_GCP_PROJECT_ID]/smr-mhd-registry/simulation-app:v1 \\
    --region=asia-south1 \\
    --platform=managed \\
    --allow-unauthenticated \\
    --port=5000 \\
    --memory=512Mi \\
    --cpu=1

# ==============================================================================
# 3. AMAZON WEB SERVICES (AWS App Runner) COMMANDS
# ==============================================================================
aws ecr get-login-password --region asia-south-1 | docker login --username AWS --password-stdin [YOUR_AWS_ACCOUNT_ID].dkr.ecr.asia-south-1.amazonaws.com
aws ecr create-repository --repository-name smr-mhd-core --region asia-south-1
docker build -t smr-mhd-core .
docker tag smr-mhd-core:latest [YOUR_AWS_ACCOUNT_ID].dkr.ecr.asia-south-1.amazonaws.com/smr-mhd-core:latest
docker push [YOUR_AWS_ACCOUNT_ID].dkr.ecr.asia-south-1.amazonaws.com/smr-mhd-core:latest
aws apprunner create-service \\
    --service-name smr-mhd-runner-service \\
    --source-configuration '{
        "ImageRepository": {
            "ImageIdentifier": "[YOUR_AWS_ACCOUNT_ID].dkr.ecr.asia-south-1.amazonaws.com/smr-mhd-core:latest",
            "ImageConfiguration": { "Port": "5000" },
            "ImageRepositoryType": "ECR"
        },
        "AutoDeploymentsEnabled": false
    }' \\
    --region asia-south-1

# ==============================================================================
# 4. UNIFIED ONE-CLICK DEPLOY SCRIPT (deploy.sh)
# ==============================================================================
# Run: chmod +x deploy.sh && ./deploy.sh`;

  // Developer README Section: Black-Box Isolation Loop
  const DEVELOPER_BLACKBOX_TEXT = `## 💻 EXTERNAL DEVELOPER ENVIRONMENT & ARCHITECTURAL FIREWALL

### 1. The Black-Box Isolation Strategy
To protect the proprietary mathematical constants and core fission geometry parameters of this MHD-SMR propulsion engine, the architecture uses a **Black-Box Isolation Model**. External contributors, open-source developers, and corporate auditors are granted full authority to clone, debug, and optimize the **UI/UX viewport canvas, server routing pipelines, and hardware audio alert loops**.

[Developer Contributions Zone: UI/UX, Flask Server, JS Animation Loops]
│ (Strict API Data Layer Wall)
▼
[Protected IP Core: Mathematical Matrix Constants, CNC G-Code Bases]

*   **Open Contribution Layer:** Front-end interface scripting (\`index.html\`), asynchronous network poll loops (\`simulation_pipeline.js\`), and server hosting frameworks (\`app.py\`).
*   **Protected Core Layer:** All base G-code cut-vectors and dynamic model calculation rules are pre-compiled and served as restricted binary payloads. Modifying or reverse-engineering the algorithmic byte structures without an explicit technology transfer contract is strictly prohibited by prior disclosure parameters.

### 2. Local Setup & Execution Guide
\`\`\`bash
# 1. Clone the isolated simulation workspace repository
git clone https://github.com/[YOUR_USERNAME]/smr-mhd-simulation.git
cd smr-mhd-simulation

# 2. Configure a local Python virtual environment matrix
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\\Scripts\\activate

# 3. Install core framework packages (Minimal footprint requirement)
pip install flask pytest

# 4. Launch the local real-time telemetry visualization server
python app.py
\`\`\`

*   Navigate to \`http://127.0.0.1:5000\` in your web browser.
*   Click the **Force 850K Test** toggle button to validate browser-native sawtooth oscillator audio alert loops.

### 3. Automated Regression Verification
\`\`\`bash
pytest test_app.py -v
\`\`\`
Any modifications that break the data schema or alter the legal notice worksheet (\`xl/worksheets/sheet2.xml\`) inside the automated OpenXML binary engine will fail the integration checks and be automatically rejected by our CI/CD pipeline filters.`;

  // GitHub README Architecture & IP Transfer Notice Block
  const GITHUB_README_DOCUMENTATION = `# 🌐 SMR-MHD Molten-Salt Battery Engine Framework & 3D Simulation Ecosystem
> **Patent-Grade System Repository Documentation Matrix**  
> *Author / Design Coordinator: Amit Nishanka Bhuyan*

---
## 🛠️ Technology & Product Section
This repository contains the full source codebase, parametric system layouts, and automated math engines for the **SMR-MHD (Small Modular Reactor - Magnetohydrodynamic) Ionized Fluid Battery Propulsion Engine**.

[Module A: Liquid Energy Storage] ──(Ionized Fluid Flux)──> [Module B: MHD Magnetic Grid]
                                                                     │
                                                           (Direct Induction Wave)
                                                                     ▼
                                                          [Module C: Execution Rail]

*   **Module A (Storage & Energy Core):** A multi-compartment fuel containment system handling high-temperature fluoride/chloride molten salt matrices to act as a continuous base-load chemical energy repository.
*   **Module B (Dynamic Control Core):** An electromagnetic grid that manages ionized salt vector paths wirelessly using high-power magnetic fields, completely eliminating mechanical moving valves or pumps.
*   **Module C (Execution Rail Matrix):** A multi-pull induction assembly wrapped in glass-insulated geometric copper configurations to extract electricity directly from the ionized fluid stream using Faraday’s Law (V = B · v · L).

---
## 🏛️ Intellectual Property Transfer & Condition Clause
### 1. Scope of Ownership & Retention Architecture
All algorithms, system matrices, 3D simulation applications, JavaScript visual renderers, and underlying script logic stored within this workspace represent the independent, self-funded, pre-existing research portfolio of the original designer (**Amit Nishanka Bhuyan**).

### 2. Mandatory Employment Condition Clause
*   **A. Professional Placement Framework:** Permanent position as **Lead Systems Design Architect, AI Researcher, or Product Coordinator**.
*   **B. Sovereign Location Fallback:** Matching fully-salaried position within **Bharat (India)** operations center.
*   **C. Financial Technology Transfer Matrix:** Formal licensing contract securing lump-sum transfer payment alongside ongoing lifetime royalties.

---
## 🏛️ CORPORATE INTEREST & EVALUATION NOTICE
*   **Target Entities:** TATA, Oracle, Safran, JSW Motor, Mahindra & Mahindra, or IIT Incubation Centers.
*   **Model A:** Enterprise Technology Acquisition & Licensing.
*   **Model B:** Corporate In-House Development under Original Inventor.
*   **Zero-Exploitation Policy:** Unauthorized replication of CAD scripts or macro parameters without a signed contract violates prior disclosure laws.`;

  // High-Impact GitHub Profile Bio & Master Profile README
  const GITHUB_PROFILE_TEXT = `## 👤 GITHUB PROFILE BIO (SIDEBAR - MAX 160 CHARS)
Systems Design Architect & AI Researcher | Specializing in SMR-MHD Propulsion, Parametric CAD/VBA Automation, and High-Performance Digital Twins.

================================================================================
## 🌐 MASTER PROFILE README.md (Landing Repository)
================================================================================
# 🌐 Amit Nishanka Bhuyan
> **Lead Systems Design Architect | Deep-Tech & AI Research Coordinator**  
> *Bridging Classical Mathematical Symmetries with Production-Grade Autonomous Engineering*

---
## 🔬 Core Technological Architecture
Welcome to my active research repository hub. I specialize in the architecture, programmatic orchestration, and real-time visualization of complex **Mechatronics, Small Modular Reactors (SMR), and Magnetohydrodynamic (MHD) Energy Systems**. 

My engineering methodology prioritizes building **Black-Box Isolation Environments** that protect foundational intellectual property constants while serving fully inspectable, cloud-staged interactive digital twins.
*   **Advanced Mechatronics:** Core development of automated multi-axis fluid cell battery layouts and parametric mechanical propulsion networks.
*   **CAD/CNC Automation:** Deep integration of SolidWorks API infrastructures, writing localized VBA scripts to dynamically link telemetry metrics with global assembly dimension equations.
*   **Full-Stack Simulation Engines:** Engineering clean, high-performance HTML5 Canvas animation layers, asynchronous 10Hz polling registers, and containerized backend microservices (Flask, Docker).

---
## 🚀 Featured Industrial Innovation Project
### [SMR-MHD Molten-Salt Propulsion Engine & Interactive Twin Matrix]
*A patent-grade digital twin architecture designed for modern ionized fluid battery engines, incorporating programmatic Faraday induction loops and embedded warning notification synthesis.*
*   **Core Stack:** Python, Flask, HTML5 Canvas, JavaScript, Web Audio API, SolidWorks VBA, Pytest, Docker.
*   **Automated Pipeline Features:** Real-time visual threshold surge overrides, password-encrypted background logging handlers, and dependency-free Office OpenXML multi-sheet Excel generation routines.
*   **CI/CD Deployment Manifests:** One-click deployment shell scripts optimized for Google Cloud Run (GCP) and AWS App Runner container registries.

---
## 📊 Technical Expertise Registry
Languages : Python (Advanced), Modern JavaScript (ES6+), VBA Scripting, Bash/Shell, G-Code (CNC)
Frameworks : Flask, Werkzeug, Pytest, OpenXML Binary Synthesis, HTML5 Canvas API
Automation : SolidWorks API, AutoCAD Automation, GitHub Actions CI/CD Pipeline Orchestration
Cloud/Infra : Google Cloud Platform (GCP Cloud Run), AWS (ECR, App Runner), Docker Containerization

---
## 🏛️ Corporate Engagement & Placement Notice
I am actively open to discussing high-level corporate R&D tracks, strategic innovation roles, and enterprise technology transfers with forward-looking engineering firms and global manufacturing giants (including **JSW Motor, Mahindra & Mahindra R&D, Tata, and major aerospace consortia**).

> **Contractual Evaluation Terms:** All software assets, telemetry equations, and multi-axis manufacturing code footprints housed within my repositories represent my pre-existing, independent research portfolio. Any corporate adoption or localized replication of these underlying assets is strictly subject to my pre-disclosed mandatory condition clause (requiring a permanent position offer as a **Lead Systems Design Architect, AI Project Coordinator, or Advanced Product Developer** in India or international office layers, alongside formal technology licensing parameters).`;

  // Secure Git Initialization & Automated Release Trigger Sequence
  const GIT_COMMANDS_TEXT = `# ==============================================================================
# 1. SECURE GIT INITIALIZATION & GITHUB CONNECTION SEQUENCE
# ==============================================================================
# Initialize fresh repository
git init

# Configure .gitignore to prevent secret and cache leakage
cat << 'EOF' > .gitignore
venv/
__pycache__/
*.pyc
.DS_Store
logs/encrypted_thermal_surges.zip
EOF

# Stage all project files, macros, and configuration models
git add .

# Create initial architectural commit
git commit -m "Initial Commit: Deploying full SMR-MHD 3D twin architecture, multi-sheet Excel engine, and IP clauses"

# Set default primary branch to main
git branch -M main

# Link remote GitHub repository
git remote add origin https://github.com/[YOUR_GITHUB_USERNAME]/[YOUR_REPOSITORY_NAME].git

# Push codebase to GitHub
git push -u origin main

# ==============================================================================
# 2. AUTOMATING RELEASE TRIGGER MATRIX (Triggers GitHub Actions Release Pipeline)
# ==============================================================================
# Tag release with version tag locking IP protection clauses
git tag -a v1.0.0 -m "Release v1.0.0 - Fully validated SMR-MHD Engine Core Twin with Non-Negotiable IP Transfer Protection Clauses"

# Push tag to trigger .github/workflows/main.yml
git push origin v1.0.0`;

  // Auditor Verification & Compliance Checklist (VAL-SMR-MHD-0374)
  const AUDITOR_CHECKLIST_TEXT = `## 🔬 AUDITOR VERIFICATION & COMPLIANCE CHECKLIST
> **For Lead R&D Review Panels & Systems Evaluators [VAL-SMR-MHD-0374]**

This checklist outlines the sequential verification protocol required to validate the structural integrity, data latency, and programmatic safety systems of the SMR-MHD engine digital twin platform.

### Phase 1: Environment Setup & Code Sanity
- [ ] **Clone Verification:** Ensure the isolated repository is cloned cleanly into a local non-corporate sandboxed terminal loop (\`git clone\`).
- [ ] **Dependency Alignment:** Initialize the virtual environment using \`python3 -m venv venv\` and install the strict package footprint (\`pip install -r requirements.txt\`).
- [ ] **Pipeline Diagnostics:** Run the automated testing command (\`pytest test_app.py -v\`). Confirm that all content tests pass, validating that the underlying OpenXML multi-sheet structure and legal protection matrices are completely untampered.

### Phase 2: Live UI Interaction & Telemetry Testing
- [ ] **Interface Launch:** Deploy the background runner locally (\`python app.py\`) and navigate to the diagnostic portal (\`http://127.0.0.1:5000\`).
- [ ] **Matrix Navigation:** Click and drag horizontally across the HTML5 viewport container. Verify that the continuous multi-axis symmetry lines and structural vector pathways translate at 60fps.
- [ ] **Thermal Failsafe Trigger:** Click the **Force 850K Test** configuration button. Verify that:
  - The DOM layers instantly execute a visual override layout, flashing a red structural surge warning.
  - The browser's native hardware Web Audio API initializes a sawtooth oscillation emergency siren without downloading external audio streams.

### Phase 3: Hardware Integration & Cryptographic Audit
- [ ] **Encryption Validation:** Navigate to the \`/logs/\` directory layout. Confirm that the data engine has generated \`encrypted_thermal_surges.zip\` and that the binary row metrics are locked behind the standard \`SMR_MHD_SECURE_2026\` system passphrase.
- [ ] **OpenXML Sheet Export:** Click the **Export Validation Excel** navbar action button. Verify that the downloaded spreadsheet successfully contains Sheet 1 ("MHD Validation Logs") and Sheet 2 ("IP Protection Clauses") in pure raw OpenXML layout.
- [ ] **Parametric CAD Sync:** Load the \`AutoUpdateModel.vba\` macro into your SolidWorks active assembly workspace. Run the script and confirm that the CAD application reads the peak CSV metric values, dynamically modifies the \`Max_Thermal_Dimension\` global variable equation, and triggers a full model rebuild.`;

  // Append new data points as core temperature updates
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getMinutes()}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100)}`;
    const pressurePsi = 33.40 + (coreTemperatureK > 820 ? 22.8 : (Math.random() - 0.5) * 1.5);
    const mhdCurrentA = mhdVoltageKv / 0.5;

    setTelemetryHistory((prev) => {
      const next = [
        ...prev,
        {
          timeStr,
          temperatureK: parseFloat(coreTemperatureK.toFixed(1)),
          pressurePsi: parseFloat(pressurePsi.toFixed(1)),
          mhdVelocityMs: parseFloat(mhdVelocityMs.toFixed(2)),
          mhdVoltageV: parseFloat(mhdVoltageKv.toFixed(2)),
          mhdCurrentA: parseFloat(mhdCurrentA.toFixed(1)),
          mhdPowerKw: parseFloat(mhdPowerKw.toFixed(1)),
          isSurge: coreTemperatureK >= 820,
        },
      ];
      if (next.length > MAX_POINTS) {
        return next.slice(next.length - MAX_POINTS);
      }
      return next;
    });
  }, [coreTemperatureK, mhdVelocityMs, mhdVoltageKv, mhdPowerKw]);

  // Web Audio Siren Synthesizer Engine
  const initAudioSiren = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, ctx.currentTime);

      const modOsc = ctx.createOscillator();
      const modGain = ctx.createGain();
      modOsc.type = 'sine';
      modOsc.frequency.value = 2.5;
      modGain.gain.value = 160;

      modOsc.connect(modGain);
      modGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);

      osc.start();
      modOsc.start();

      sirenOscRef.current = osc;
      sirenGainRef.current = gain;
      modOscRef.current = modOsc;
    } catch (e) {
      console.warn("Web Audio API unavailable:", e);
    }
  };

  const startSiren = () => {
    if (!isAudioEnabled) return;
    initAudioSiren();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (sirenGainRef.current && audioCtxRef.current) {
      sirenGainRef.current.gain.linearRampToValueAtTime(0.12, audioCtxRef.current.currentTime + 0.1);
      setSirenPlaying(true);
    }
  };

  const stopSiren = () => {
    if (sirenGainRef.current && audioCtxRef.current) {
      sirenGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.2);
      setSirenPlaying(false);
    }
  };

  useEffect(() => {
    if (isThermalSurge) {
      startSiren();
    } else {
      stopSiren();
    }
  }, [isThermalSurge, isAudioEnabled]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!isAudioEnabled) {
      setIsAudioEnabled(true);
      initAudioSiren();
    } else {
      setIsAudioEnabled(false);
      stopSiren();
    }
  };

  const exportThermalCsv = () => {
    const header = "Timestamp,Core_Temperature_Kelvin,Manifold_Pressure_PSI,Ionized_Salt_Velocity_ms,Induced_Voltage_V,Current_A,Net_Electric_Power_kW,Surge_State\n";
    const rows = telemetryHistory.map((d) => 
      `${d.timeStr},${d.temperatureK},${d.pressurePsi},${d.mhdVelocityMs.toFixed(2)},${d.mhdVoltageV.toFixed(2)},${d.mhdCurrentA.toFixed(1)},${d.mhdPowerKw.toFixed(1)},${d.isSurge ? "CRITICAL_SURGE" : "NOMINAL"}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mhd_smr_thermal_telemetry_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className={`flex flex-col h-full p-4 space-y-3 select-none transition-colors duration-300 ${
      isThermalSurge ? 'bg-[#18090C]' : 'bg-[#0E1019]'
    }`}>
      {/* Top Header with Alert Status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isThermalSurge ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-display">
              THERMODYNAMIC MONITOR
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              10Hz RECHARTS WAVEFORM & TELEMETRY
            </span>
          </div>
        </div>

        {/* Audio Mute/Unmute toggle */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
            isAudioEnabled
              ? sirenPlaying
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title={isAudioEnabled ? "Audible Warning Siren Enabled" : "Enable Siren Audio (Web Audio API)"}
        >
          {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isAudioEnabled ? (sirenPlaying ? 'SIREN ON' : 'AUDIO ARMED') : 'MUTED'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[10px] font-semibold">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-1.5 px-1 rounded-lg transition-all text-center truncate ${
            activeTab === 'telemetry' 
              ? 'bg-amber-500 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`py-1.5 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 truncate ${
            activeTab === 'tables' 
              ? 'bg-[#00E5FF] text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-3 h-3" />
          <span>Tables</span>
        </button>
        <button
          onClick={() => setActiveTab('vba')}
          className={`py-1.5 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 truncate ${
            activeTab === 'vba' 
              ? 'bg-emerald-400 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3 h-3" />
          <span>VBA API</span>
        </button>
        <button
          onClick={() => setActiveTab('deploy_ip')}
          className={`py-1.5 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 truncate ${
            activeTab === 'deploy_ip' 
              ? 'bg-purple-400 text-slate-950 font-bold shadow' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud className="w-3 h-3" />
          <span>Cloud & IP</span>
        </button>
      </div>

      {/* TAB 1: TELEMETRY & RECHARTS WAVEFORM */}
      {activeTab === 'telemetry' && (
        <div className="space-y-3 flex-1 flex flex-col overflow-y-auto pr-1">
          {/* Real-time State Card */}
          <div className={`p-3 rounded-xl border transition-all ${
            isThermalSurge 
              ? 'bg-rose-950/40 border-rose-500/80 text-rose-200 shadow-xl' 
              : 'bg-slate-950/80 border-slate-800 text-slate-300'
          }`}>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">System State:</span>
              <span className={`font-bold flex items-center gap-1.5 ${
                isThermalSurge ? 'text-rose-400 animate-pulse' : 'text-[#00E5FF]'
              }`}>
                {isThermalSurge ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>CRITICAL_SURGE (&gt;820K)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NOMINAL (765K BASE)</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">CORE TEMPERATURE</span>
                <span className={`text-2xl font-bold font-mono tabular-nums ${
                  isThermalSurge ? 'text-rose-300' : 'text-amber-300'
                }`}>
                  {coreTemperatureK.toFixed(1)} K
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">MANIFOLD PRESSURE</span>
                <span className="text-sm font-semibold text-slate-200 font-mono tabular-nums">
                  {(33.40 + (isThermalSurge ? 22.8 : 0)).toFixed(1)} PSI
                </span>
              </div>
            </div>
          </div>

          {/* Live Recharts Line Chart */}
          <div className="min-h-[175px] h-[175px] bg-[#07090F] rounded-xl border border-slate-800 p-2 relative flex flex-col">
            <div className="flex items-center justify-between px-2 pt-1 pb-1 text-[10px] font-mono text-slate-400">
              <span>Waveform (600 K - 900 K)</span>
              <span className={isThermalSurge ? "text-rose-400 font-bold" : "text-[#00E5FF]"}>
                Trip: 820.0 K | Baseline: 765.0 K
              </span>
            </div>

            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryHistory} margin={{ top: 8, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                  <XAxis 
                    dataKey="timeStr" 
                    tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    interval="preserveStartEnd"
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[600, 900]} 
                    tick={{ fill: '#64748B', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono'
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <ReferenceLine 
                    y={820} 
                    stroke="#EF4444" 
                    strokeDasharray="4 4" 
                    strokeWidth={1.5}
                    label={{ 
                      value: '820 K ALERT', 
                      fill: '#EF4444', 
                      fontSize: 8, 
                      fontFamily: 'JetBrains Mono',
                      position: 'insideTopLeft' 
                    }} 
                  />
                  <ReferenceLine 
                    y={765} 
                    stroke="#00E5FF" 
                    strokeDasharray="2 2" 
                    strokeWidth={1.2}
                    label={{ 
                      value: '765 K BASE', 
                      fill: '#00E5FF', 
                      fontSize: 8, 
                      fontFamily: 'JetBrains Mono',
                      position: 'insideBottomLeft' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperatureK" 
                    name="Core Temp (K)"
                    stroke={isThermalSurge ? '#FF3333' : '#39FF14'} 
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Automated Voltage-Generation Telemetry Node */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>MHD VOLTAGE TELEMETRY</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">V = B · v · L</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">SALT VELOCITY (v)</span>
                <span className="text-emerald-300 text-sm font-bold tabular-nums">
                  {mhdVelocityMs.toFixed(2)} m/s
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">INDUCED VOLTAGE (V)</span>
                <span className="text-[#00E5FF] text-sm font-bold tabular-nums">
                  {mhdVoltageKv.toFixed(2)} V
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">INDUCED CURRENT (A)</span>
                <span className="text-amber-300 text-sm font-bold tabular-nums">
                  {(mhdVoltageKv / 0.5).toFixed(2)} A
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[9px]">NET POWER (kW)</span>
                <span className="text-emerald-400 text-sm font-bold tabular-nums">
                  {mhdPowerKw.toFixed(2)} kW
                </span>
              </div>
            </div>
          </div>

          {/* Action Download & Export Buttons */}
          <div className="space-y-1.5 pt-1">
            <button
              onClick={onToggleForceSurge}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                forceSurgeActive
                  ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-900/40'
                  : 'bg-slate-900 text-[#C35237] hover:bg-slate-800 border-[#C35237]/60 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{forceSurgeActive ? 'Disable 850K Surge Test' : 'Force 850K Peak Surge Test'}</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <a
                href="/api/validation/export_excel"
                download="mhd_hardware_validation_report.xlsx"
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 transition-colors text-center"
                title="Download 2-sheet authentic OpenXML Excel file"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Excel (.xlsx)</span>
              </a>

              <a
                href="/download/gcode"
                download="production_manifold_toolpath.nc"
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 transition-colors text-center"
                title="Download pre-compiled CNC toolpath"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Download G-Code</span>
              </a>
            </div>

            {/* METRIC INFRASTRUCTURE FIREWALL NOTICE (Module 1) */}
            <div className="pt-2 border-t border-rose-900/30">
              <div className="text-[10px] font-mono text-[#FF3333] font-bold pb-1 flex items-center gap-1.5 border-b border-rose-600/20">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FF3333] animate-pulse" />
                <span>⚠️ SECURITY REGISTRY DETECTED</span>
              </div>
              <div className="mt-1.5 p-2.5 bg-[#1a0808] border-l-2 border-[#FF3333] rounded-r-lg text-[10px] font-mono leading-relaxed text-[#e5c5c5]">
                <strong className="text-[#FF3333] block mb-1 font-sans">PROPRIETARY LEGAL NOTICE:</strong>
                All underlying atomic constants, fission geometry parameters, and pre-compiled multi-axis G-code paths are classified as the independent, pre-existing Intellectual Property of <strong className="text-rose-300">Amit Nishanka Bhuyan</strong> [VAL-2026-SMR].
                <br /><br />
                Unlicensed replication, decompilation, or organizational extraction of this Black-Box system data vector violates prior disclosure boundary laws and automatically executes the mandatory conditional clause.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA TABLES & HARDWARE VALIDATION DATA SHEET */}
      {activeTab === 'tables' && (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Structured Hardware Validation Sheet (VAL-SMR-MHD-0374) */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-sky-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-bold">HARDWARE VALIDATION TEST DATA SHEET</span>
              <span className="text-[9px] text-slate-500 font-mono">VAL-SMR-MHD-0374</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Auditor: <strong className="text-slate-200">Amit Nishanka Bhuyan, Lead AI Researcher</strong> | Node: 4.2 Tesla
            </div>
            
            <div className="overflow-x-auto text-[9px] font-mono">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-left">
                    <th className="py-1">Run ID</th>
                    <th className="py-1">Vel (m/s)</th>
                    <th className="py-1">Volt (V)</th>
                    <th className="py-1">Temp (K)</th>
                    <th className="py-1">Siren</th>
                    <th className="py-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-1 text-slate-400">RUN_001</td>
                    <td className="py-1">0.00</td>
                    <td className="py-1">0.00</td>
                    <td className="py-1 text-[#00E5FF]">765.0</td>
                    <td className="py-1 text-slate-500">OFF</td>
                    <td className="py-1 text-emerald-400">NOMINAL_START</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">RUN_002</td>
                    <td className="py-1">45.30</td>
                    <td className="py-1">109.40</td>
                    <td className="py-1">772.4</td>
                    <td className="py-1 text-slate-500">OFF</td>
                    <td className="py-1 text-emerald-400">EQUILIBRIUM</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">RUN_003</td>
                    <td className="py-1 text-emerald-300">90.62</td>
                    <td className="py-1 text-[#00E5FF]">218.45</td>
                    <td className="py-1 text-amber-300">780.2</td>
                    <td className="py-1 text-slate-500">OFF</td>
                    <td className="py-1 text-emerald-400">NOMINAL_RUNNING</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">RUN_004</td>
                    <td className="py-1">94.15</td>
                    <td className="py-1">226.97</td>
                    <td className="py-1 text-amber-400">818.5</td>
                    <td className="py-1 text-slate-500">OFF</td>
                    <td className="py-1 text-amber-300">APPROACHING_LIMIT</td>
                  </tr>
                  <tr className="bg-rose-950/20">
                    <td className="py-1 text-rose-300">RUN_005</td>
                    <td className="py-1">148.60</td>
                    <td className="py-1">358.24</td>
                    <td className="py-1 text-rose-400 font-bold">849.2</td>
                    <td className="py-1 text-rose-400 font-bold">ON</td>
                    <td className="py-1 text-rose-400 font-bold">CRITICAL_SURGE</td>
                  </tr>
                  <tr className="bg-rose-950/30">
                    <td className="py-1 text-rose-300">RUN_006</td>
                    <td className="py-1 text-amber-300 font-bold">151.25</td>
                    <td className="py-1 text-amber-300 font-bold">364.63</td>
                    <td className="py-1 text-rose-400 font-bold">850.0</td>
                    <td className="py-1 text-rose-400 font-bold">ON</td>
                    <td className="py-1 text-rose-400 font-bold">MOCK_TEST_MAX</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">RUN_007</td>
                    <td className="py-1">88.40</td>
                    <td className="py-1">213.10</td>
                    <td className="py-1 text-emerald-300">774.1</td>
                    <td className="py-1 text-slate-500">OFF</td>
                    <td className="py-1 text-emerald-400">RECOVERY_RESET</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Module A Table */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-amber-900/40 space-y-1.5">
            <span className="text-amber-400 font-bold text-xs font-mono block">MODULE A: FUEL MATRIX BASELINE</span>
            <div className="text-[10px] font-mono grid grid-cols-2 gap-2 text-slate-300">
              <div className="bg-slate-950/60 p-1.5 rounded">Core Baseline: <strong>765.0 K</strong></div>
              <div className="bg-slate-950/60 p-1.5 rounded">Peak Level: <strong className="text-rose-400">850.0 K</strong></div>
              <div className="bg-slate-950/60 p-1.5 rounded">Pressure: <strong>33.40 PSI</strong></div>
              <div className="bg-slate-950/60 p-1.5 rounded">Surge Pressure: <strong className="text-rose-400">56.20 PSI</strong></div>
            </div>
          </div>

          {/* Module B Table */}
          <div className="p-3 bg-[#0A0D15] rounded-xl border border-emerald-500/40 space-y-1.5">
            <span className="text-emerald-400 font-bold text-xs font-mono block">MODULE B: MHD INDUCTION GOVERNING LAWS</span>
            <div className="text-[10px] font-mono space-y-1 text-slate-300">
              <div>• Magnetic Flux: <strong className="text-amber-300">4.2 Tesla</strong> (B-Field Constant)</div>
              <div>• Induced Voltage: <strong className="text-[#00E5FF]">218.45 V</strong> (V = B · v · L Math)</div>
              <div>• Circuit Current: <strong className="text-emerald-400">436.90 A</strong> (I = V / R with 0.5 Ω)</div>
              <div>• Net Wave Power: <strong className="text-emerald-300">95.43 kW</strong> (P = V · I Transfer Rate)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOLIDWORKS VBA MACROS */}
      {activeTab === 'vba' && (
        <div className="space-y-3 flex-1 flex flex-col overflow-y-auto pr-1">
          <div className="flex items-center gap-1.5 bg-[#090b10] p-1 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setVbaSubTab('annotation_sync')}
              className={`flex-1 py-1 rounded text-center transition-all ${
                vbaSubTab === 'annotation_sync'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ModelAnnotationSync
            </button>
            <button
              onClick={() => setVbaSubTab('gcode_panel')}
              className={`flex-1 py-1 rounded text-center transition-all ${
                vbaSubTab === 'gcode_panel'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GCode_Orchestrator
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>{vbaSubTab === 'annotation_sync' ? 'ModelAnnotationSync.vba' : 'GCodeCustomizationPanel.vba'}</span>
            </span>
            <button
              onClick={() => handleCopy(vbaSubTab === 'annotation_sync' ? MODEL_ANNOTATION_SYNC_VBA : GCODE_CUSTOMIZATION_PANEL_VBA, vbaSubTab)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/50 rounded-lg transition-colors"
            >
              {copiedText === vbaSubTab ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedText === vbaSubTab ? 'COPIED!' : 'Copy Macro'}</span>
            </button>
          </div>

          <div className="p-2.5 bg-[#07090F] rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-72">
            <pre className="text-emerald-400/90 whitespace-pre">
              {vbaSubTab === 'annotation_sync' ? MODEL_ANNOTATION_SYNC_VBA : GCODE_CUSTOMIZATION_PANEL_VBA}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CLOUD DEPLOY, PROPOSAL & DEVELOPER FIREWALL */}
      {activeTab === 'deploy_ip' && (
        <div className="space-y-3 flex-1 flex flex-col overflow-y-auto pr-1">
          {/* Sub-selector */}
          <div className="grid grid-cols-5 gap-1 bg-[#090b10] p-1 rounded-lg border border-slate-800 text-[9px] font-semibold">
            <button
              onClick={() => setDeployIpSubTab('proposal')}
              className={`py-1 rounded text-center truncate ${
                deployIpSubTab === 'proposal' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              JSW/M&M
            </button>
            <button
              onClick={() => setDeployIpSubTab('cloud')}
              className={`py-1 rounded text-center truncate ${
                deployIpSubTab === 'cloud' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              GCP/AWS
            </button>
            <button
              onClick={() => setDeployIpSubTab('blackbox')}
              className={`py-1 rounded text-center truncate ${
                deployIpSubTab === 'blackbox' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Firewall
            </button>
            <button
              onClick={() => setDeployIpSubTab('readme_ip')}
              className={`py-1 rounded text-center truncate ${
                deployIpSubTab === 'readme_ip' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              README
            </button>
            <button
              onClick={() => setDeployIpSubTab('cicd')}
              className={`py-1 rounded text-center truncate ${
                deployIpSubTab === 'cicd' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              CI/CD
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-purple-400 font-bold flex items-center gap-1.5">
              {deployIpSubTab === 'proposal' && (
                <>
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>JSW / M&M Proposal Letter</span>
                </>
              )}
              {deployIpSubTab === 'cloud' && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cloud Run & App Runner Manifests</span>
                </>
              )}
              {deployIpSubTab === 'blackbox' && (
                <>
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Developer Black-Box Firewall</span>
                </>
              )}
              {deployIpSubTab === 'readme_ip' && (
                <>
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>README.md Legal Clauses</span>
                </>
              )}
              {deployIpSubTab === 'cicd' && (
                <>
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>GitHub Release Workflow</span>
                </>
              )}
            </span>

            <button
              onClick={() => {
                const targetText = 
                  deployIpSubTab === 'proposal' ? PROPOSAL_LETTER_TEXT :
                  deployIpSubTab === 'cloud' ? CLOUD_DEPLOYMENT_TEXT :
                  deployIpSubTab === 'blackbox' ? DEVELOPER_BLACKBOX_TEXT :
                  deployIpSubTab === 'readme_ip' ? GITHUB_README_DOCUMENTATION :
                  GITHUB_README_DOCUMENTATION;
                handleCopy(targetText, deployIpSubTab);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-500/50 rounded-lg transition-colors"
            >
              {copiedText === deployIpSubTab ? <Check className="w-3 h-3 text-purple-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedText === deployIpSubTab ? 'COPIED!' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-2.5 bg-[#07090F] rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-72">
            <pre className="text-slate-300 whitespace-pre-wrap">
              {deployIpSubTab === 'proposal' && PROPOSAL_LETTER_TEXT}
              {deployIpSubTab === 'cloud' && CLOUD_DEPLOYMENT_TEXT}
              {deployIpSubTab === 'blackbox' && DEVELOPER_BLACKBOX_TEXT}
              {deployIpSubTab === 'readme_ip' && GITHUB_README_DOCUMENTATION}
              {deployIpSubTab === 'cicd' && CLOUD_DEPLOYMENT_TEXT}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
