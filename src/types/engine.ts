export type EngineModuleId = 'module-a' | 'module-b' | 'module-c';

export type FlowType = 'cng_gas' | 'electrochemical' | 'electrical_pulse' | 'pressure_gradient' | 'mhd_molten_salt' | 'lorentz_field';

export type PropulsionArchitecture = 'mhd_smr_nuclear' | 'flex_fuel_electrochemical';

export interface SubComponent {
  id: string;
  name: string;
  sanskritName: string;
  material: string;
  tolerance: string;
  explodedOffset: { x: number; y: number; z: number };
  role: string;
}

export interface EngineComponent {
  id: string;
  name: string;
  hindiName: string;
  sanskritName: string;
  moduleId: EngineModuleId;
  moduleTitle: string;
  x: number; // Normalized canvas coordinate (0 to 3000)
  y: number; // Normalized canvas coordinate (0 to 1000)
  width: number;
  height: number;
  pressureRating: string;
  operatingTemp: string;
  materialSpec: string;
  flowDirection: string;
  signalLogic: string;
  description: string;
  subComponents: SubComponent[];
  cadCoordinates: {
    origin: [number, number, number];
    explodedVector: [number, number, number];
    boundingVolume: [number, number, number];
  };
  electrochemicalAlternative: {
    componentName: string;
    advantage: string;
    conversionDetail: string;
    flowAdaptation: string;
  };
}

export interface AssemblyStep {
  stepNumber: number;
  title: string;
  sanskritSutra: string;
  narrativeLead: string;
  actionDialogue: string;
  modulesInvolved: string[];
  fastenerTorque: string;
  safetyProtocol: string;
  toleranceWindow: string;
  gCodeToolpath: string;
  panelGraphicDescription: string;
  qualityCheck: string;
}

export interface CadParameterConfig {
  runnerSpacingMm: number;
  portDiameterMm: number;
  manifoldWallThicknessMm: number;
  railBoreDiameterMm: number;
  explodedDistanceFactor: number;
  selectedCadSystem: 'solidworks' | 'autocad' | 'generic_python';
}
