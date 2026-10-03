import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { EngineComponent, FlowType, PropulsionArchitecture } from '../types/engine';
import { ENGINE_COMPONENTS } from '../data/engineData';
import { ThermodynamicMonitor } from './ThermodynamicMonitor';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders, 
  Activity,
  Unlock,
  Lock,
  Thermometer,
  AlertTriangle,
  Move,
  Layers,
  Sparkles,
  Zap,
  Gauge,
  Flame,
  Radio,
  Eye,
  ShieldAlert,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';

interface ChitrasutraCanvasProps {
  onSelectComponent: (component: EngineComponent) => void;
  selectedComponentId: string | null;
}

interface Particle {
  x: number;
  y: number;
  pathIndex: number;
  progress: number;
  speed: number;
  type: FlowType;
}

export const ChitrasutraCanvas: React.FC<ChitrasutraCanvasProps> = ({
  onSelectComponent,
  selectedComponentId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Persistent Proprietary IP Notice & Legal Firewall Modal State
  const [showIpModal, setShowIpModal] = useState<boolean>(false);
  const [hasInteractedOnce, setHasInteractedOnce] = useState<boolean>(false);
  const [copiedLegalNotice, setCopiedLegalNotice] = useState<boolean>(false);

  const registerUserInteraction = () => {
    if (!hasInteractedOnce) {
      setHasInteractedOnce(true);
      setShowIpModal(true);
    }
  };

  // Propulsion Architecture Mode (MHD-SMR Nuclear Battery vs Classical Flex-Fuel)
  const [propulsionMode, setPropulsionMode] = useState<PropulsionArchitecture>('mhd_smr_nuclear');
  const [showPlanetariumDome, setShowPlanetariumDome] = useState<boolean>(true);
  const [showMhdHud, setShowMhdHud] = useState<boolean>(true);

  // Viewport transforms (Pan & Zoom)
  const [scale, setScale] = useState<number>(0.82);
  const [panX, setPanX] = useState<number>(-40);
  const [panY, setPanY] = useState<number>(-20);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Interactive Exploded Vector displacement (0 to 100%)
  const [explodedFactor, setExplodedFactor] = useState<number>(0.35);

  // Flow simulation mode
  const [activeFlow, setActiveFlow] = useState<FlowType>('mhd_molten_salt');
  const [isFlowPlaying, setIsFlowPlaying] = useState<boolean>(true);

  // Matter.js Physics State
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(true);
  const [gravityStrength, setGravityStrength] = useState<number>(0.8);
  const [springStiffness, setSpringStiffness] = useState<number>(0.04); // Resistance stiffness
  const [detachedComponents, setDetachedComponents] = useState<Set<string>>(new Set());

  // Mouse drag constraint state
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [currentTensionForce, setCurrentTensionForce] = useState<number>(0);

  // Live CNC Machine Toolpath Tracer Animation
  const [isCncSimulating, setIsCncSimulating] = useState<boolean>(true);
  const cncAnimationIndexRef = useRef<number>(0);
  const cncCuttingHeadRef = useRef<{ x: number; y: number }>({ x: 600, y: 400 });

  // Live Core Thermal Telemetry & > 820K Critical Alert System
  const [showThermalSidebar, setShowThermalSidebar] = useState<boolean>(true);
  const [coreTemperatureK, setCoreTemperatureK] = useState<number>(765.0);
  const [forceThermalSurge, setForceThermalSurge] = useState<boolean>(false);
  const thermalHistoryRef = useRef<number[]>(Array(40).fill(765.0));

  // Live MHD Velocity, Voltage & Power telemetry states (calibrated to SolidWorks VBA API)
  const [liveMhdVelocity, setLiveMhdVelocity] = useState<number>(90.62);
  const [liveMhdVoltage, setLiveMhdVoltage] = useState<number>(218.45);
  const [liveMhdPower, setLiveMhdPower] = useState<number>(95.43);

  // Hovered component
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Firing cylinder counter for ECU ignition pulses
  const firingCycleRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Matter.js refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesMapRef = useRef<Map<string, { 
    body: Matter.Body; 
    comp: EngineComponent; 
    springConstraint: Matter.Constraint 
  }>>(new Map());
  const mouseSpringRef = useRef<Matter.Constraint | null>(null);

  // Virtual Canvas dimensions
  const VIRTUAL_WIDTH = 2400;
  const VIRTUAL_HEIGHT = 1200;

  // Central Engine Block Anchor Coordinate (The physical reference boss)
  const ENGINE_BLOCK_ANCHOR = { x: 590, y: 620 };

  // CNC Toolpath Checkpoint Vectors along engine manifold profile
  const cncToolpathPoints = [
    { x: 600, y: 400 },
    { x: 800, y: 400 },
    { x: 1200, y: 250 },
    { x: 1800, y: 550 },
    { x: 2400, y: 400 },
    { x: 3400, y: 400 },
    { x: 3900, y: 350 },
    { x: 4200, y: 450 }
  ];

  // Initialize Matter.js Physics Engine, World, and Spring Constraints
  useEffect(() => {
    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: gravityStrength,
        scale: 0.001,
      },
    });
    engineRef.current = engine;

    // Rigid Chassis Boundaries (Engine bay floor & walls)
    const wallThick = 120;
    const floorY = 1080;
    const floor = Matter.Bodies.rectangle(VIRTUAL_WIDTH / 2, floorY, VIRTUAL_WIDTH * 1.5, wallThick, { 
      isStatic: true,
      friction: 0.8,
      label: 'CHASSIS_FLOOR'
    });
    const ceiling = Matter.Bodies.rectangle(VIRTUAL_WIDTH / 2, -wallThick / 2, VIRTUAL_WIDTH * 1.5, wallThick, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(-wallThick / 2, VIRTUAL_HEIGHT / 2, wallThick, VIRTUAL_HEIGHT * 1.5, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(VIRTUAL_WIDTH + wallThick / 2, VIRTUAL_HEIGHT / 2, wallThick, VIRTUAL_HEIGHT * 1.5, { isStatic: true });

    Matter.World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Map each engine component as a Matter.js Rigid Body with Spring Constraint relative to the engine block
    const newMap = new Map();
    ENGINE_COMPONENTS.forEach((comp) => {
      const [vx, vy] = comp.cadCoordinates.explodedVector;
      const initX = comp.x + comp.width / 2 + (vx * explodedFactor) / 2.2;
      const initY = comp.y + comp.height / 2 + (vy * explodedFactor) / 2.2;

      // Component rigid body
      const body = Matter.Bodies.rectangle(initX, initY, comp.width, comp.height, {
        isStatic: true, // starts pinned until clicked / detached
        chamfer: { radius: 8 },
        frictionAir: 0.04,
        restitution: 0.5,
        density: comp.id === 'cng_cylinders' ? 0.004 : 0.002,
        label: comp.id,
      });

      // Spring Constraint connecting body relative to its mounting boss on the engine block
      const anchorPoint = { 
        x: comp.x + comp.width / 2, 
        y: comp.y + comp.height / 2 
      };

      const springConstraint = Matter.Constraint.create({
        pointA: anchorPoint,
        bodyB: body,
        pointB: { x: 0, y: 0 },
        stiffness: springStiffness,
        damping: 0.08,
        length: Math.hypot((vx * explodedFactor) / 2.2, (vy * explodedFactor) / 2.2),
      });

      Matter.World.add(engine.world, [body, springConstraint]);
      newMap.set(comp.id, { body, comp, springConstraint });
    });

    bodiesMapRef.current = newMap;

    return () => {
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Sync gravity strength changes
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.gravity.y = gravityStrength;
  }, [gravityStrength]);

  // Sync spring stiffness changes
  useEffect(() => {
    bodiesMapRef.current.forEach(({ springConstraint }) => {
      springConstraint.stiffness = springStiffness;
    });
  }, [springStiffness]);

  // Sync detached components with Matter.js body `isStatic` property
  useEffect(() => {
    bodiesMapRef.current.forEach(({ body }, compId) => {
      const isDetached = detachedComponents.has(compId);
      Matter.Body.setStatic(body, !isDetached);
      if (isDetached && body.velocity.y === 0) {
        Matter.Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.015,
          y: -0.01 * (body.mass || 1)
        });
      }
    });
  }, [detachedComponents]);

  // When explodedFactor changes, update coordinates of pinned components
  useEffect(() => {
    bodiesMapRef.current.forEach(({ body, comp, springConstraint }, compId) => {
      const [vx, vy] = comp.cadCoordinates.explodedVector;
      const targetLen = Math.hypot((vx * explodedFactor) / 2.2, (vy * explodedFactor) / 2.2);
      springConstraint.length = targetLen;

      if (!detachedComponents.has(compId)) {
        const targetX = comp.x + comp.width / 2 + (vx * explodedFactor) / 2.2;
        const targetY = comp.y + comp.height / 2 + (vy * explodedFactor) / 2.2;
        Matter.Body.setPosition(body, { x: targetX, y: targetY });
        Matter.Body.setAngle(body, 0);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
      }
    });
  }, [explodedFactor, detachedComponents]);

  // Detach / Pin a specific component
  const toggleComponentDetach = (compId: string) => {
    setDetachedComponents((prev) => {
      const next = new Set(prev);
      if (next.has(compId)) {
        next.delete(compId);
        const item = bodiesMapRef.current.get(compId);
        if (item) {
          const { body, comp } = item;
          const [vx, vy] = comp.cadCoordinates.explodedVector;
          const targetX = comp.x + comp.width / 2 + (vx * explodedFactor) / 2.2;
          const targetY = comp.y + comp.height / 2 + (vy * explodedFactor) / 2.2;
          Matter.Body.setPosition(body, { x: targetX, y: targetY });
          Matter.Body.setAngle(body, 0);
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(body, 0);
          Matter.Body.setStatic(body, true);
        }
      } else {
        next.add(compId);
        const item = bodiesMapRef.current.get(compId);
        if (item) {
          Matter.Body.setStatic(item.body, false);
        }
      }
      return next;
    });
  };

  // Detach All Components
  const handleDetachAll = () => {
    const allIds = new Set(ENGINE_COMPONENTS.map(c => c.id));
    setDetachedComponents(allIds);
    bodiesMapRef.current.forEach(({ body }) => {
      Matter.Body.setStatic(body, false);
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.03,
        y: -0.02 * (body.mass || 1)
      });
    });
  };

  // Pin All Back to Blueprint Foundation
  const handlePinAllBack = () => {
    setDetachedComponents(new Set());
    bodiesMapRef.current.forEach(({ body, comp }) => {
      const [vx, vy] = comp.cadCoordinates.explodedVector;
      const targetX = comp.x + comp.width / 2 + (vx * explodedFactor) / 2.2;
      const targetY = comp.y + comp.height / 2 + (vy * explodedFactor) / 2.2;
      Matter.Body.setPosition(body, { x: targetX, y: targetY });
      Matter.Body.setAngle(body, 0);
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setStatic(body, true);
    });
  };

  // Apply outward kinetic blast impulse
  const handleScatterImpulse = () => {
    if (!engineRef.current) return;
    bodiesMapRef.current.forEach(({ body, comp }, compId) => {
      if (!detachedComponents.has(compId)) {
        toggleComponentDetach(compId);
      }
      const [vx, vy] = comp.cadCoordinates.explodedVector;
      const angle = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.5;
      const forceMag = 0.05 * (body.mass || 1);
      Matter.Body.applyForce(body, body.position, {
        x: Math.cos(angle) * forceMag,
        y: Math.sin(angle) * forceMag,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
    });
  };

  // Live Fluid particles initialization
  useEffect(() => {
    const pts: Particle[] = [];
    for (let i = 0; i < 75; i++) {
      pts.push({
        x: 0,
        y: 0,
        pathIndex: i % 4,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
        type: activeFlow,
      });
    }
    particlesRef.current = pts;
  }, [activeFlow]);

  // Real-Time Temperature Waveform at 10Hz with >820K Critical Alert Trap & Live MHD Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      let baseHeat = forceThermalSurge ? 850.0 : (propulsionMode === 'mhd_smr_nuclear' ? 765.0 : 720.0);
      let fluctuation = (Math.random() - 0.5) * (forceThermalSurge ? 14 : 9);
      let currentVal = baseHeat + fluctuation;
      setCoreTemperatureK(currentVal);

      // Slide array left and push new reading
      thermalHistoryRef.current.push(currentVal);
      thermalHistoryRef.current.shift();

      // Compute live MHD fluid flow velocity and induced voltage/power
      const baseV = forceThermalSurge ? 151.25 : 90.62;
      const v = baseV + (Math.random() - 0.5) * 1.8;
      setLiveMhdVelocity(v);
      // Faraday induction V = B * v * L (B = 4.2 Tesla, L = 0.5734 meters -> 218.45 V at 90.62 m/s)
      const voltage = 4.2 * v * 0.5734;
      setLiveMhdVoltage(voltage);
      // Net generated power P = V * I = V^2 / R (R = 0.5 Ohm loop resistance -> 95.43 kW)
      const current = voltage / 0.5;
      const powerKw = (voltage * current) / 1000;
      setLiveMhdPower(powerKw);
    }, 100); // 100ms = 10Hz
    return () => clearInterval(interval);
  }, [forceThermalSurge, propulsionMode]);

  const isThermalSurge = coreTemperatureK > 820.0;

  // Main Canvas Render Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Step Matter.js physics engine
      if (engineRef.current && isPhysicsActive) {
        Matter.Engine.update(engineRef.current, 1000 / 60);
      }

      // Responsive canvas resizing
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background: If thermal surge, subtly tint red
      ctx.fillStyle = isThermalSurge ? '#16080A' : '#0C0C0E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Pan & Zoom
      ctx.translate(canvas.width / 2 + panX, canvas.height / 2 + panY);
      ctx.scale(scale, scale);
      ctx.translate(-VIRTUAL_WIDTH / 2, -VIRTUAL_HEIGHT / 2);

      // 1. Draw Raw Textured Khadi Canvas Grid & Chitrasutra Symmetries
      drawKhadiCanvasGrid(ctx, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // 2. Draw Chassis Floor Barrier
      drawChassisFloorBed(ctx, VIRTUAL_WIDTH, 1080);

      // 3. Draw Engine Block Central Boss Mount
      drawEngineBlockAnchor(ctx, ENGINE_BLOCK_ANCHOR.x, ENGINE_BLOCK_ANCHOR.y);

      // 4. Draw Layer 1 & Layer 2: Electric Cyan and Terracotta Connectivity Paths
      drawLayeredChitrasutraPaths(ctx);

      // 5. Draw Dynamic Spring Constraints relative to Engine Block
      drawPhysicalSpringConstraints(ctx, ENGINE_BLOCK_ANCHOR);

      // 6. Draw Live CNC Machine Toolpath Cutting Head
      if (isCncSimulating) {
        drawLiveCncToolpathTracer(ctx);
      }

      // 7. Draw Fluid Flow Particles
      if (isFlowPlaying) {
        updateAndDrawParticles(ctx, particlesRef.current, activeFlow);
        firingCycleRef.current += 0.05;
      }

      // 8. Draw Engine Components (Synchronized with Matter.js physics positions)
      drawPhysicsComponents(ctx, hoveredId, selectedComponentId, detachedComponents);

      // 9. Draw Layer 3: Injector Node Exploded Vector Alignment Arrows
      drawInjectorNodeArrows(ctx);

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [scale, panX, panY, explodedFactor, activeFlow, isFlowPlaying, isPhysicsActive, detachedComponents, hoveredId, selectedComponentId, isCncSimulating, isThermalSurge, springStiffness, propulsionMode, showPlanetariumDome]);

  // Helper: Draw Khadi Textured Canvas Grid & Planetarium Glass Dome Research Reticle
  const drawKhadiCanvasGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(143, 113, 66, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Concentric Yantra symmetry guides
    const centerX = 640;
    const centerY = 580;
    ctx.strokeStyle = 'rgba(195, 82, 55, 0.12)';
    ctx.setLineDash([4, 6]);
    [160, 280, 440, 620].forEach((r) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Planetarium Glass Dome Laboratory Vault Lines & Lost-Wax Bronze Casing Motif
    if (propulsionMode === 'mhd_smr_nuclear' && showPlanetariumDome) {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.09)';
      ctx.lineWidth = 1.5;
      for (let rad = 350; rad <= 1650; rad += 260) {
        ctx.beginPath();
        ctx.arc(w / 2, -180, rad, 0, Math.PI);
        ctx.stroke();
      }
      for (let ang = -0.7; ang <= 0.7; ang += 0.22) {
        ctx.beginPath();
        ctx.moveTo(w / 2, -180);
        ctx.lineTo(w / 2 + Math.sin(ang) * 1600, -180 + Math.cos(ang) * 1600);
        ctx.stroke();
      }

      ctx.font = '600 11px Cinzel, serif';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.65)';
      ctx.fillText('✦ PLANETARIUM GLASS DOME RESEARCH SETUP · LOST-WAX CAST BRONZE/COPPER HOUSING (मधुच्छिष्ट-विधानम्) ✦', 140, 48);
    }

    // Module Boundary Markers
    ctx.font = '700 13px Cinzel, serif';
    if (propulsionMode === 'mhd_smr_nuclear') {
      ctx.fillStyle = '#39FF14';
      ctx.fillText('मॉड्यूल क · MODULE A: CORE FISSION & MOLTEN SALT STORAGE MATRIX (पिघला हुआ नमक)', 140, 95);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('मॉड्यूल ख · MODULE B: MHD ELECTROMAGNETIC CONTROL GRID (चुंबकीय नियंत्रण)', 140, 410);
      ctx.fillStyle = '#FF9900';
      ctx.fillText('मॉड्यूल ग · MODULE C: MULTI-PULL GLASS-INSULATED INDUCTION RAILS (शून्य-घर्षण विद्युत)', 140, 960);
    } else {
      ctx.fillStyle = '#C35237';
      ctx.fillText('ମଣ୍ଡଳ କ · MODULE A: ENERGY COLLECTION & STORAGE', 140, 95);
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('ମଣ୍ଡଳ ଖ · MODULE B: DYNAMIC CONTROL HUBS & SENSORS', 140, 410);
      ctx.fillStyle = '#8F7142';
      ctx.fillText('ମଣ୍ଡଳ ଗ · MODULE C: THE EXPLODED MULTI-POINT INJECTOR RAIL', 140, 960);
    }
    ctx.restore();
  };

  // Helper: Draw Engine Block Boss Anchor
  const drawEngineBlockAnchor = (ctx: CanvasRenderingContext2D, ax: number, ay: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(31, 40, 51, 0.85)';
    ctx.beginPath();
    ctx.arc(ax, ay, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#C35237';
    ctx.beginPath();
    ctx.arc(ax, ay, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('ENGINE BLOCK', ax, ay - 32);
    ctx.fillText('M10 BOSS ANCHOR', ax, ay - 20);
    ctx.restore();
  };

  // Helper: Draw Dynamic Matter.js Spring Constraints relative to Engine Block
  const drawPhysicalSpringConstraints = (ctx: CanvasRenderingContext2D, engineBoss: { x: number; y: number }) => {
    ctx.save();
    bodiesMapRef.current.forEach(({ body, comp, springConstraint }, compId) => {
      const isDetached = detachedComponents.has(compId);
      const isDragged = draggedCompId === compId;

      // Anchor point (boss mount)
      const ax = springConstraint.pointA.x;
      const ay = springConstraint.pointA.y;
      // Body center
      const bx = body.position.x;
      const by = body.position.y;

      const dist = Math.hypot(bx - ax, by - ay);
      const restLen = springConstraint.length || 1;
      const stretchDelta = dist - restLen;

      // Draw spring coil if detached, dragged, or stretched
      if (isDetached || isDragged || Math.abs(stretchDelta) > 10) {
        const tensionRatio = Math.min(Math.max(stretchDelta / 200, 0), 1);
        ctx.strokeStyle = tensionRatio > 0.6 ? '#EF4444' : tensionRatio > 0.25 ? '#F59E0B' : '#00E5FF';
        ctx.lineWidth = isDragged ? 3 : 1.5;

        // Draw dynamic physical spring zigzag coils
        const coils = 12;
        const dx = bx - ax;
        const dy = by - ay;
        const normalX = -dy / dist;
        const normalY = dx / dist;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        for (let i = 1; i <= coils; i++) {
          const t = i / (coils + 1);
          const coilOffset = (i % 2 === 0 ? 1 : -1) * 8 * (1 - tensionRatio * 0.4);
          const px = ax + dx * t + normalX * coilOffset;
          const py = ay + dy * t + normalY * coilOffset;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Tension force telemetry tag
        const tensionForceN = (dist * springStiffness * 0.85).toFixed(1);
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillStyle = tensionRatio > 0.6 ? '#FCA5A5' : '#FDE68A';
        ctx.fillText(`SPRING: ${tensionForceN} N`, (ax + bx) / 2 + 10, (ay + by) / 2 - 8);

        // Also draw secondary resistance line to central engine block if dragged
        if (isDragged) {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(engineBoss.x, engineBoss.y);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });
    ctx.restore();
  };

  // Helper: Draw Chassis Floor Barrier
  const drawChassisFloorBed = (ctx: CanvasRenderingContext2D, w: number, floorY: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(195, 82, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(80, floorY);
    ctx.lineTo(w - 80, floorY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(195, 82, 55, 0.6)';
    ctx.fillText('▲ CHASSIS MOUNTING CRADLE BED (MATTER.JS RIGID BOUNDARY)', 120, floorY + 18);
    ctx.restore();
  };

  // Helper: Draw Layer 1 & 2 Fluid Chitrasutra Connectivity Paths
  const drawLayeredChitrasutraPaths = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';

    ctx.beginPath();
    ctx.moveTo(150, 260);
    ctx.lineTo(650, 260);
    ctx.bezierCurveTo(900, 220, 1100, 420, 1300, 360);
    ctx.lineTo(1550, 360);
    ctx.bezierCurveTo(1650, 360, 1720, 280, 1850, 380);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#C35237';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(650, 264);
    ctx.bezierCurveTo(900, 224, 1100, 424, 1300, 364);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(760, 240);
    ctx.lineTo(820, 240);
    ctx.lineTo(820, 370);
    ctx.bezierCurveTo(720, 375, 520, 380, 430, 440);
    ctx.stroke();

    ctx.strokeStyle = '#dcfce7';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  // Helper: Live CNC Machine Toolpath Tracer
  const drawLiveCncToolpathTracer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const pts = cncToolpathPoints;
    let target = pts[cncAnimationIndexRef.current];
    let cur = cncCuttingHeadRef.current;
    let dx = target.x - cur.x;
    let dy = target.y - cur.y;
    let distance = Math.hypot(dx, dy);

    if (distance < 5) {
      cncAnimationIndexRef.current = (cncAnimationIndexRef.current + 1) % pts.length;
    } else {
      cur.x += (dx / distance) * 5.5;
      cur.y += (dy / distance) * 5.5;
    }

    ctx.shadowBlur = 18;
    ctx.shadowColor = '#00E5FF';
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cur.x, cur.y, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cur.x, cur.y, 18, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('CNC T01: 5500 RPM', cur.x + 22, cur.y + 4);
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  // Helper: Particles update and rendering
  const updateAndDrawParticles = (
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    flow: FlowType
  ) => {
    ctx.save();
    particles.forEach((p) => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      let px = 0;
      let py = 0;

      if (p.progress < 0.35) {
        const t = p.progress / 0.35;
        px = 760 + (820 - 760) * Math.min(t * 2, 1);
        py = 240 + (370 - 240) * Math.max((t - 0.5) * 2, 0);
      } else if (p.progress < 0.7) {
        const t = (p.progress - 0.35) / 0.35;
        px = 430 - t * 40;
        py = 440 + t * 340;
      } else {
        const t = (p.progress - 0.7) / 0.3;
        const targetInjectorX = 490 + p.pathIndex * 50;
        px = 520 + (targetInjectorX - 520) * t;
        py = 780 - t * 240;
      }

      ctx.beginPath();
      ctx.arc(px, py, flow === 'electrical_pulse' ? 3.5 : 4, 0, Math.PI * 2);

      if (flow === 'cng_gas') {
        ctx.fillStyle = '#00E5FF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 8;
      } else if (flow === 'electrochemical') {
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#059669';
        ctx.shadowBlur = 8;
      } else if (flow === 'electrical_pulse') {
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 10;
      } else if (flow === 'mhd_molten_salt') {
        const isGreenIon = p.pathIndex % 2 === 0;
        ctx.fillStyle = isGreenIon ? '#39FF14' : '#FF7A00';
        ctx.shadowColor = isGreenIon ? '#39FF14' : '#FF9900';
        ctx.shadowBlur = 14;
      } else if (flow === 'lorentz_field') {
        ctx.fillStyle = '#00E5FF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = p.progress < 0.4 ? '#ef4444' : p.progress < 0.7 ? '#f59e0b' : '#00E5FF';
        ctx.shadowBlur = 4;
      }

      ctx.fill();
    });
    ctx.restore();
  };

  // Helper: Draw Components with Matter.js physical positions and rotation angles
  const drawPhysicsComponents = (
    ctx: CanvasRenderingContext2D,
    hoverId: string | null,
    selectedId: string | null,
    detachedSet: Set<string>
  ) => {
    bodiesMapRef.current.forEach(({ body, comp }, compId) => {
      ctx.save();
      const posX = body.position.x;
      const posY = body.position.y;
      const angle = body.angle;

      const isHovered = hoverId === comp.id;
      const isSelected = selectedId === comp.id;
      const isDetached = detachedSet.has(compId);
      const isDragged = draggedCompId === compId;

      ctx.translate(posX, posY);
      ctx.rotate(angle);
      ctx.translate(-comp.width / 2, -comp.height / 2);

      if (propulsionMode === 'mhd_smr_nuclear') {
        if (comp.id === 'cng_cylinders') {
          drawMhdMoltenSaltCoreGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'gas_injector_rail') {
          drawMhdInductionRailsGraphic(ctx, comp, isHovered || isDragged, isSelected, firingCycleRef.current, isDetached);
        } else if (comp.id === 'pressure_regulator') {
          drawMhdMagneticPumpGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'cng_ecu') {
          drawMhdElectroMagneticBrainGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'pressure_gauge') {
          drawMhdFluxGaugeGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else {
          drawGenericComponentGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        }
      } else {
        if (comp.id === 'cng_cylinders') {
          drawCylindersGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'gas_injector_rail') {
          drawInjectorRailGraphic(ctx, comp, isHovered || isDragged, isSelected, firingCycleRef.current, isDetached);
        } else if (comp.id === 'pressure_regulator') {
          drawRegulatorGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'cng_ecu') {
          drawEcuGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else if (comp.id === 'pressure_gauge') {
          drawPressureGaugeGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        } else {
          drawGenericComponentGraphic(ctx, comp, isHovered || isDragged, isSelected, isDetached);
        }
      }

      drawComponentLabel(ctx, comp, isHovered || isDragged, isSelected, isDetached);
      ctx.restore();
    });
  };

  // MHD-SMR Dedicated Component Renderers
  const drawMhdMoltenSaltCoreGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    // Glowing border
    ctx.shadowColor = detached ? '#EF4444' : '#39FF14';
    ctx.shadowBlur = hovered || selected || detached ? 22 : 12;
    ctx.strokeStyle = detached ? '#EF4444' : '#39FF14';
    ctx.lineWidth = 2;

    // Outer Lost-Wax Bronze armature bracket
    ctx.fillStyle = '#16120e';
    ctx.beginPath();
    ctx.roundRect(4, 4, w - 8, h - 8, 16);
    ctx.fill();
    ctx.strokeStyle = '#C35237';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Twin Transparent Reinforced Quartz Tubes
    const tubeH = 50;
    [12, 74].forEach((tubeY) => {
      // Quartz glass reflection gradient
      const glassGrad = ctx.createLinearGradient(0, tubeY, 0, tubeY + tubeH);
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      glassGrad.addColorStop(0.2, 'rgba(57, 255, 20, 0.25)');
      glassGrad.addColorStop(0.6, 'rgba(255, 122, 0, 0.35)');
      glassGrad.addColorStop(0.85, 'rgba(57, 255, 20, 0.4)');
      glassGrad.addColorStop(1, 'rgba(10, 20, 15, 0.8)');

      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.roundRect(14, tubeY, w - 28, tubeH, 12);
      ctx.fill();

      // Fluid meniscus stream (Luminescent green & orange molten salt)
      const saltGrad = ctx.createLinearGradient(14, tubeY, w - 14, tubeY);
      saltGrad.addColorStop(0, '#39FF14');
      saltGrad.addColorStop(0.4, '#FF7A00');
      saltGrad.addColorStop(0.7, '#39FF14');
      saltGrad.addColorStop(1, '#FF9900');
      ctx.fillStyle = saltGrad;
      ctx.beginPath();
      ctx.roundRect(24, tubeY + 12, w - 48, tubeH - 24, 6);
      ctx.fill();

      // Electrochemical current-extraction mesh (diamond lattice overlay)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      for (let mx = 30; mx < w - 30; mx += 18) {
        ctx.beginPath();
        ctx.moveTo(mx, tubeY + 4);
        ctx.lineTo(mx + 8, tubeY + tubeH - 4);
        ctx.stroke();
      }

      // Lost-Wax bronze cradle bands with Sanskrit engravings
      ctx.fillStyle = '#8F7142';
      ctx.fillRect(80, tubeY - 2, 16, tubeH + 4);
      ctx.fillRect(w - 110, tubeY - 2, 16, tubeH + 4);
      ctx.strokeStyle = '#e2c589';
      ctx.strokeRect(80, tubeY - 2, 16, tubeH + 4);
      ctx.strokeRect(w - 110, tubeY - 2, 16, tubeH + 4);
    });

    // Central Core Label Badge
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';
    ctx.fillText('REINFORCED QUARTZ • FLUORIDE/CHLORIDE MOLTEN SALT', w / 2, h / 2 + 3);
    ctx.shadowBlur = 0;
  };

  const drawMhdInductionRailsGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    firingCycle: number,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    // Outer Glass-Insulated Rail Base
    ctx.shadowColor = detached ? '#EF4444' : '#00E5FF';
    ctx.shadowBlur = hovered || selected || detached ? 20 : 10;
    ctx.fillStyle = '#0b1320';
    ctx.beginPath();
    ctx.roundRect(10, 8, w - 20, 32, 8);
    ctx.fill();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sacred Chitrasutra Copper Coil Windings (4 induction stages)
    for (let i = 0; i < 4; i++) {
      const stageX = 30 + i * 50;
      const isInducing = Math.floor((firingCycle * 3 + i) % 4) === 0;

      // Quartz insulator core
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(stageX, 36, 36, 42, 6);
      ctx.fill();

      // Golden Chitrasutra Copper Windings
      ctx.strokeStyle = isInducing ? '#00E5FF' : '#C35237';
      ctx.lineWidth = 2.5;
      for (let c = 0; c < 5; c++) {
        ctx.beginPath();
        ctx.moveTo(stageX + 4, 42 + c * 7);
        ctx.lineTo(stageX + 32, 42 + c * 7);
        ctx.stroke();
      }

      // Live Faraday high-voltage arc pulse
      if (isInducing) {
        ctx.strokeStyle = '#39FF14';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(stageX + 18, 57, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.textAlign = 'center';
    ctx.fillText('FARADAY INDUCTION • ZERO MECHANICAL WEAR', w / 2, 26);
    ctx.shadowBlur = 0;
  };

  const drawMhdElectroMagneticBrainGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    // Obsidian solid-state controller chassis
    ctx.fillStyle = '#080a0f';
    ctx.beginPath();
    ctx.roundRect(10, 8, w - 20, h - 16, 12);
    ctx.fill();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lateral Superconducting Magnets (North & South Poles)
    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(16, 18, 18, h - 36);
    ctx.fillStyle = '#1D4ED8';
    ctx.fillRect(w - 34, 18, 18, h - 36);

    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('N', 25, h / 2 + 3);
    ctx.fillText('S', w - 25, h / 2 + 3);

    // Glowing Cyan Vector circuit lines radiating in Chitrasutra symmetry
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(38, h / 2);
    ctx.lineTo(w / 2 - 20, h / 2);
    ctx.lineTo(w / 2, h / 2 - 16);
    ctx.lineTo(w / 2 + 20, h / 2);
    ctx.lineTo(w - 38, h / 2);
    ctx.stroke();

    // Lorentz Vector Symbol
    ctx.fillStyle = '#39FF14';
    ctx.fillText('F = J × B (LORENTZ VECTOR)', w / 2, h / 2 + 18);
  };

  const drawMhdMagneticPumpGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    // Non-mechanical wireless magnetic pump chamber
    ctx.fillStyle = '#121722';
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 12);
    ctx.fill();
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Circular electromagnetic toroidal coils
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#080d16';
    ctx.fill();
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Rotating magnetic flux indicator
    ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';
    ctx.fillText('VALVELESS MHD PUMP', w / 2, h / 2 - 4);
    ctx.fillText('2.4 T FLUX', w / 2, h / 2 + 8);
  };

  const drawMhdFluxGaugeGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const cx = comp.width / 2;
    const cy = comp.height / 2;
    const r = 34;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#39FF14';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';
    ctx.fillText('42.8 kV', cx, cy - 2);
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('FARADAY EMF', cx, cy + 10);
  };

  // Component Graphic Renderers
  const drawCylindersGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    if (selected || hovered || detached) {
      ctx.shadowColor = detached ? '#EF4444' : '#00E5FF';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = detached ? '#EF4444' : '#00E5FF';
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = 'rgba(195, 82, 55, 0.4)';
      ctx.lineWidth = 1.2;
    }

    const tankH = 55;
    [10, 75].forEach((tankY) => {
      const grad = ctx.createLinearGradient(0, tankY, 0, tankY + tankH);
      grad.addColorStop(0, '#475569');
      grad.addColorStop(0.3, '#94a3b8');
      grad.addColorStop(0.7, '#334155');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.roundRect(15, tankY, w - 30, tankH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#C35237';
      ctx.fillRect(80, tankY + 2, 14, tankH - 4);
      ctx.fillRect(w - 110, tankY + 2, 14, tankH - 4);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(w - 22, tankY + 14, 16, 26);
    });
  };

  const drawInjectorRailGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    firingCycle: number,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    if (selected || hovered || detached) {
      ctx.shadowColor = detached ? '#EF4444' : '#00E5FF';
      ctx.shadowBlur = 18;
    }

    const railGrad = ctx.createLinearGradient(0, 10, 0, 36);
    railGrad.addColorStop(0, '#94a3b8');
    railGrad.addColorStop(0.5, '#f1f5f9');
    railGrad.addColorStop(1, '#475569');
    ctx.fillStyle = railGrad;
    ctx.beginPath();
    ctx.roundRect(10, 12, w - 20, 24, 6);
    ctx.fill();

    ctx.strokeStyle = hovered || detached ? '#00E5FF' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const activeCyl = Math.floor((firingCycle * 2) % 4);
    for (let i = 0; i < 4; i++) {
      const ix = 35 + i * 50;
      const isFiring = activeCyl === i;
      ctx.fillStyle = isFiring ? '#00E5FF' : '#2563eb';
      ctx.shadowColor = isFiring ? '#00E5FF' : 'transparent';
      ctx.shadowBlur = isFiring ? 12 : 0;
      ctx.beginPath();
      ctx.roundRect(ix, 36, 32, 28, 4);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ix + 10, 64, 12, 16);
    }
  };

  const drawRegulatorGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(10, 10, w - 20, h - 20, 12);
    ctx.fill();
    ctx.strokeStyle = hovered || detached ? '#00E5FF' : '#C35237';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#C35237';
    ctx.fillRect(15, h / 2 - 8, 14, 16);
    ctx.fillRect(w - 29, h / 2 - 8, 14, 16);
  };

  const drawEcuGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 8);
    ctx.fill();
    ctx.strokeStyle = hovered || detached ? '#00E5FF' : '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#C35237';
    ctx.fillRect(20, h - 34, w - 40, 24);

    ctx.fillStyle = '#00E5FF';
    ctx.font = '700 11px JetBrains Mono, monospace';
    ctx.fillText('32-BIT ECU CORE', 32, 42);
  };

  const drawPressureGaugeGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const cx = comp.width / 2;
    const cy = comp.height / 2;
    const r = 34;

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI * 0.15) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r - 7), cy + Math.sin(a) * (r - 7));
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }

    ctx.strokeStyle = '#C35237';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(0.2) * (r - 6), cy + Math.sin(0.2) * (r - 6));
    ctx.stroke();
  };

  const drawGenericComponentGraphic = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 8);
    ctx.fill();
    ctx.strokeStyle = selected || hovered || detached ? '#00E5FF' : '#C35237';
    ctx.lineWidth = selected || hovered || detached ? 2 : 1;
    ctx.stroke();
  };

  const drawComponentLabel = (
    ctx: CanvasRenderingContext2D,
    comp: EngineComponent,
    hovered: boolean,
    selected: boolean,
    detached: boolean
  ) => {
    const w = comp.width;
    const h = comp.height;
    ctx.save();
    const tagY = h + 18;

    let sanskritTitle = comp.sanskritName;
    let engName = comp.name;

    if (propulsionMode === 'mhd_smr_nuclear') {
      if (comp.id === 'cng_cylinders') {
        sanskritTitle = 'तेजस-द्रव-कोष (Tejas-Drava)';
        engName = 'Molten Salt Quartz Core & Fission Matrix';
      } else if (comp.id === 'gas_injector_rail') {
        sanskritTitle = 'बिन्दु-प्रेरण-नालिका (Bindu-Prerana)';
        engName = 'Multi-Pull Glass Induction Rails';
      } else if (comp.id === 'cng_ecu') {
        sanskritTitle = 'चुम्बकीय-प्राण-यन्त्र (MHD Brain)';
        engName = 'Electromagnetic Solid-State Vector Grid';
      } else if (comp.id === 'pressure_regulator') {
        sanskritTitle = 'वायु-चुम्बक-त्वरक (Lorentz Pump)';
        engName = 'Valveless Magnetic Flow Accelerator';
      } else if (comp.id === 'pressure_gauge') {
        sanskritTitle = 'चुम्बक-मापक (Faraday Sensor)';
        engName = 'Faraday EMF & Tesla Sensor';
      }
    }

    ctx.fillStyle = detached 
      ? 'rgba(239, 68, 68, 0.25)' 
      : hovered || selected 
      ? 'rgba(0, 229, 255, 0.15)' 
      : 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = detached 
      ? '#EF4444' 
      : hovered || selected 
      ? (propulsionMode === 'mhd_smr_nuclear' ? '#39FF14' : '#00E5FF')
      : 'rgba(195, 82, 55, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-8, tagY - 14, w + 16, 28, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '600 11px Cinzel, serif';
    ctx.fillStyle = detached ? '#fca5a5' : hovered || selected ? '#e0f2fe' : '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(`${sanskritTitle} ${detached ? '⚡[RESISTING]' : ''}`, w / 2, tagY);

    ctx.font = '500 10px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = detached 
      ? '#f87171' 
      : hovered || selected 
      ? (propulsionMode === 'mhd_smr_nuclear' ? '#39FF14' : '#00E5FF') 
      : '#C35237';
    ctx.fillText(engName, w / 2, tagY + 12);
    ctx.restore();
  };

  // Helper: Draw Layer 3 Injector Node Alignment Arrows
  const drawInjectorNodeArrows = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    const activeInjectorNodes = [
      { nodeX: 525, nodeY: 550 },
      { nodeX: 575, nodeY: 550 },
      { nodeX: 625, nodeY: 550 },
      { nodeX: 675, nodeY: 550 },
    ];

    activeInjectorNodes.forEach((node, idx) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(node.nodeX, node.nodeY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(node.nodeX, node.nodeY - 8);
      ctx.lineTo(node.nodeX, node.nodeY - 45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(node.nodeX - 4, node.nodeY - 38);
      ctx.lineTo(node.nodeX, node.nodeY - 45);
      ctx.lineTo(node.nodeX + 4, node.nodeY - 38);
      ctx.stroke();

      ctx.fillStyle = '#8F7142';
      ctx.font = '9px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`NODE_0${idx + 1}`, node.nodeX, node.nodeY - 52);
    });
    ctx.restore();
  };

  // Mouse & Touch Physics Dragging Handlers with MouseConstraint & Spring Resistance
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    registerUserInteraction();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const virtX = (mouseX - (canvas.width / 2 + panX)) / scale + VIRTUAL_WIDTH / 2;
    const virtY = (mouseY - (canvas.height / 2 + panY)) / scale + VIRTUAL_HEIGHT / 2;

    let hitId: string | null = null;
    bodiesMapRef.current.forEach(({ body, comp }) => {
      const minX = body.position.x - comp.width / 2;
      const maxX = body.position.x + comp.width / 2;
      const minY = body.position.y - comp.height / 2;
      const maxY = body.position.y + comp.height / 2;

      if (virtX >= minX && virtX <= maxX && virtY >= minY && virtY <= maxY) {
        hitId = comp.id;
      }
    });

    if (hitId) {
      const activeHitId = hitId;
      setDraggedCompId(activeHitId);
      const hitData = bodiesMapRef.current.get(activeHitId);
      if (hitData && engineRef.current) {
        // Unlock into dynamic body so it can be dragged with physical resistance
        Matter.Body.setStatic(hitData.body, false);
        if (!detachedComponents.has(activeHitId)) {
          setDetachedComponents(prev => new Set(prev).add(activeHitId));
        }

        // Attach a Matter.js Mouse Constraint (Spring) from mouse coordinate to the body
        const mouseSpring = Matter.Constraint.create({
          pointA: { x: virtX, y: virtY },
          bodyB: hitData.body,
          pointB: { 
            x: virtX - hitData.body.position.x, 
            y: virtY - hitData.body.position.y 
          },
          stiffness: 0.18, // High responsiveness to mouse pull
          damping: 0.05,
          length: 0,
        });

        Matter.World.add(engineRef.current.world, mouseSpring);
        mouseSpringRef.current = mouseSpring;
      }
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const virtX = (mouseX - (canvas.width / 2 + panX)) / scale + VIRTUAL_WIDTH / 2;
    const virtY = (mouseY - (canvas.height / 2 + panY)) / scale + VIRTUAL_HEIGHT / 2;

    // If dragging a component, update the mouse spring target position
    if (draggedCompId && mouseSpringRef.current) {
      mouseSpringRef.current.pointA = { x: virtX, y: virtY };

      // Calculate instantaneous tension force
      const item = bodiesMapRef.current.get(draggedCompId);
      if (item) {
        const ax = item.springConstraint.pointA.x;
        const ay = item.springConstraint.pointA.y;
        const dist = Math.hypot(item.body.position.x - ax, item.body.position.y - ay);
        setCurrentTensionForce(dist * springStiffness * 0.9);
      }
      return;
    }

    if (isDraggingCanvas) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
      return;
    }

    // Hover detection
    let foundId: string | null = null;
    bodiesMapRef.current.forEach(({ body, comp }) => {
      const minX = body.position.x - comp.width / 2;
      const maxX = body.position.x + comp.width / 2;
      const minY = body.position.y - comp.height / 2;
      const maxY = body.position.y + comp.height / 2;

      if (virtX >= minX && virtX <= maxX && virtY >= minY && virtY <= maxY) {
        foundId = comp.id;
      }
    });
    setHoveredId(foundId);
  };

  const handleMouseUp = () => {
    // Release the mouse spring constraint so component oscillates back relative to the engine block!
    if (mouseSpringRef.current && engineRef.current) {
      Matter.World.remove(engineRef.current.world, mouseSpringRef.current);
      mouseSpringRef.current = null;
    }
    setDraggedCompId(null);
    setCurrentTensionForce(0);
    setIsDraggingCanvas(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    registerUserInteraction();
    if (draggedCompId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const virtX = (mouseX - (canvas.width / 2 + panX)) / scale + VIRTUAL_WIDTH / 2;
    const virtY = (mouseY - (canvas.height / 2 + panY)) / scale + VIRTUAL_HEIGHT / 2;

    bodiesMapRef.current.forEach(({ body, comp }) => {
      const minX = body.position.x - comp.width / 2;
      const maxX = body.position.x + comp.width / 2;
      const minY = body.position.y - comp.height / 2;
      const maxY = body.position.y + comp.height / 2;

      if (virtX >= minX && virtX <= maxX && virtY >= minY && virtY <= maxY) {
        onSelectComponent(comp);
      }
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    registerUserInteraction();
    const zoomDelta = e.deltaY > 0 ? 0.92 : 1.08;
    setScale((prev) => Math.min(Math.max(prev * zoomDelta, 0.4), 2.5));
  };

  return (
    <div className={`relative w-full h-[88vh] overflow-hidden select-none flex flex-col transition-colors duration-300 ${isThermalSurge ? 'bg-[#150709]' : 'bg-[#0C0C0E]'}`}>
      
      {/* Critical Thermal Alert Banner if > 820K */}
      {isThermalSurge && (
        <div className="w-full bg-rose-600/95 text-white px-4 py-1.5 flex items-center justify-between text-xs font-bold font-mono tracking-wider animate-pulse z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>!! CRITICAL SYSTEM THERMAL SURGE DETECTED ({coreTemperatureK.toFixed(1)} K &gt; 820.0 K) !!</span>
          </div>
          <span>ACTION: COOLANT JACKET SCAVENGING AT MAXIMUM FLOW</span>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Architecture Switcher & Physics Sliders */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#12141c]/95 backdrop-blur-md rounded-xl border border-amber-900/40 shadow-xl pointer-events-auto">
          {/* Dual Architecture Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setPropulsionMode('mhd_smr_nuclear');
                setActiveFlow('mhd_molten_salt');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                propulsionMode === 'mhd_smr_nuclear'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>⚛ MHD-SMR Nuclear</span>
            </button>
            <button
              onClick={() => {
                setPropulsionMode('flex_fuel_electrochemical');
                setActiveFlow('cng_gas');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                propulsionMode === 'flex_fuel_electrochemical'
                  ? 'bg-[#C35237] text-white shadow-lg shadow-orange-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>⛽ Flex-Fuel</span>
            </button>
          </div>

          <div className="w-px h-5 bg-slate-800 hidden sm:block" />

          {/* Exploded Slider */}
          <div className="flex items-center gap-2 px-2">
            <Sliders className="w-3.5 h-3.5 text-[#C35237]" />
            <span className="text-xs font-semibold text-slate-200">Exploded</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedFactor}
              onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#C35237]"
            />
            <span className="text-[11px] font-mono text-amber-200 tabular-nums">
              {Math.round(explodedFactor * 100)}%
            </span>
          </div>

          <div className="w-px h-5 bg-slate-800 hidden sm:block" />

          {/* Spring Resistance Stiffness Slider */}
          <div className="flex items-center gap-2 px-2">
            <Gauge className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-xs font-semibold text-slate-200">Spring</span>
            <input
              type="range"
              min="0.01"
              max="0.12"
              step="0.01"
              value={springStiffness}
              onChange={(e) => setSpringStiffness(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
            />
            <span className="text-[11px] font-mono text-[#00E5FF] tabular-nums">
              {(springStiffness * 100).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Center: Matter.js Gravity, Flow & Planetarium Reticle */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#12141c]/95 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
          {propulsionMode === 'mhd_smr_nuclear' && (
            <>
              <button
                onClick={() => setActiveFlow(prev => prev === 'mhd_molten_salt' ? 'lorentz_field' : 'mhd_molten_salt')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 rounded-lg border border-emerald-500/40 transition-all"
                title="Toggle between glowing ionic molten salt flow and magnetic Lorentz vectors"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeFlow === 'mhd_molten_salt' ? 'Molten Salt Flow' : 'Lorentz Vector (J×B)'}</span>
              </button>

              <button
                onClick={() => setShowPlanetariumDome(!showPlanetariumDome)}
                className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  showPlanetariumDome ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Toggle Planetarium Glass Dome Observatory Lines & Lost-Wax Bronze Armature"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Dome: {showPlanetariumDome ? 'ON' : 'OFF'}</span>
              </button>
            </>
          )}

          <button
            onClick={() => setGravityStrength(prev => prev === 0 ? 0.8 : prev === 0.8 ? 1.6 : 0)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#00E5FF] hover:bg-slate-800 rounded-lg border border-sky-500/30 transition-all"
            title="Cycle Gravity Downward"
          >
            <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Gravity: {gravityStrength === 0 ? '0G' : `${gravityStrength}G`}</span>
          </button>

          <button
            onClick={handleDetachAll}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-slate-800 rounded-lg border border-amber-500/40 transition-all"
            title="Detach all components to pull under physical spring resistance"
          >
            <Unlock className="w-3.5 h-3.5 text-[#C35237]" />
            <span>Detach All</span>
          </button>

          <button
            onClick={handlePinAllBack}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all"
            title="Pin all components back to blueprint mounting pads"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Pin Back</span>
          </button>

          <button
            onClick={handleScatterImpulse}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#C35237] hover:text-amber-200 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
            title="Apply outward kinetic impulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scatter</span>
          </button>

          <button
            onClick={() => setShowThermalSidebar(!showThermalSidebar)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showThermalSidebar ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Live 10Hz Thermal Waveform & Surge Traps"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Waveform</span>
          </button>
        </div>

        {/* Right: Viewport Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#12141c]/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
          <button
            onClick={() => setScale((prev) => Math.min(prev * 1.15, 2.5))}
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((prev) => Math.max(prev * 0.85, 0.4))}
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setScale(0.82); setPanX(-40); setPanY(-20); }}
            className="p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace (Canvas + Thermal Sidebar) */}
      <div className="flex-1 w-full h-full flex relative">
        {/* Interactive Canvas Surface */}
        <div ref={containerRef} className="flex-1 h-full relative cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            onWheel={handleWheel}
            className="w-full h-full block"
          />

          {/* Floating MHD-SMR Fluid Flow Dynamics Telemetry HUD Card */}
          {propulsionMode === 'mhd_smr_nuclear' && showMhdHud && (
            <div className="absolute top-20 left-4 z-30 p-3.5 bg-[#0B0D14]/95 backdrop-blur-md rounded-2xl border border-emerald-500/40 text-xs font-mono text-slate-200 shadow-2xl space-y-2 pointer-events-auto max-w-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-100 font-display text-[11px]">
                    MHD-SMR NUCLEAR BATTERY MATRIX
                  </span>
                </div>
                <button 
                  onClick={() => setShowMhdHud(false)} 
                  className="text-slate-500 hover:text-slate-300 text-xs px-1"
                  title="Minimize HUD"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">MOLTEN SALT FLUID</span>
                  <span className="text-emerald-300 font-bold">LiF-BeF2-UF4 (1 atm)</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">LORENTZ VECTOR J×B</span>
                  <span className="text-[#00E5FF] font-bold">18.4 kN/m³ (Non-mech)</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">FARADAY INDUCTION</span>
                  <span className="text-amber-300 font-bold">42.8 kV • 850 kW Net</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block">MECHANICAL WEAR</span>
                  <span className="text-emerald-400 font-bold">0.00% (Zero Friction)</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-800/60">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Continuous Nuclear Charge Loop
                </span>
                <span className="text-amber-300 font-semibold">99.8% Stored Cap</span>
              </div>
            </div>
          )}

          {propulsionMode === 'mhd_smr_nuclear' && !showMhdHud && (
            <button
              onClick={() => setShowMhdHud(true)}
              className="absolute top-20 left-4 z-30 px-3 py-1.5 bg-[#0B0D14]/90 backdrop-blur-md rounded-xl border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:text-white shadow-xl flex items-center gap-2 pointer-events-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Show MHD Telemetry HUD</span>
            </button>
          )}

          {/* Persistent Proprietary IP Notice Trigger Badge */}
          <div className="absolute top-20 right-4 z-30 pointer-events-auto">
            <button
              onClick={() => setShowIpModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1a0808]/90 hover:bg-[#280c0c] border border-rose-600/70 hover:border-rose-500 rounded-xl text-xs font-mono text-rose-300 shadow-xl backdrop-blur-md transition-all group animate-pulse"
              title="Click to view formal non-disclosure reminder & technology transfer terms"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-wide">⚠️ IP REGISTRY: VAL-2026-SMR</span>
            </button>
          </div>

          {/* Active Spring Resistance Drag HUD Overlay */}
          {draggedCompId && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 bg-[#12141e]/90 backdrop-blur-md rounded-xl border border-[#00E5FF]/40 text-xs font-mono text-slate-200 shadow-2xl flex items-center gap-3 pointer-events-none">
              <Zap className="w-4 h-4 text-[#00E5FF] animate-bounce" />
              <span>Spring Resistance: <strong>{currentTensionForce.toFixed(1)} N</strong></span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-300">Anchor: Engine Block Boss</span>
            </div>
          )}
        </div>

        {/* Persistent Proprietary IP Notice Visual Overlay Modal */}
        {showIpModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-text">
            <div className="bg-[#0f090b] border-2 border-rose-600/80 rounded-2xl max-w-xl w-full shadow-2xl p-6 text-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
              <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-950/80 border border-rose-600 rounded-lg text-rose-400">
                    <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold font-display text-rose-400 tracking-wide">
                      METRIC INFRASTRUCTURE FIREWALL NOTICE
                    </h2>
                    <span className="text-[10px] font-mono text-rose-300/80">
                      ⚠️ SECURITY REGISTRY DETECTED: [VAL-2026-SMR]
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowIpModal(false)}
                  className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                  title="Dismiss Modal (Persistent Badge Remains Active)"
                >
                  ✕
                </button>
              </div>

              {/* Non-Disclosure Text Block */}
              <div className="p-3.5 bg-[#1a0808] border-l-4 border-rose-600 rounded-r-xl text-xs font-mono text-rose-100 leading-relaxed space-y-2">
                <strong className="text-rose-400 block font-sans tracking-wide">
                  PROPRIETARY LEGAL NOTICE:
                </strong>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  All underlying atomic constants, fission geometry parameters, and pre-compiled multi-axis G-code paths are classified as the independent, pre-existing Intellectual Property of <strong className="text-rose-300">Amit Nishanka Bhuyan</strong> [VAL-2026-SMR].
                </p>
                <p className="text-[10.5px] text-rose-200/90 leading-relaxed">
                  Unlicensed replication, decompilation, or organizational extraction of this Black-Box system data vector violates prior disclosure boundary laws and automatically executes the mandatory conditional clause.
                </p>
              </div>

              {/* Non-Negotiable Contract Clauses */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-1.5 text-[10.5px] font-mono text-slate-300">
                <span className="text-amber-400 font-bold block mb-1">MANDATORY TECHNOLOGY TRANSFER TERMS:</span>
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Corporate Placement:</strong> Permanent Lead Systems Design Architect, AI Researcher, or Product Coordinator role.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Sovereign Fallback:</strong> Identical fully-salaried role within <strong>Bharat (India)</strong> if visa constraints apply.</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Commercialization Fee:</strong> Lump-sum technology transfer payment alongside ongoing lifetime royalties.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    const noticeText = `PROPRIETARY LEGAL NOTICE:\nAll underlying atomic constants, fission geometry parameters, and pre-compiled multi-axis G-code paths are classified as the independent, pre-existing Intellectual Property of Amit Nishanka Bhuyan [VAL-2026-SMR].\n\nUnlicensed replication, decompilation, or organizational extraction of this Black-Box system data vector violates prior disclosure boundary laws and automatically executes the mandatory conditional clause.\n\nMandatory Terms:\n1. Corporate Placement: Lead Systems Design Architect / AI Researcher\n2. Sovereign Fallback: Bharat (India)\n3. Commercialization Fee: Lump-sum & Lifetime Royalty`;
                    navigator.clipboard.writeText(noticeText);
                    setCopiedLegalNotice(true);
                    setTimeout(() => setCopiedLegalNotice(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  {copiedLegalNotice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLegalNotice ? 'COPIED!' : 'Copy Legal Notice'}</span>
                </button>

                <button
                  onClick={() => setShowIpModal(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 shadow-lg shadow-rose-950/50 border border-rose-500 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-200" />
                  <span>I Acknowledge & Inspect Black-Box Twin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Core Thermal Waveform Sidebar powered by Recharts */}
        {showThermalSidebar && (
          <aside id="telemetry-sidebar" className="w-80 md:w-96 border-l border-slate-800/80 z-20 overflow-y-auto backdrop-blur-md">
            <ThermodynamicMonitor
              isThermalSurge={isThermalSurge}
              coreTemperatureK={coreTemperatureK}
              onToggleForceSurge={() => setForceThermalSurge(!forceThermalSurge)}
              forceSurgeActive={forceThermalSurge}
              propulsionMode={propulsionMode}
              mhdVelocityMs={liveMhdVelocity}
              mhdVoltageKv={liveMhdVoltage}
              mhdPowerKw={liveMhdPower}
              magneticFluxTesla={4.2}
            />
          </aside>
        )}
      </div>

      {/* Bottom Component Quick-Bar with Physics Detachment Indicators */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 bg-[#0c0d12]/95 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl pointer-events-auto max-w-[70vw]">
          <span className="text-xs font-medium text-slate-400 px-2 flex items-center gap-1.5 whitespace-nowrap">
            <Layers className="w-3.5 h-3.5 text-[#C35237]" />
            <span>Interactive Spring Bodies:</span>
          </span>
          {ENGINE_COMPONENTS.map((comp) => {
            const isDetached = detachedComponents.has(comp.id);
            return (
              <div key={comp.id} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onSelectComponent(comp)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedComponentId === comp.id
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-amber-200 border border-slate-800'
                  }`}
                >
                  {comp.name}
                </button>
                <button
                  onClick={() => toggleComponentDetach(comp.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDetached 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                  title={isDetached ? 'Pin back to blueprint' : 'Detach into gravity spring'}
                >
                  {isDetached ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0c0d12]/95 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-slate-400 pointer-events-auto">
          <Move className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Click & Drag components to pull with physical spring resistance relative to engine block</span>
        </div>
      </div>
    </div>
  );
};
