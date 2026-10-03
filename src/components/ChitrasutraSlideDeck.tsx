import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Presentation, 
  Sparkles, 
  Flame, 
  Cpu, 
  Layers, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Languages
} from 'lucide-react';

export const ChitrasutraSlideDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeDeckType, setActiveDeckType] = useState<'mhd_smr' | 'flex_fuel'>('mhd_smr');
  const [promptLanguage, setPromptLanguage] = useState<'english' | 'hindi' | 'odia'>('english');
  const [isCopiedSlidePrompt, setIsCopiedSlidePrompt] = useState<boolean>(false);
  const [isCopiedKhadiPrompt, setIsCopiedKhadiPrompt] = useState<boolean>(false);

  // 1. MHD-SMR Nuclear Molten Salt & Generator-cum-Battery Presentation (Deep-Tech Paradigm)
  const MHD_SMR_SLIDES = [
    {
      id: 1,
      tag: "CORE ORIENTATION & CONTEXT",
      title: "THE CHITRASUTRA MHD-SMR ARCHITECTURE",
      subtitle: "Direct-Fission Magnetohydrodynamic Generator & Continuous Nuclear Battery",
      mainText: "A patent-grade digital twin architecture converting atomic nuclear energy directly into high-voltage electricity and kinetic thrust with zero mechanical pistons, zero emissions, and zero mechanical friction.",
      mathEquations: [
        "\\mathbf{J} = \\sigma \\left( \\mathbf{E} + \\mathbf{v} \\times \\mathbf{B} \\right)",
        "\\mathbf{F}_{Lorentz} = \\rho_e \\mathbf{E} + \\mathbf{J} \\times \\mathbf{B}"
      ],
      points: [
        "Zero-Mechanical Wear: Eliminates pistons, camshafts, and valves in favor of fluid magnetohydrodynamics.",
        "Generator-cum-Battery Hybrid: Continuous electrochemical charge directly retained within the molten salt solution.",
        "Lost-Wax Bronze Fusion: Classical Bharatiya metallurgy (Madhuchishta-Vidhana) housing aerospace quantum containment."
      ]
    },
    {
      id: 2,
      tag: "MODULE A: NUCLEAR CORE & STORAGE",
      title: "MODULE A: CORE FISSION & MOLTEN SALT STORAGE MATRIX",
      subtitle: "High-Temperature Fluoride/Chloride Fluid in Transparent Reinforced Quartz",
      mainText: "Replacing pressurized fuel tanks with transparent reinforced quartz tubes circulating molten fluoride/chloride salt containing dissolved nuclear fuel at atmospheric pressure with massive thermal capacity.",
      mathEquations: [
        "\\dot{Q}_{thermal} = \\dot{m} \\cdot C_p \\cdot \\left( T_{core} - T_{inlet} \\right)",
        "P_{internal} \\approx 1.05 \\text{ bar (Atmospheric Zero-Rupture Risk)}"
      ],
      points: [
        "Atmospheric Safety: Zero pressurized rupture hazard; molten salt operates far below its boiling point (>1400°C).",
        "Electrochemical Mesh: Nanoscale conductive meshes extract base-load galvanic current directly from hot ionic salt.",
        "Vibrant Ion Luminescence: Fluorescent green and solar orange ionic circulation visible through quartz shielding."
      ]
    },
    {
      id: 3,
      tag: "MODULE B: ELECTROMAGNETIC BRAIN",
      title: "MODULE B: MHD ELECTROMAGNETIC VECTOR BRAIN & PUMP GRID",
      subtitle: "Non-Mechanical Magnetic Levitation & Directional Lorentz Vector Routing",
      mainText: "Replacing the mechanical ECU and throttle valves with solid-state lateral magnetic arrays that modulate molten salt velocity and power extraction purely through controlled magnetic fields.",
      mathEquations: [
        "\\mathbf{v}_{salt} = \\frac{1}{\\sigma B^2} \\left( -\\nabla P + \\mathbf{J} \\times \\mathbf{B} \\right)",
        "\\Phi_B = \\iint_S \\mathbf{B} \\cdot d\\mathbf{A} = 2.40 \\text{ Tesla}"
      ],
      points: [
        "Valveless Fluid Control: Pure Lorentz-force wireless magnetic acceleration with zero moving parts.",
        "Solid-State Brain: Glowing cyan vector lines route microsecond-response field modulation across coil stages.",
        "Self-Governing Feedback: Automatic negative temperature coefficient prevents core thermal runaways."
      ]
    },
    {
      id: 4,
      tag: "MODULE C: INDUCTION EXECUTION RAIL",
      title: "MODULE C: MULTI-PULL GLASS-INSULATED INDUCTION RAILS",
      subtitle: "Chitrasutra Symmetrical Copper Windings for Direct High-Voltage Generation",
      mainText: "Replacing injector rails and combustion cylinders with multi-pull glass-insulated induction tubes wrapped in sacred Chitrasutra geometry coils, inducing Faraday high voltage directly from the conductive salt stream.",
      mathEquations: [
        "V_{Faraday} = \\oint (\\mathbf{v} \\times \\mathbf{B}) \\cdot d\\mathbf{l} = B \\cdot v \\cdot d",
        "P_{electric} = \\eta_{MHD} \\cdot \\sigma \\cdot v^2 \\cdot B^2 \\cdot \\text{Volume}"
      ],
      points: [
        "Direct Power Extraction: Faraday induction translates kinetic fluid energy directly into high-voltage AC/DC.",
        "Chitrasutra Coil Symmetry: Fibonacci and Yantra-inspired wire windings minimize eddy current losses.",
        "Infinite Service Life: Zero mechanical contact friction guarantees 50-year maintenance-free lifecycle."
      ]
    },
    {
      id: 5,
      tag: "THE SYNTHESIS: SOVEREIGN DIGITAL TWIN",
      title: "THE DIGITAL TWIN & PLANETARIUM DOME RESEARCH PLATFORM",
      subtitle: "Traditional Lost-Wax Casting Housing in a Master Scientific Observatory Canvas",
      mainText: "Encapsulating the entire 3D MHD-SMR engine in an ancient lost-wax cast bronze/copper armature with Sanskrit mathematical reliefs, presented inside a planetarium glass dome research facility over a rich Khadi canvas scroll.",
      mathEquations: [
        "\\eta_{net} = \\frac{P_{MHD} + P_{electrochemical}}{\\dot{Q}_{fission}} \\ge 62.4\\%",
        "\\text{Mechanical Degradation Rate: } 0.000\\text{ mm/yr}"
      ],
      points: [
        "Architectural Fusion: Sacred Dhokra/Chitrasutra bronze metallurgy shielding 4th-generation atomic propulsion.",
        "Observatory Canvas: Planetarium glass dome laboratory setting with continuous G-code toolpath projections.",
        "Sovereign IP Mastery: Complete standalone digital twin empowering the independent aerospace innovator."
      ]
    }
  ];

  // 2. Classical Flex-Fuel & CNG Slide Deck
  const FLEX_FUEL_SLIDES = [
    {
      id: 1,
      tag: "ORIENTATION & CONTEXT",
      title: "THE CHITRASUTRA ENGINE ARCHITECTURE",
      subtitle: "Bridging Ancient Geometric Symmetry and Modern Flex-Fuel Technology",
      mainText: "An analytical exploration showcasing how historical design matrices from ancient manuscripts inform modern multi-axis system layouts. This title canvas establishes orientation, context, and structural link.",
      mathEquations: [
        "E_a = \\frac{M}{2\\pi r} + \\left[ \\frac{S_x - a^G}{2 m e} \\right]",
        "\\sigma_{eM} = \\frac{n^2}{2\\pi \\beta} \\cdot \\frac{a_T - 1^P}{\\tau^T} \\cdot v_b^2"
      ],
      points: [
        "Historical Matrix Integration: Translation of classical Bharatiya proportions into precision CAD space.",
        "Aesthetic-Mechanical Continuity: Unbroken horizontal flow lines defining structural connectivity.",
        "Systemic Synthesis: Digital twin architecture uniting traditional geometry with automotive aerospace standards."
      ]
    },
    {
      id: 2,
      tag: "MODULE A: STORAGE FOUNDATION",
      title: "MODULE A: ENERGY COLLECTION & STORAGE FOUNDATION",
      subtitle: "Geometric Realignment & Variable Flex-Fuel Vessels",
      mainText: "Re-engineering fuel cylinders into balanced structural vessels designed to withstand dynamic high-pressure flex-fuel and dual-electrolyte networks.",
      mathEquations: [
        "P_{burst} \\ge 2.65 \\cdot P_{working} \\quad [ISO\\;11439]",
        "\\Delta V_{tank} = \\int_{0}^{t} \\dot{m}_{carrier} \\cdot \\rho^{-1} dt"
      ],
      points: [
        "Geometric Realignment: Replacing traditional layout templates with balanced structural fuel vessels.",
        "Variable Fuel Capacity: Designed to safely handle dual-electrolyte networks and unstable flex-fuel blends.",
        "Material Resilience: Shielded with anti-corrosive thermal barrier coatings based on classical metallurgy."
      ]
    },
    {
      id: 3,
      tag: "MODULE B: CONTROL HUB",
      title: "MODULE B: DYNAMIC CONTROL HUBS & SENSOR NETWORKS",
      subtitle: "Algorithmic Flow, Pressure Equilibrium & Closed-Loop Telemetry",
      mainText: "Mapping electronic control unit (ECU) routing paths along unbroken flow vectors, regulating high-pressure conduits into uniform delivery tolerances.",
      mathEquations: [
        "E_{oa} = \\frac{R_g}{t_1} + B_{na} \\cdot \\frac{dV}{dt}",
        "R_s = \\left[ \\frac{\\partial V_1}{\\partial \\tau} + \\frac{\\partial h^7}{\\partial T} \\right]"
      ],
      points: [
        "Central Control Logic: Mapping electronic control unit (ECU) signal routing paths along unbroken flow vectors.",
        "Pressure Equilibrium: Regulating high-pressure gaseous lines into uniform delivery tolerances.",
        "Dynamic Trapping: Real-time air-to-fuel ratio optimization to counter changing fuel qualities."
      ]
    },
    {
      id: 4,
      tag: "MODULE C: COMBUSTION MATRIX",
      title: "MODULE C: THE EXPLODED MULTI-POINT INJECTOR RAIL",
      subtitle: "Precision Atomization & Automated CNC Manifold Toolpaths",
      mainText: "Aligning fuel injector nodes along mathematically balanced dimensional grids and translating complex 3D contours directly into automated G-code.",
      mathEquations: [
        "\\tau_{gas} = \\tau_{petrol} \\cdot K_{ratio} + \\text{offset}",
        "Q = C_d \\cdot A_0 \\cdot \\sqrt{2 \\rho \\Delta P}"
      ],
      points: [
        "Spatial Balance: Aligning fuel injector nodes along mathematically balanced dimensional grids.",
        "Precision Atomization: Utilizing optimized aperture geometries to maximize kinetic combustion force.",
        "CNC Compatibility: Translating complex 3D manifold contours directly into automated manufacturing code."
      ]
    },
    {
      id: 5,
      tag: "THE SYNTHESIS",
      title: "THE SYSTEM COMPLETE: THE DIGITAL TWIN LAUNCHPAD",
      subtitle: "From Classical Manuscripts to Lost-Wax Micro-Casting & 5-Axis CNC",
      mainText: "By establishing a strict firewall between pre-existing independent simulation apps and corporate workspace systems, the solo researcher operates as an elite project coordinator. The path forward combines advanced CAD prototyping with traditional lost-wax micro-casting to achieve localized industrial manufacturing.",
      mathEquations: [
        "\\eta_{overall} = \\eta_{thermal} \\cdot \\eta_{volumetric} \\cdot \\eta_{combustion}",
        "\\text{Tolerance Band: } \\pm 0.012\\text{ mm} \\quad [ISO\\;2768-mK]"
      ],
      points: [
        "Digital Twin Continuity: Complete simulation-to-machining CAD pipeline.",
        "Localized Manufacturing: Wootz-inspired metallurgical alloys and lost-wax micro-casting.",
        "Zero-Rupture Integrity: Ambient liquid electrochemical conversion pathway."
      ]
    }
  ];

  const currentDeck = activeDeckType === 'mhd_smr' ? MHD_SMR_SLIDES : FLEX_FUEL_SLIDES;
  const currentSlide = currentDeck[Math.min(currentSlideIndex, currentDeck.length - 1)];

  // MASTER GOOGLE SLIDES PROMPT FOR MHD-SMR NUCLEAR MOLTEN SALT (ENGLISH)
  const MASTER_MHD_SLIDES_PROMPT_EN = `Create a world-class, 5-slide technical infographic engineering presentation titled "Chitrasutra MHD-SMR Architecture: Zero-Combustion Nuclear Molten Salt Battery & Generator Digital Twin".

The presentation follows a strict engineering graphic novel storytelling style, illustrating how ancient Bharatiya lost-wax bronze casting and Chitrasutra geometric symmetry fuse with cutting-edge Magnetohydrodynamic (MHD) Small Modular Reactor technology. Use a dark, premium aesthetic: Charcoal Black (#0C0C0E), Terracotta Dust (#C35237), Electric Cyan (#00E5FF), and Fluorescent Salt Green (#39FF14).

Format the slides exactly as follows:

- Slide 1: The Title Canvas (Orientation & Context)
  * Title: THE CHITRASUTRA MHD-SMR ENGINE ARCHITECTURE
  * Subtitle: Zero-Combustion Direct Nuclear-to-Electric Generator & Continuous Atomic Battery
  * Main Text: An advanced propulsion and power-plant digital twin transforming nuclear energy directly into electricity and velocity with zero pistons, zero smoke, and zero mechanical friction.
  * Visual Style: Isometric view inside a Planetarium Glass Dome research facility over a textured Khadi canvas drafting board.

- Slide 2: Module A - Core Fission & Molten Salt Storage Matrix
  * Header: MODULE A: CORE FISSION & MOLTEN SALT STORAGE MATRIX
  * Bullets:
    - Transparent Quartz Containment: Series of ultra-durable quartz and reinforced glass tubes circulating glowing molten fluoride/chloride salt.
    - Zero External Pressure: High thermal energy storage at atmospheric pressure, eliminating cylinder rupture hazards.
    - Direct Electrochemical Extraction: Nanoscale electrochemical mesh extracting base-load current directly from circulating ionic salt.

- Slide 3: Module B - MHD Electromagnetic Vector Brain
  * Header: MODULE B: MHD ELECTROMAGNETIC CONTROL GRID & MAGNETIC PUMPS
  * Bullets:
    - Valveless Magnetic Motion: Lateral magnetic arrays wirelessly regulate molten salt velocity and power extraction via Lorentz force (F = J x B).
    - Glowing Cyan Control Paths: Solid-state controller replacing mechanical ECU with instant electromagnetic vector routing.
    - Intrinsically Safe Dynamics: Self-limiting nuclear reactivity governed by negative thermal feedback coefficients.

- Slide 4: Module C - Multi-Pull Glass-Insulated Induction Rails
  * Header: MODULE C: MULTI-PULL GLASS-INSULATED INDUCTION RAILS
  * Bullets:
    - Zero Mechanical Wear: Complete removal of pistons, crankshafts, and injectors; molten salt passes through glass-insulated induction tubes.
    - Chitrasutra Symmetrical Coils: Fine copper wire windings in sacred geometric patterns directly extract high-voltage electricity via Faraday induction.
    - Generator-cum-Battery Hybrid: Continuous electrochemical and magnetohydrodynamic charging keeps the system perpetually energized.

- Slide 5: The Synthesis - Lost-Wax Bronze Casing & Observatory Digital Twin
  * Header: THE SYSTEM COMPLETE: SOVEREIGN DIGITAL TWIN & OBSERVATORY PLATFORM
  * Bullets:
    - Heritage Metallurgy: Outer structural armature manufactured via traditional Bharatiya lost-wax casting in bronze and copper with mathematical engravings.
    - Planetarium Glass Dome Setting: Engine digital twin set within an astronomical observatory with live G-code manufacturing toolpaths.
    - Sovereign Aerospace Independence: High-efficiency, 50-year maintenance-free power plant designed for localized deep-tech industrial execution.`;

  // MASTER GOOGLE SLIDES PROMPT FOR MHD-SMR (HINDI)
  const MASTER_MHD_SLIDES_PROMPT_HI = `Google Slides AI के लिए 5-स्लाइड का अत्यंत पेशेवर और विस्तृत इंजीनियरिंग प्रेजेंटेशन बनाएं, जिसका शीर्षक हो: "चित्रसूत्र MHD-SMR आर्किटेक्चर: परमाणु मॉल्टन साल्ट जनरेटर-कम-बैटरी डिजिटल ट्विन (A to Z Architecture)".

यह प्रेजेंटेशन पारंपरिक दहन इंजनों से 50 साल आगे की डीप-टेक सोच प्रस्तुत करता है—जहाँ बिना किसी पिस्टन, बिना धुएं और बिना किसी मैकेनिकल घर्षण के सीधे परमाणु ऊर्जा को बिजली और गति में बदला जाता है। रंग संयोजन: चारकोल ब्लैक (#0C0C0E), टेराकोटा डस्ट (#C35237), इलेक्ट्रिक स्यान (#00E5FF), और फ्लोरोसेंट हरा (#39FF14)।

स्लाइड रूपरेखा:
- स्लाइड 1: शीर्षक कैनवास (Orientation & Context)
  * शीर्षक: THE CHITRASUTRA MHD-SMR ENGINE ARCHITECTURE
  * उपशीर्षक: डायरेक्ट-फिशन मैग्नेटोहाइड्रोडायनामिक जनरेटर और कंटीन्यूअस चार्ज न्यूक्लियर बैटरी
  * विवरण: प्लेनेटेरियम ग्लास डोम लेबोरेटरी के अंदर खादी कैनवास स्क्रोल पर भारतीय धातुशिल्प (Lost-Wax Casting) और क्वांटम प्रोपल्शन का समन्वय।

- स्लाइड 2: मॉड्यूल क (Module A: Core Fission & Storage Matrix)
  * शीर्षक: सेंट्रल कोर और न्यूक्लियर मॉल्टन साल्ट कंबशन
  * मुख्य बिंदु: पारदर्शी क्वार्ट्ज ट्यूब्स में बहता फ्लोरोसेंट हरा-नारंगी पिघला हुआ नमक (Molten Salt), वायुमंडलीय शून्य-दबाव सुरक्षा, और बेस-लोड करंट निकालने वाली इलेक्ट्रोकेमिकल मेश।

- स्लाइड 3: मॉड्यूल ख (Module B: The System Brain)
  * शीर्षक: MHD इलेक्ट्रोमैग्नेटिक कंट्रोल ग्रिड और मैग्नेटिक पंप्स
  * मुख्य बिंदु: सॉलिड-स्टेट कंट्रोलर, चमकदार नीली सर्किट लाइन्स (Cyan Vectors), शक्तिशाली चुंबकों द्वारा लोरेंत्ज़ बल (F = J x B) से वायरलेस तरीके से नियंत्रित साल्ट फ्लो (Zero Mechanical Valves)।

- स्लाइड 4: मॉड्यूल ग (Module C: The Execution Rail)
  * शीर्षक: मल्टी-पुल ग्लास-इंसुलेटेड इंडक्शन ट्यूब्स और एनर्जी एक्सट्रैक्शन
  * मुख्य बिंदु: बिना किसी पिस्टन या घर्षण (Zero Mechanical Wear) के सीधे हाई-वोल्टेज बिजली पैदा करने वाली चित्रसूत्र ज्यामिति में लिपटी कॉपर वाइंडिंग्स; जनरेटर-कम-बैटरी का कंटीन्यूअस चार्जिंग लूप।

- स्लाइड 5: अंतिम संश्लेषण (The Synthesis)
  * शीर्षक: भारतीय धातुशिल्प, खादी कैनवास और डिजिटल ट्विन लॉन्चपैड
  * मुख्य बिंदु: लॉस्ट-वैक्स कास्टिंग से निर्मित कांस्य-तांबे का आवरण, गणितीय सूत्र नक्काशी, 5-एक्सिस सीएनसी जी-कोड टूलपाथ्स, और स्वतंत्र शोधकर्ता के लिए संपूर्ण डिजिटल ट्विन आर्किटेक्चर।`;

  // ODIA PROMPT FOR MHD-SMR (RECRUITER TECH PRESENTATION WITH PRECISE DATA TABLES)
  const MASTER_MHD_SLIDES_PROMPT_ODIA = `Create a highly professional, 5-slide technical infographic pitch deck in Odia script titled "ମଲ୍ଟେନ-ସଲ୍ଟ MHD ପାୱାର ସେଲ୍ ଏନର୍ଜି ମ୍ୟାଟ୍ରିକ୍ସ (Recruiter Tech Presentation)". 

The presentation must target technical recruiters at engineering firms (like Tata, Oracle, or Airbus), demonstrating a production-ready digital twin. The aesthetic must use a dark, hyper-clean theme consisting of Charcoal Black (#0F1015), Neon Fluorescent Green (#39FF14), Electric Cyan (#00E5FF), and Deep Amber (#8F7142).

Format the slides exactly as follows in Odia text:

- Slide 1: System Title Canvas
  * Title: ମଲ୍ଟେନ-ସଲ୍ଟ MHD ପାୱାର ସେଲ୍ ଏନର୍ଜି ମ୍ୟାଟ୍ରିକ୍ସ
  * Subtitle: Faraday Induction ରଣନୀତି ଏବଂ ସ୍ୱୟଂଚାଳିତ CAD/VBA API ସିଙ୍କ୍ରୋନାଇଜେସନ୍
  * Content: A high-level architectural statement proving how automated Python/VBA scripts map live thermodynamic signals straight to active SolidWorks model properties.

- Slide 2: Module A & Telemetry Data Table
  * Header: MODULE A: ଇନ୍ଧନ ସଂଗ୍ରହ ଏବଂ ଲାଇଭ୍ ଥର୍ମୋଡାଇନାମିକ ଷ୍ଟାଟିଷ୍ଟିକ୍ସ
  * Content: Include a precise data table detailing structural fuel conditions:

    | Parameter Node | Fluid Matrix Baseline | Peak Test Level (850K) |
    | Core Temperature | 765.0 K | 850.0 K |
    | Fluid Velocity | 90.62 m/s | 151.25 m/s |
    | Manifold Pressure | 33.40 PSI | 56.20 PSI |
    | Safety Override Status | NOMINAL | CRITICAL_SURGE |

- Slide 3: Module B & Induced Current Matrix Table
  * Header: MODULE B: MHD ଇଲେକ୍ଟ୍ରୋମ୍ୟାଗ୍ନେଟିକ ଜେନେରେସନ୍ ଏବଂ ଆଉଟପୁଟ୍ ଫିଲ୍ଡ
  * Content: Include a detailed current extraction metric table to highlight engineering feasibility for recruiters:

    | Induction Vector | Metric Value Field | Physics Governing Formula |
    | Magnetic Flux Matrix | 4.2 Tesla | B-Field Constant Node |
    | Induced Voltage Output | 218.45 V | V = B * v * L Induction Math |
    | Circuit Current Density | 436.90 A | I = V / R (0.5 Ohm Resistance) |
    | Net Generated Power | 95.43 kW | P = V * I (Energy Transfer Rate) |

- Slide 4: Module C - Automation Code & Toolpath Logic
  * Header: MODULE C: ସ୍ୱୟଂଚାଳିତ CNC G-Code ଏବଂ SolidWorks VBA API ଆଲଗୋରିଦମ
  * Bullet Points:
    - Parametric CAD Feedback: ମଲ୍ଟେନ-ସଲ୍ଟ ପ୍ରବାହର ବେଗ ଅନୁଯାୟୀ SolidWorks ର "Max_Thermal_Dimension" କୁ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଅପଡେଟ୍ କରିବା।
    - Precision Machining Sync: ଜଟିଳ 3D ମ୍ୟାନିଫୋଲ୍ଡ ଡିଜାଇନକୁ ସିଧାସଳଖ 0.0025mm ସୂକ୍ଷ୍ମତା ବିଶିଷ୍ଟ CNC G-Code ରେ ରୂପାନ୍ତରିତ କରିବା।
    - Failsafe Logging Loop: ୧୦Hz ଫ୍ରିକ୍ୱେନ୍ସିରେ ଉଭୟ ଭିଜୁଆଲ୍ ରେଡ୍ ଆଲର୍ଟ ଏବଂ ବ୍ରାଉଜର-ନେଟିଭ୍ ଅଡିଓ ସାଇରେନ୍ ର ସଫଳ ପ୍ରୟୋଗ।

- Slide 5: Strategic Operations & Technology Transfer
  * Header: ସିଷ୍ଟମ ସମାପ୍ତି: ଷ୍ଟାର୍ଟଅପ୍ ବ୍ଲୁପ୍ରିଣ୍ଟ ଏବଂ ଇଣ୍ଡଷ୍ଟ୍ରିଆଲ୍ ଟେକ୍ନୋଲୋଜି ଟ୍ରାନ୍ସଫର
  * Content: Explaining the architectural layout: maintaining a rigorous firewall between personal private GitHub repositories and corporate local networks ensures zero IP leaks. The final design coordinates localized high-precision lost-wax micro-casting with high-end digital twin models to achieve a complete product deployment.`;

  const MASTER_FLEX_SLIDES_PROMPT_ODIA = `Create a highly professional, 5-slide technical infographic engineering presentation in Odia script titled "ଭାରତୀୟ ଚିତ୍ରସୂତ୍ର ଜ୍ୟାମିତି ଏବଂ ଆଧୁନିକ Flex-Fuel Propulsion ପ୍ରଣାଳୀର ସମନ୍ୱୟ (A to Z Architecture)".

The presentation must follow a strict engineering graphic novel storytelling narrative, showcasing how geometric spatial logic from ancient texts transitions into modern mechanical engine manufacturing. Use a dark, premium corporate color theme consisting of Charcoal Black (#0C0C0E), Terracotta Dust (#C35237), and Electric Cyan (#00E5FF).`;

  const MASTER_SLIDES_PROMPT_EN = activeDeckType === 'mhd_smr' 
    ? MASTER_MHD_SLIDES_PROMPT_EN 
    : `Create a highly professional, 5-slide technical infographic engineering presentation titled "A to Z of Ancient Bharatiya Engineering: The Evolution from Chitrasutra Symmetries to Modern Flex-Fuel Propulsion"...`;

  const KHADI_BG_PROMPT = activeDeckType === 'mhd_smr'
    ? `A panoramic, patent-grade 3D scientific digital twin rendering of an MHD-SMR (Magnetohydrodynamic Small Modular Reactor) nuclear battery engine inside a magnificent planetarium glass dome research laboratory. The engine sits on an antique architectural drafting board platform. At its core are luminous transparent quartz glass tubes through which glowing fluorescent green and molten solar orange liquid salt flows continuously. Surrounding the tubes are fine copper and bronze wire induction windings wrapped in sacred Chitrasutra geometric symmetry. An obsidian and cyan solid-state electromagnetic controller emits delicate glowing vector circuit traces. The outer structural casing is made of antique lost-wax cast bronze with intricate mathematical symbols and relief carvings. In the background, astronomical observatory meridian lines, dimensional measurement arrows, and pre-compiled CNC G-code toolpaths float across a warm, textured Khadi cloth canvas scroll. 8k resolution, cinematic lighting, ultra-precise aerospace CAD detail.`
    : `A high-resolution, technical blueprint illustration executed on a raw, textured Khadi canvas cloth background with visible woven fabric fibers and organic frayed edges. The design is rendered in a premium architectural style combining deep terracotta line work, fine charcoal gray technical outlines, and subtle glowing electric cyan vector paths. The canvas depicts an unbroken horizontal scroll filled with ancient mathematical engineering equations, geometric symmetry boxes, and exploded-view engine mechanical diagrams like manifolds, fuel injection rails, and fluid lines.`;

  const getActivePromptText = () => {
    if (activeDeckType === 'mhd_smr') {
      if (promptLanguage === 'hindi') return MASTER_MHD_SLIDES_PROMPT_HI;
      if (promptLanguage === 'odia') return MASTER_MHD_SLIDES_PROMPT_ODIA;
      return MASTER_MHD_SLIDES_PROMPT_EN;
    }
    return promptLanguage === 'odia' ? MASTER_FLEX_SLIDES_PROMPT_ODIA : MASTER_SLIDES_PROMPT_EN;
  };

  const copySlidePrompt = () => {
    navigator.clipboard.writeText(getActivePromptText());
    setIsCopiedSlidePrompt(true);
    setTimeout(() => setIsCopiedSlidePrompt(false), 2000);
  };

  const copyKhadiPrompt = () => {
    navigator.clipboard.writeText(KHADI_BG_PROMPT);
    setIsCopiedKhadiPrompt(true);
    setTimeout(() => setIsCopiedKhadiPrompt(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header with Architecture Selector & Language Switcher */}
      <div className="space-y-4 border-b border-amber-900/30 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C35237] font-display">
              <Presentation className="w-4 h-4 text-[#00E5FF]" />
              <span>A TO Z ENGINEERING PRESENTATION SUITE</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-mono">GOOGLE SLIDES MASTER PROMPTS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-100">
              Chitrasutra Infographic Slide Deck
            </h1>
          </div>

          {/* Architecture Deck Switcher */}
          <div className="flex items-center gap-2 bg-[#12141c] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveDeckType('mhd_smr'); setCurrentSlideIndex(0); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDeckType === 'mhd_smr'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>MHD-SMR Nuclear Battery</span>
            </button>
            <button
              onClick={() => { setActiveDeckType('flex_fuel'); setCurrentSlideIndex(0); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDeckType === 'flex_fuel'
                  ? 'bg-[#C35237] text-white shadow-lg shadow-orange-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Flex-Fuel / CNG Engine</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-400 max-w-4xl">
          {activeDeckType === 'mhd_smr'
            ? 'Deep-tech digital twin presentation for the Magnetohydrodynamic Small Modular Reactor (MHD-SMR) generator-cum-battery. Replaces combustion chambers with quartz molten salt core, Lorentz-force magnetic control, and zero-wear induction rails.'
            : 'Step-by-step 5-slide technical infographic engineering presentation bridging classical Bharatiya geometric proportions (Chitrasutra / Yantra) with modern automotive multi-axis flex-fuel propulsion.'}
        </p>

        {/* Language selector bar */}
        <div className="flex items-center gap-2 pt-2">
          <Languages className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Prompt Language:</span>
          <div className="flex items-center gap-1 bg-[#12141c] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setPromptLanguage('english')}
              className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                promptLanguage === 'english' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            {activeDeckType === 'mhd_smr' && (
              <button
                onClick={() => setPromptLanguage('hindi')}
                className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                  promptLanguage === 'hindi' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी (Hindi)
              </button>
            )}
            <button
              onClick={() => setPromptLanguage('odia')}
              className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
                promptLanguage === 'odia' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ଓଡ଼ିଆ (Odia)
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Strip */}
      <div className="flex items-center justify-between gap-4 p-2 bg-[#12141c] rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {currentDeck.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                currentSlideIndex === idx
                  ? activeDeckType === 'mhd_smr'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-[#C35237] text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Slide 0{slide.id}: {slide.tag.split(':')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-900 rounded-lg border border-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400">
            {currentSlideIndex + 1} / {currentDeck.length}
          </span>
          <button
            disabled={currentSlideIndex === currentDeck.length - 1}
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, currentDeck.length - 1))}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 bg-slate-900 rounded-lg border border-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Khadi Canvas Slide Card */}
      <div className="relative p-8 md:p-12 bg-[#0C0C0E] rounded-3xl border-4 border-[#C35237]/40 shadow-2xl overflow-hidden space-y-6">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #8F7142 0px, #8F7142 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, #8F7142 0px, #8F7142 1px, transparent 1px, transparent 12px)',
          }}
        />

        <div className="flex items-center justify-between border-b border-[#C35237]/30 pb-4 relative z-10">
          <span className="text-xs font-mono font-bold text-[#00E5FF] tracking-wider uppercase">
            // {currentSlide.tag}
          </span>
          <span className="text-xs font-display text-[#C35237]">
            KHADI SCROLL SHEET #0{currentSlide.id}
          </span>
        </div>

        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 font-display tracking-wide">
            {currentSlide.title}
          </h2>
          <p className="text-sm font-semibold text-[#00E5FF]">
            {currentSlide.subtitle}
          </p>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl relative z-10">
          {currentSlide.mainText}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 pt-2">
          {currentSlide.mathEquations.map((eq, i) => (
            <div key={i} className="p-4 bg-[#141620] rounded-xl border border-slate-800 font-mono text-xs text-[#00E5FF]">
              <span className="text-slate-500 text-[10px] block mb-1">EQUATION MATRIX [{i+1}]</span>
              <span className="text-slate-100">{eq}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 relative z-10 pt-2 border-t border-slate-800">
          {currentSlide.points.map((pt, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#C35237] mt-1.5 shrink-0" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prompts Export Deck with Language Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Master Google Slides Prompt */}
        <div className="p-6 bg-[#12141e] rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#00E5FF]">
              MODULE 1: MASTER GOOGLE SLIDES PROMPT
            </span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setPromptLanguage('english')}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  promptLanguage === 'english' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setPromptLanguage('odia')}
                className={`px-2 py-1 text-[11px] font-semibold rounded ${
                  promptLanguage === 'odia' ? 'bg-[#C35237] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                ଓଡ଼ିଆ (Odia)
              </button>
            </div>
          </div>

          <pre className="p-4 bg-[#0A0C12] rounded-xl text-slate-400 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
            {getActivePromptText()}
          </pre>

          <button
            onClick={copySlidePrompt}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            {isCopiedSlidePrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedSlidePrompt ? 'Copied Prompt!' : `Copy Slides Prompt (${promptLanguage.toUpperCase()})`}</span>
          </button>
        </div>

        {/* Module 2: Khadi Canvas Scroll Asset Prompt */}
        <div className="p-6 bg-[#12141e] rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-mono font-semibold text-[#C35237]">
                MODULE 2: KHADI SCROLL IMAGE ASSET PROMPT
              </span>
            </div>
            <pre className="p-4 bg-[#0A0C12] rounded-xl text-slate-400 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
              {KHADI_BG_PROMPT}
            </pre>
          </div>

          <button
            onClick={copyKhadiPrompt}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-semibold text-white bg-[#C35237] hover:bg-amber-600 rounded-lg transition-colors"
          >
            {isCopiedKhadiPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedKhadiPrompt ? 'Copied Khadi Prompt!' : 'Copy Khadi Background Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
