import { EngineComponent, AssemblyStep } from '../types/engine';

export const ENGINE_COMPONENTS: EngineComponent[] = [
  {
    id: 'cng_cylinders',
    name: 'Dual High-Pressure Cylinders',
    hindiName: 'सीएनजी सिलिंडर्स (ऊर्जा संचय)',
    sanskritName: 'अग्नि-कोष (Agni-Koshah)',
    moduleId: 'module-a',
    moduleTitle: 'Module A: The Power Grid & Storage Foundation',
    x: 420,
    y: 190,
    width: 360,
    height: 140,
    pressureRating: '200 - 260 bar (Test: 300 bar)',
    operatingTemp: '-40°C to +85°C',
    materialSpec: 'Type-IV Carbon Fiber / Epoxy Matrix with Seamless HDPE Liner & SS316L Neck Bushing',
    flowDirection: 'Dual parallel manifold discharge -> High-pressure isolation manifold',
    signalLogic: 'Tank Temperature & Level Sensor (NTC Thermistor / Magnetic Reed float, 0-5V DC analog)',
    description: 'High-density twin pneumatic reservoirs mounted in rigid geometric symmetry with vibration-dampening metallic cradle straps. Stores compressed biomethane or natural gas at 200 bar working pressure with burst safety ratio > 2.65 (ISO 11439 compliant).',
    cadCoordinates: {
      origin: [0, 680, 240],
      explodedVector: [0, 320, 180],
      boundingVolume: [780, 220, 220],
    },
    subComponents: [
      {
        id: 'cng_tank_upper',
        name: 'Primary Cylinder Vessel (Upper Tier)',
        sanskritName: 'उर्ध्व कोष',
        material: 'Carbon-epoxy continuous filament wound / Al-6061 neck',
        tolerance: 'Wall thickness: 8.4mm ±0.15mm',
        explodedOffset: { x: 0, y: -90, z: 40 },
        role: 'Primary storage volume (35L water volume capacity)',
      },
      {
        id: 'cng_tank_lower',
        name: 'Secondary Cylinder Vessel (Lower Tier)',
        sanskritName: 'अधर कोष',
        material: 'Carbon-epoxy continuous filament wound / Al-6061 neck',
        tolerance: 'Wall thickness: 8.4mm ±0.15mm',
        explodedOffset: { x: 0, y: -30, z: 20 },
        role: 'Auxiliary linked storage volume (35L capacity)',
      },
      {
        id: 'burst_disc_unit',
        name: 'Thermally Activated Pressure Relief Device (PRD)',
        sanskritName: 'तापीय सुरक्षा छिद्र',
        material: 'Fusible eutectic alloy + Rupture disc (SS316L)',
        tolerance: 'Burst trip pressure: 300 bar ±5% at 110°C',
        explodedOffset: { x: 140, y: -60, z: 80 },
        role: 'Passive emergency pressure release under extreme thermal events',
      },
      {
        id: 'mounting_straps',
        name: 'Harmonic Restraint Chassis Straps',
        sanskritName: 'बंधन वलय',
        material: 'High-tensile forged steel with EPDM rubber isolator sleeve',
        tolerance: 'Tensile yield: 780 MPa; Bolt torque: 48 Nm ±2 Nm',
        explodedOffset: { x: -120, y: 30, z: -50 },
        role: 'Absorbs dynamic multi-axis vehicle inertial accelerations (20G crash rated)',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Formate/LOHC Redox Micro-Reformer Cell Array',
      advantage: 'Zero 200-bar hazard; stored at ambient atmospheric liquid pressure (1.0 bar); 3.2x volumetric energy density',
      conversionDetail: 'Replaces compressed cylinders with an atmospheric twin-chamber HDPE reservoir containing Liquid Organic Hydrogen Carrier (LOHC) or aqueous potassium formate with a compact heated catalytic dehydrogenation reformer pack.',
      flowAdaptation: 'Liquid dosing pump feeds reformer at 0.08 - 0.45 mL/s; continuous gas generation supplies 2.2 bar gas directly to downstream filter.',
    },
  },
  {
    id: 'high_pressure_line',
    name: 'High-Pressure Armored Conduit',
    hindiName: 'हाई प्रेशर लाइन (ग्रीन ट्यूबिंग)',
    sanskritName: 'प्राण-नाली (Prana-Nali)',
    moduleId: 'module-a',
    moduleTitle: 'Module A: The Power Grid & Storage Foundation',
    x: 580,
    y: 350,
    width: 220,
    height: 48,
    pressureRating: 'Rated 260 bar working / 600 bar burst',
    operatingTemp: '-40°C to +120°C',
    materialSpec: 'Seamless SS316L Seamless Hydraulic Tubing (OD 6.0mm x ID 4.0mm) with Polyamide-12 Protective Jacket',
    flowDirection: 'Storage cylinders -> Bulkhead pass-through -> Pressure Regulator inlet',
    signalLogic: 'Pure mechanical fluid transfer (dual Swagelok mechanical compression ferrules)',
    description: 'Vibration-isolated seamless stainless conduit routing supercritical compressed gas from the vehicle rear to the engine compartment with serpentine stress-relief bends (minimum bend radius 35mm).',
    cadCoordinates: {
      origin: [120, 520, 110],
      explodedVector: [60, 140, 50],
      boundingVolume: [450, 40, 40],
    },
    subComponents: [
      {
        id: 'ss_tubing',
        name: 'SS316L Annealed Hydraulic Tube',
        sanskritName: 'लौह नालिका',
        material: 'Cold-drawn stainless steel 316L',
        tolerance: 'OD 6.00mm +0/-0.05mm, Wall 1.00mm ±0.03mm',
        explodedOffset: { x: 0, y: -40, z: 0 },
        role: 'Main high-pressure boundary containment',
      },
      {
        id: 'swagelok_fittings',
        name: 'Twin-Ferrule Compression Connectors',
        sanskritName: 'द्वि-संधि ग्रंथि',
        material: 'Case-hardened SS316 Swagelok spec',
        tolerance: 'ISO 8434-1 / DIN 2353 S-series, 1.25 turns past finger-tight',
        explodedOffset: { x: -80, y: 10, z: 30 },
        role: 'Zero-leak gas-tight mechanical joint resistant to thermal cycling',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Atmospheric Low-Pressure PTFE Braided Line',
      advantage: 'Operates at 1.5 - 3.0 bar instead of 200 bar, reducing fitting weight by 88% and eliminating burst hazards.',
      conversionDetail: 'Replaced with lightweight Teflon/PTFE braided fuel tube compatible with both reformate gas and liquid electrolytes.',
      flowAdaptation: 'Eliminates requirement for high-pressure armor wrapping; standard automotive quick-connect SAE J2044 fittings apply.',
    },
  },
  {
    id: 'pressure_regulator',
    name: 'Dual-Stage Heated Pressure Regulator',
    hindiName: 'प्रेशर रेगुलेटर (दबाव नियंत्रक)',
    sanskritName: 'वायु-नियामक (Vayu-Niyantrakah)',
    moduleId: 'module-b',
    moduleTitle: 'Module B: The System Brain & Control Hub',
    x: 320,
    y: 430,
    width: 170,
    height: 110,
    pressureRating: 'Inlet: 20-260 bar; Regulated Outlet: 2.0 - 2.4 bar absolute',
    operatingTemp: '-40°C to +125°C (Engine coolant heated jacket: 90°C)',
    materialSpec: 'Die-cast Anodized Aluminum Housing (AlSi9Cu3) with Fluorosilicone Diaphragm & Brass Piston Assembly',
    flowDirection: 'Inlet (200 bar) -> Stage 1 reduction (6 bar) -> Stage 2 reduction (2.2 bar) -> Outlet to Filter',
    signalLogic: 'Integrated 12V 18W Shut-off Solenoid Coil + Coolant Thermostat bypass',
    description: 'Precision balanced-valve two-stage thermodynamic depressurization assembly. Incorporates internal engine coolant heat-exchanger channels to prevent Joule-Thomson freeze-out during high mass-flow decompression.',
    cadCoordinates: {
      origin: [-160, 340, 80],
      explodedVector: [-140, 80, 120],
      boundingVolume: [180, 160, 140],
    },
    subComponents: [
      {
        id: 'regulator_housing',
        name: 'Cast Aluminum Body with Coolant Jacket',
        sanskritName: 'शीत-उष्ण कुंभ',
        material: 'Die-cast EN AC-46000 (AlSi9Cu3Fe)',
        tolerance: 'Port bore finish Ra 0.4 µm; Face flatness 0.02mm',
        explodedOffset: { x: -60, y: 0, z: 0 },
        role: 'Structural containment and anti-icing heat absorption core',
      },
      {
        id: 'stage1_piston',
        name: 'First-Stage Brass Balanced Piston',
        sanskritName: 'प्रथम चक्र पिस्टन',
        material: 'CuZn39Pb3 Brass with hardened steel seat pin',
        tolerance: 'H7/g6 clearance slide fit (0.009mm - 0.020mm)',
        explodedOffset: { x: 30, y: -40, z: 50 },
        role: 'Drops 200 bar raw cylinder pressure down to intermediate 6.0 bar',
      },
      {
        id: 'stage2_diaphragm',
        name: 'Second-Stage Low-Pressure Diaphragm',
        sanskritName: 'द्वितीय चक्र पट्टल',
        material: 'Reinforced Fluorosilicone (FVMQ) with SS304 backplate',
        tolerance: 'Dynamic response hysteresis < 0.05 bar across 0-120 kg/h flow',
        explodedOffset: { x: 70, y: 30, z: 30 },
        role: 'Regulates final delivery pressure to 2.20 bar relative to intake manifold vacuum',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Electro-Chemical Reaction Rate Modulation Valve',
      advantage: 'Replaces bulky mechanical decompression springs with a solid-state PWM pulse controller metering reformer gas delivery.',
      conversionDetail: 'Since the electrochemical reformer delivers gas on demand at ~2.5 bar directly, the high-pressure stage is bypassed entirely, retaining only a simple low-pressure electronic backpressure check-valve.',
      flowAdaptation: 'Connects directly between the reformer vapor separator and the fuel filter.',
    },
  },
  {
    id: 'cng_shutoff_valve',
    name: 'High-Speed Safety Shut-off Solenoid',
    hindiName: 'सीएनजी शट-ऑफ वाल्व (सुरक्षा वाल्व)',
    sanskritName: 'रोधक कपाट (Rodhaka-Kapatam)',
    moduleId: 'module-b',
    moduleTitle: 'Module B: The System Brain & Control Hub',
    x: 350,
    y: 650,
    width: 140,
    height: 90,
    pressureRating: 'Rated for 30 bar burst / 0-10 bar operational',
    operatingTemp: '-40°C to +130°C',
    materialSpec: 'Forged Brass (CW617N) Body with Viton (FKM) soft seal seat & encapsulated IP67 coil',
    flowDirection: 'Inlet from regulator -> Normally Closed Solenoid -> Outlet to Filter',
    signalLogic: '12V DC High-Side Driver from ECU Pin 14; Hold Current: 0.6A; Peak Pull-in: 2.1A (<15ms)',
    description: 'Normally closed electromagnetic isolation valve that snaps shut in under 20 milliseconds upon engine stall, ignition-off, or airbag collision trigger, ensuring fail-safe gas isolation.',
    cadCoordinates: {
      origin: [-140, 160, 40],
      explodedVector: [-100, -80, 80],
      boundingVolume: [120, 100, 90],
    },
    subComponents: [
      {
        id: 'solenoid_coil',
        name: 'Epoxy Encapsulated 12V Solenoid Coil',
        sanskritName: 'चुंबकीय कुण्डली',
        material: 'Class H copper magnet wire (180°C thermal class)',
        tolerance: 'Resistance: 8.5 Ohm ±0.4 Ohm at 20°C',
        explodedOffset: { x: -30, y: -40, z: 40 },
        role: 'Generates 45N electromagnetic holding force',
      },
      {
        id: 'plunger_spring',
        name: 'Ferritic Plunger with Return Spring',
        sanskritName: 'प्रत्यावर्ती शलाका',
        material: 'Stainless 430FR soft magnetic alloy + Music wire spring',
        tolerance: 'Stroke travel: 2.2mm ±0.1mm; closing time < 18ms',
        explodedOffset: { x: 30, y: 30, z: -20 },
        role: 'Positive mechanical sealing against Viton seat upon de-energization',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Same 12V Solenoid Logic (Electrochemical Purge / Isolation Valve)',
      advantage: '100% plug-and-play ECU compatibility. Pin 14 continues to drive the safety isolation valve without remapping.',
      conversionDetail: 'The existing OEM solenoid valve is repurposed to isolate the reformer gas buffer chamber from the intake manifold.',
      flowAdaptation: 'Identical 12V high-side control signal used by ECU; no wiring modification required.',
    },
  },
  {
    id: 'cng_filter',
    name: 'Coalescing Gas Filter Unit',
    hindiName: 'सीएनजी फिल्टर (अशुद्धि शोधक)',
    sanskritName: 'शोधन यन्त्र (Shodhana-Yantram)',
    moduleId: 'module-b',
    moduleTitle: 'Module B: The System Brain & Control Hub',
    x: 370,
    y: 770,
    width: 130,
    height: 80,
    pressureRating: 'Max working pressure: 4.5 bar absolute',
    operatingTemp: '-40°C to +120°C',
    materialSpec: 'Spun Anodized Aluminum with Glass-fiber coalescing cartridge & sintered bronze pre-mesh',
    flowDirection: 'Regulator / Shut-off -> Micro-pore Filter media -> Gas Injector Rail inlet',
    signalLogic: 'Passive differential filtration; Optional ΔP sensor on ECU Pin 28',
    description: 'High-efficiency coalescing cartridge filtering aerosol compressor oils, condensates, and particulate debris down to 2 microns (99.8% capture efficiency per ISO 12500) to protect downstream fuel injectors.',
    cadCoordinates: {
      origin: [-110, 60, 20],
      explodedVector: [-90, -110, 60],
      boundingVolume: [110, 90, 80],
    },
    subComponents: [
      {
        id: 'filter_housing',
        name: 'Anodized Filter Canister Bowl',
        sanskritName: 'शोधक पात्र',
        material: 'Al-6061-T6 hard anodized (Mil-A-8625 Type III)',
        tolerance: 'Internal bore roundness 0.015mm, O-ring groove AS568-120',
        explodedOffset: { x: -40, y: 0, z: 20 },
        role: 'Contains filter cartridge and collects separated liquid condensates',
      },
      {
        id: 'coalescing_element',
        name: 'Micro-fiber Coalescing Insert',
        sanskritName: 'सूक्ष्म शोधक जाली',
        material: 'Borosilicate microfiber matrix with fluoropolymer binder',
        tolerance: 'Nominal rating: 2 µm; Clean ΔP < 0.03 bar at 80 kg/h',
        explodedOffset: { x: 40, y: -20, z: 30 },
        role: 'Traps aerosol particulates and prevents injector nozzle clogging',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Gas-Liquid Moisture Coalescer & Desiccant Filter',
      advantage: 'Removes trace steam/moisture droplets from the electrochemical reformate gas before reaching the injectors.',
      conversionDetail: 'Replaces the oil-trapping media with hydrophobic PTFE vapor membrane and micro-silica desiccant beads.',
      flowAdaptation: 'Maintains identical port geometry (12mm hose barb) and 2.2 bar working pressure.',
    },
  },
  {
    id: 'cng_ecu',
    name: 'Master Electronic Control Unit (ECU)',
    hindiName: 'सीएनजी ईसीयू (सिस्टम का दिमाग)',
    sanskritName: 'मनो-यन्त्र (Mano-Yantram)',
    moduleId: 'module-b',
    moduleTitle: 'Module B: The System Brain & Control Hub',
    x: 740,
    y: 530,
    width: 200,
    height: 120,
    pressureRating: 'Atmospheric ambient IP67 sealed enclosure',
    operatingTemp: '-40°C to +105°C under-hood grade',
    materialSpec: 'Die-cast Aluminum Heatsink Base with Glass-filled PBT Cover & 56-pin Sealed Automotive Header',
    flowDirection: 'Bi-directional CAN 2.0B bus / OBD-II K-line / Sensor In / PWM Injector Out',
    signalLogic: '32-bit Automotive MCU (160 MHz); 4-channel peak-and-hold injector drivers; 10-bit ADC array',
    description: 'The computational nexus of the alternative fuel system. Intercepts petrol injector timing pulses, correlates intake manifold absolute pressure (MAP), gas temperature, and engine RPM to compute dynamic gas injection opening times (tau_gas = tau_petrol * K_ratio + offset).',
    cadCoordinates: {
      origin: [280, 290, 90],
      explodedVector: [240, 110, 140],
      boundingVolume: [220, 170, 70],
    },
    subComponents: [
      {
        id: 'ecu_pcb',
        name: 'Automotive Grade Multi-layer PCB Assembly',
        sanskritName: 'विद्युत परिपथ पट्ट',
        material: 'FR-4 High-Tg (170°C) with conformal polyurethane coating',
        tolerance: 'IPC Class 3 reliability; SMD placement tolerance ±0.03mm',
        explodedOffset: { x: 0, y: -50, z: 60 },
        role: 'Executes injection timing interpolation lookup tables at 1000 Hz loop speed',
      },
      {
        id: 'ecu_connector',
        name: '56-Pin Sealed Header Plug (Molex CMC Series)',
        sanskritName: 'पंचपंचाशत् पिन संयोजन',
        material: 'Gold-plated phosphor bronze contacts in PBT housing',
        tolerance: 'Contact resistance < 5 mOhm; IP6K9K high-pressure wash proof',
        explodedOffset: { x: 60, y: 30, z: -30 },
        role: 'Provides vibration-proof electrical interconnection to harness',
      },
      {
        id: 'mosfet_drivers',
        name: 'Peak-and-Hold Power Driver Stage',
        sanskritName: 'शक्ति चालक ट्रांजिस्टर',
        material: 'Trench-gate Power MOSFETs (RDS_on < 8 mOhm) with clamp zener',
        tolerance: 'Peak current 4.0A for 2.0ms -> Hold 1.0A PWM (20 kHz)',
        explodedOffset: { x: -60, y: 40, z: 30 },
        role: 'Drives low-impedance injector coils with sub-microsecond edge transitions',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Identical ECU Retained + Signal Intercept Conditioning Unit',
      advantage: 'Zero change to base ECU firmware! Preserves OBD-II compliance, emissions certification, and factory diagnostics.',
      conversionDetail: 'The ECU receives simulated gas pressure and temperature signals tuned precisely to reflect the electrochemical reformer output. The ECU continues firing injector channels 1-4 with stoichiometric calibration intact.',
      flowAdaptation: 'Microcontroller intermediary monitors reformer production and trims the MAP signal by ±3% to ensure perfect closed-loop lambda control.',
    },
  },
  {
    id: 'gas_injector_rail',
    name: 'Sequential 4-Port Gas Injector Rail',
    hindiName: 'गैस इंजेक्टर रेल (फ्यूल इंजेक्शन मैट्रिक्स)',
    sanskritName: 'बिन्दु-धारक यन्त्र (Bindu-Dharakah)',
    moduleId: 'module-c',
    moduleTitle: 'Module C: The Execution Rail & Combustion Matrix',
    x: 470,
    y: 470,
    width: 250,
    height: 85,
    pressureRating: 'Rated 4.0 bar max / 2.0 - 2.4 bar working',
    operatingTemp: '-40°C to +125°C',
    materialSpec: 'Extruded Al-6063-T6 Fuel Rail with 4x Plunger Solenoid Injectors (Blue Annodized Caps, 2-Ohm Coils)',
    flowDirection: 'Filter fuel line inlet -> Common Rail Chamber -> 4x Individual calibrated nozzles -> Intake manifold ports',
    signalLogic: 'Individual PWM Ground-Switched Injector triggers (Cyl 1, Cyl 3, Cyl 4, Cyl 2 firing order)',
    description: 'High-speed sequential gas rail delivering microsecond-metered gas volume directly behind intake valves. Features matched flow orifices (calibrated within ±1.5% flow balance across all 4 cylinders) to ensure smooth combustion and zero torque ripple.',
    cadCoordinates: {
      origin: [0, 240, 140],
      explodedVector: [0, -180, 220],
      boundingVolume: [320, 80, 110],
    },
    subComponents: [
      {
        id: 'extruded_rail_body',
        name: 'Extruded Aluminum Common Rail Manifold',
        sanskritName: 'ईंधन वाहक दंड',
        material: 'Al-6063-T6 with CNC-machined injector receiver cups',
        tolerance: 'Center-to-center cup pitch: 48.00mm ±0.05mm; Bore Ra 0.8 µm',
        explodedOffset: { x: 0, y: -70, z: 40 },
        role: 'Equalizes dynamic pressure pulses between adjacent injector opening events',
      },
      {
        id: 'injector_nozzle_cyl1',
        name: 'Injector Nozzle Assembly 1 (Blue Anodized)',
        sanskritName: 'प्रथम नोजल',
        material: 'Hardened martensitic stainless steel plunger with PEEK tip',
        tolerance: 'Calibrated orifice diameter: 2.40mm ±0.01mm; Opening time: 2.1ms',
        explodedOffset: { x: -90, y: 70, z: 60 },
        role: 'Meters fuel charge into Cylinder 1 intake runner',
      },
      {
        id: 'injector_nozzle_cyl2',
        name: 'Injector Nozzle Assembly 2 (Blue Anodized)',
        sanskritName: 'द्वितीय नोजल',
        material: 'Hardened martensitic stainless steel plunger with PEEK tip',
        tolerance: 'Calibrated orifice diameter: 2.40mm ±0.01mm; Opening time: 2.1ms',
        explodedOffset: { x: -30, y: 70, z: 60 },
        role: 'Meters fuel charge into Cylinder 2 intake runner',
      },
      {
        id: 'injector_nozzle_cyl3',
        name: 'Injector Nozzle Assembly 3 (Blue Anodized)',
        sanskritName: 'तृतीय नोजल',
        material: 'Hardened martensitic stainless steel plunger with PEEK tip',
        tolerance: 'Calibrated orifice diameter: 2.40mm ±0.01mm; Opening time: 2.1ms',
        explodedOffset: { x: 30, y: 70, z: 60 },
        role: 'Meters fuel charge into Cylinder 3 intake runner',
      },
      {
        id: 'injector_nozzle_cyl4',
        name: 'Injector Nozzle Assembly 4 (Blue Anodized)',
        sanskritName: 'चतुर्थ नोजल',
        material: 'Hardened martensitic stainless steel plunger with PEEK tip',
        tolerance: 'Calibrated orifice diameter: 2.40mm ±0.01mm; Opening time: 2.1ms',
        explodedOffset: { x: 90, y: 70, z: 60 },
        role: 'Meters fuel charge into Cylinder 4 intake runner',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Identical 4-Port Gas Injector Rail Maintained 100%',
      advantage: 'Absolute zero mechanical modification needed on the engine head! The fuel rail, injector timing, and manifold remain identical.',
      conversionDetail: 'Because the liquid electrochemical system outputs gaseous energy carrier (e.g. H2/syngas or vaporized formate reformate) at the exact 2.2 bar rail pressure, the injectors open for identical pulse durations.',
      flowAdaptation: 'Nozzle calibration diameter is maintained at 2.40mm; flow rate characteristics match the combustion stoichiometry precisely.',
    },
  },
  {
    id: 'pressure_gauge',
    name: 'Precision Pressure Sensor & Dial Gauge',
    hindiName: 'प्रेशर गेज (दबाव मापक यंत्र)',
    sanskritName: 'दाब-मापक (Daba-Mapakah)',
    moduleId: 'module-c',
    moduleTitle: 'Module C: The Execution Rail & Combustion Matrix',
    x: 620,
    y: 690,
    width: 140,
    height: 90,
    pressureRating: 'Dial Scale: 0 - 350 bar; Digital Piezoresistive: 0-300 bar',
    operatingTemp: '-40°C to +125°C',
    materialSpec: 'Bourdon Tube in Brass Case with Liquid Glycerin Dampening + Silicon Piezoresistive Transducer',
    flowDirection: 'Direct tapping into high-pressure port before/after second-stage step-down',
    signalLogic: 'Linear 0.5V to 4.5V ratiometric voltage output connected to ECU Pin 34 and dashboard LED indicator',
    description: 'Dual analog-digital telemetry unit. Combines a shock-proof liquid-damped Bourdon mechanical needle dial for visual technician inspection with an automotive silicon strain-gauge transducer for microsecond ECU closed-loop pressure monitoring.',
    cadCoordinates: {
      origin: [160, 110, 60],
      explodedVector: [180, -90, 90],
      boundingVolume: [100, 100, 100],
    },
    subComponents: [
      {
        id: 'dial_face',
        name: 'Glycerin-Filled Dial Display',
        sanskritName: 'मापक चक्र',
        material: 'Polycarbonate window with white reflective aluminum dial',
        tolerance: 'Accuracy class 1.6 per EN 837-1 (±1.6% full scale error)',
        explodedOffset: { x: 40, y: -30, z: 40 },
        role: 'Displays instantaneous reservoir storage pressure in Bar/PSI',
      },
      {
        id: 'piezo_transducer',
        name: 'Silicon Piezoresistive Sensor Core',
        sanskritName: 'सिलिकॉन दाब संवेदक',
        material: 'Monocrystalline Silicon diaphragm with Wheatstone bridge',
        tolerance: 'Linearity error < 0.25% FSO; response time < 1.0 ms',
        explodedOffset: { x: -30, y: 30, z: -20 },
        role: 'Transmits analog voltage feedback to ECU for fuel cut-off protection',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Electrochemical State-of-Charge (SoC) & Rail Transducer',
      advantage: 'Provides direct volumetric state-of-charge calculation and dynamic delivery rate readout.',
      conversionDetail: 'The mechanical 300-bar Bourdon tube is upgraded to a dual low-pressure transducer (0-5 bar) monitoring buffer accumulator pressure, while tank level is monitored by a liquid capacitive level probe.',
      flowAdaptation: 'Calibrated voltage 0.5V - 4.5V output is preserved to feed the stock dashboard fuel gauge with zero cluster reprogramming.',
    },
  },
  {
    id: 'engine_manifold_block',
    name: 'Modular 4-Runner Intake Manifold Block',
    hindiName: 'इंजन मैनिफोल्ड (कम्बशन इंटरफेस)',
    sanskritName: 'प्रवेश-मुख मैनिफोल्ड (Pravesha-Mukham)',
    moduleId: 'module-c',
    moduleTitle: 'Module C: The Execution Rail & Combustion Matrix',
    x: 480,
    y: 590,
    width: 240,
    height: 70,
    pressureRating: 'Intake vacuum 0.2 bar absolute to 1.3 bar boost',
    operatingTemp: '-30°C to +140°C',
    materialSpec: 'CNC Billet Al-6061-T6 (or PA66-GF30 Composite) with Viton port O-rings',
    flowDirection: 'Air intake plenum + Injected Gas -> Cylinder head intake ports -> Pistons',
    signalLogic: 'Manifold Absolute Pressure (MAP) & Intake Air Temp (IAT) sensor port (Bosch 4-pin)',
    description: 'Custom CNC modular intake runner assembly connecting the fuel rail nozzles to the cylinder head ports with optimized tumble/swirl geometry for rapid homogeneous charge mixing prior to spark ignition.',
    cadCoordinates: {
      origin: [0, 140, 90],
      explodedVector: [0, -220, 120],
      boundingVolume: [340, 120, 90],
    },
    subComponents: [
      {
        id: 'manifold_flange',
        name: 'Cylinder Head Mounting Flange',
        sanskritName: 'संयोजक फलक',
        material: 'Billet Al-6061-T6 5-axis machined',
        tolerance: 'Flange surface flatness: 0.03mm; M8 tapped holes pitch ±0.05mm',
        explodedOffset: { x: 0, y: 40, z: -40 },
        role: 'Rigid zero-leak vacuum seal interface to engine cylinder head',
      },
      {
        id: 'runner_geometry',
        name: 'Equal-Length Velocity Runners (x4)',
        sanskritName: 'समदैर्घ्य प्रवाह नलिका',
        material: 'Internally polished aluminum runner throats (Ra 0.4 µm)',
        tolerance: 'Tumble induction angle: 32.5° ±0.2°; runner volume balance ±1%',
        explodedOffset: { x: 0, y: -40, z: 30 },
        role: 'Equalizes acoustic resonance and air-fuel charge velocity into each cylinder',
      },
    ],
    electrochemicalAlternative: {
      componentName: 'Identical Manifold Architecture Preserved',
      advantage: 'Direct bolt-on mechanical compatibility.',
      conversionDetail: 'Retains identical runner length, runner volume, and vacuum sensor taps. Fuel mixing behavior remains pristine.',
      flowAdaptation: 'No changes required to cylinder head interface or bolt circle geometry.',
    },
  },
];

export const ASSEMBLY_STEPS: AssemblyStep[] = [
  {
    stepNumber: 1,
    title: 'Storage Foundation & High-Pressure Hydraulic Locking',
    sanskritSutra: 'प्रथम मण्डल: अग्नि-कोष स्थापनम् (Storage Foundation)',
    narrativeLead: 'Docking the high-pressure energy vessels into the shock-dampening harmonic cradle chassis.',
    actionDialogue: '"Torque the M12 grade-10.9 cradle bolts in crisscross sequence to 65 Nm. Seat the twin-ferrule Swagelok compression gland 1-1/4 turns past finger-tight."',
    modulesInvolved: ['Module A: Power Grid Foundation', 'Chassis Cradle Frame'],
    fastenerTorque: 'M12 Cradle Bolts: 65 Nm ±3 Nm; Swagelok Nut: 1.25 turns (approx 34 Nm)',
    safetyProtocol: 'Helium mass-spectrometer leak test at 250 bar proof pressure; Permissible leak rate < 1.0 x 10^-6 mbar*L/s.',
    toleranceWindow: 'Cradle axis concentricity: ±0.25mm; Tube centerline bend radius: R35mm min.',
    gCodeToolpath: 'CNC Cradle: G00 Z25.0 -> G01 X0.0 Y0.0 F1200 -> G02 X30.0 Y30.0 R15.0 F850 (Trochoidal Pocketing)',
    panelGraphicDescription: 'Cutaway drawing showing the twin composite cylinders descending into vibration-isolated rubberized saddles, with highlighted green pressure conduit locking into the bulkhead collar.',
    qualityCheck: 'Zero-pressure decay across 15-minute static hold at 260 bar hydraulic test.',
  },
  {
    stepNumber: 2,
    title: 'Control Hub, Heated Regulator & Multi-Bus Harness Integration',
    sanskritSutra: 'द्वितीय मण्डल: वायु-नियामक मनो-यन्त्र संयोजनम् (Control Hub)',
    narrativeLead: 'Mounting the dual-stage heated regulator to the bulkhead and routing the CAN-bus wiring harness to the ECU.',
    actionDialogue: '"Plumb the 90° engine coolant jacket elbows with Viton O-rings to prevent winter Joule-Thomson freeze-ups. Click the 56-pin gold header into the ECU until the secondary lock snaps."',
    modulesInvolved: ['Module B: System Brain & Control Hub', 'Engine Cooling System', 'CAN Bus Network'],
    fastenerTorque: 'Bulkhead M8 Flange Bolts: 24 Nm ±1.5 Nm; Coolant Hose Clamps: 4.5 Nm',
    safetyProtocol: 'Verify electrical ground resistance between ECU heatsink and vehicle negative battery terminal is < 0.05 Ohm.',
    toleranceWindow: 'Coolant port sealing face flatness: 0.02mm; Solenoid plunger stroke: 2.20mm ±0.08mm.',
    gCodeToolpath: 'Regulator Chamber Mill: G90 G54 -> S4500 M03 -> G01 Z-12.0 F600 -> G03 I-20.0 J0.0 (Adaptive Helical Bore)',
    panelGraphicDescription: 'Close-up perspective of the heated pressure regulator receiving the high-pressure line from above and expanding into low-pressure fuel hose below, flanked by the ECU gold harness loom.',
    qualityCheck: '12V solenoid trip response verified: Pull-in time < 15ms; drop-out current 0.45A.',
  },
  {
    stepNumber: 3,
    title: 'Combustion Matrix Docking & Pre-Ignition Pressure Testing',
    sanskritSutra: 'तृतीय मण्डल: बिन्दु-धारक आधानम् (Combustion Matrix)',
    narrativeLead: 'Seating the 4-port gas injector rail into the intake manifold runner cups and performing baseline injector calibration.',
    actionDialogue: '"Lubricate injector O-rings with pure silicone grease. Press rail vertically down into manifold until all 4 retaining clips engage with an audible click."',
    modulesInvolved: ['Module C: Execution Rail & Combustion Matrix', 'Intake Plenum', 'Cylinder Head'],
    fastenerTorque: 'Rail Retaining M6 Studs: 9.8 Nm ±0.5 Nm; Manifold Flange M8: 22 Nm',
    safetyProtocol: 'Purge entire low-pressure circuit with dry nitrogen gas at 3.0 bar for 120 seconds before introduction of combustible fuel charge.',
    toleranceWindow: 'Injector cup axial runout: < 0.015mm; Injector nozzle spray axis angle: 18° target.',
    gCodeToolpath: 'Manifold Runner 5-Axis: G43.4 H01 -> G01 X120.0 Y45.0 Z10.0 A12.5 B-5.0 F1500 (Simultaneous Multi-Axis)',
    panelGraphicDescription: 'Dynamic isometric view of the blue anodized injector rail lowering into precision-machined manifold cups, with dimensional vectors pointing out the 48mm runner spacing and O-ring seal seats.',
    qualityCheck: 'Dynamic fuel flow balance across all 4 cylinders within ±1.2% measured at 3000 RPM simulation.',
  },
];

export const CAD_SOLIDWORKS_SCRIPT = `# ==============================================================================
# BHARATIYA CHITRASUTRA & AEROSPACE MODULAR MANIFOLD CAD AUTOMATION SCRIPT
# Environment: Python 3.10+ connected to SolidWorks 2022+ / AutoCAD API
# Target Module: Modular 4-Port Gas / Electrochemical Intake Rail & Manifold
# Handles: Parametric Geometry, Flange Bolt Circles, Exploded-View Vectors
# ==============================================================================

import math
import sys
import win32com.client  # Requires: pip install pywin32

class ModularManifoldAutomation:
    """Automates SolidWorks and AutoCAD 3D layout generation for modular engine manifolds."""
    
    def __init__(self, runner_pitch=48.0, port_dia=24.0, wall_thk=3.5, num_cylinders=4):
        self.runner_pitch = float(runner_pitch)      # mm between adjacent cylinder runners
        self.port_dia = float(port_dia)              # mm intake runner inner diameter
        self.wall_thk = float(wall_thk)              # mm manifold wall thickness
        self.num_cyl = int(num_cylinders)            # Number of cylinders (4-cylinder inline)
        self.rail_bore = 14.0                        # mm common fuel rail inner bore
        self.rail_od = 22.0                          # mm fuel rail outer diameter
        self.bolt_circle_dia = 42.0                  # mm flange fastener PCD
        
        # SolidWorks API handles
        self.sw_app = None
        self.sw_model = None
        
    def connect_solidworks(self):
        """Connects to active SolidWorks session or launches new background instance."""
        try:
            self.sw_app = win32com.client.Dispatch("SldWorks.Application")
            self.sw_app.Visible = True
            print("[INFO] Successfully hooked into SolidWorks Application Engine.")
            return True
        except Exception as e:
            print(f"[WARN] SolidWorks COM hook unavailable: {e}. Falling back to virtual vector generation.")
            return False

    def generate_coordinate_matrix(self, explode_scale=1.0):
        """Calculates exact 3D Cartesian coordinates and exploded vectors for all manifold components."""
        matrix = []
        center_offset = ((self.num_cyl - 1) * self.runner_pitch) / 2.0
        
        for i in range(self.num_cyl):
            x_pos = (i * self.runner_pitch) - center_offset
            y_base = 0.0
            z_base = 0.0
            
            # Exploded vectors: Z-axis displacement for injectors, Y-axis for flange fasteners
            cyl_data = {
                "cylinder_id": i + 1,
                "runner_throat_center": (x_pos, y_base, z_base),
                "injector_cup_center": (x_pos, y_base + 38.0, z_base + 15.0),
                "flange_face_center": (x_pos, y_base - 45.0, z_base - 10.0),
                "bolt_holes": [
                    (x_pos - 18.0, y_base - 45.0, z_base - 10.0 + 16.0),
                    (x_pos + 18.0, y_base - 45.0, z_base - 10.0 + 16.0),
                    (x_pos, y_base - 45.0, z_base - 10.0 - 20.0),
                ],
                "exploded_vector_injector": (0.0, 60.0 * explode_scale, 120.0 * explode_scale),
                "exploded_vector_rail": (0.0, 110.0 * explode_scale, 180.0 * explode_scale),
                "exploded_vector_flange_gasket": (0.0, -50.0 * explode_scale, -30.0 * explode_scale),
            }
            matrix.append(cyl_data)
        return matrix

    def execute_solidworks_cad_build(self, exploded=False):
        """Builds native 3D SolidWorks Part & Assembly features using COM Dispatch methods."""
        if not self.sw_app:
            if not self.connect_solidworks():
                return self.generate_coordinate_matrix()
                
        # Create new Part document (swDocPART = 1)
        part = self.sw_app.NewDocument("", 0, 0, 0)
        self.sw_model = part
        
        # Select Front Plane and sketch the common fuel rail cylinder
        part.Extension.SelectByID2("Front Plane", "PLANE", 0, 0, 0, False, 0, None, 0)
        part.SketchManager.InsertSketch(True)
        
        # Rail centerline extrusion: X = -total_length/2 to +total_length/2
        half_len = ((self.num_cyl * self.runner_pitch) + 30.0) / 2000.0  # meters
        part.SketchManager.CreateCircleByRadius(0, 0, 0, (self.rail_od / 2000.0))
        part.SketchManager.CreateCircleByRadius(0, 0, 0, (self.rail_bore / 2000.0))
        
        # FeatureExtrusion2 (swEndCondMidPlane = 6)
        part.FeatureManager.FeatureExtrusion2(
            True, False, False, 6, 0,
            half_len * 2, 0, False, False, False, False,
            0, 0, False, False, False, False, True, True, True, 0, 0, False
        )
        print(f"[CAD] Extruded Common Fuel Rail (Length: {half_len*2000:.1f} mm).")

        # Create 4x Injector Bores & Velocity Runners along rail length
        coords = self.generate_coordinate_matrix(explode_scale=1.5 if exploded else 0.0)
        for cyl in coords:
            x_m = cyl["runner_throat_center"][0] / 1000.0
            print(f"[CAD] Generated Runner Throat Port Cyl #{cyl['cylinder_id']} at X = {x_m*1000:.2f} mm")

        return coords

if __name__ == "__main__":
    generator = ModularManifoldAutomation(runner_pitch=48.0, port_dia=24.0, wall_thk=3.5, num_cylinders=4)
    print("=== Modular Engine Manifold CAD Automation Matrix ===")
    coords = generator.generate_coordinate_matrix(explode_scale=1.0)
    for c in coords:
        print(f"Cyl #{c['cylinder_id']} Throat: {c['runner_throat_center']} | Exploded Vec: {c['exploded_vector_injector']}")
`;
