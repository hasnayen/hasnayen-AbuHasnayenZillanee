import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import * as THREE from "three";
import { X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Portfolio Data ───────────────────────────────────────────────────────────

const ZONE_DATA = [
  {
    id: "about",
    label: "ABOUT",
    icon: "🎮",
    pos: [0, 0, -10] as [number, number, number],
    color: "#00b4d8",
    emissive: "#0077b6",
    title: "Abu Hasnayen Zillanee",
    subtitle: "Product Dev Executive · CTO · Engineer",
    content: [
      "Based in Dhaka, Bangladesh",
      "+3 years building scalable products",
      "AI/ML, Full-Stack, Product Strategy",
      "4 peer-reviewed publications",
      "BRAC University — CGPA 3.67 / 4.00",
    ],
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    icon: "📜",
    pos: [22, 0, -6] as [number, number, number],
    color: "#7209b7",
    emissive: "#560bad",
    title: "Quest Log",
    subtitle: "Professional Experience",
    content: [
      "CTO & Engineer — Zillanee Engineers (2024–Now)",
      "Product Dev Executive — Cartup Ltd. (2024–Now)",
      "Lecturer — Shanto-Mariam University (2024–Now)",
      "Product Manager — Cartup Ltd. (2023–2024)",
      "ML/AI Research Intern — Therap BD (2022–2023)",
    ],
  },
  {
    id: "projects",
    label: "PROJECTS",
    icon: "🏗️",
    pos: [22, 0, 14] as [number, number, number],
    color: "#f72585",
    emissive: "#b5179e",
    title: "Inventory",
    subtitle: "Featured Projects",
    content: [
      "🤖 AI-Powered ERP for Construction",
      "🏪 Warehouse Management System (WMS)",
      "📱 Mobile EdTech Learning Platform",
      "🧠 Sketch-to-Image GAN (Deep Learning)",
      "💊 Diabetic Retinopathy Detection AI",
    ],
  },
  {
    id: "skills",
    label: "SKILL TREE",
    icon: "⚡",
    pos: [0, 0, 22] as [number, number, number],
    color: "#4cc9f0",
    emissive: "#4895ef",
    title: "Skill Tree",
    subtitle: "Technologies & Expertise",
    content: [
      "AI/ML: TensorFlow, PyTorch, LangChain, OpenAI",
      "Frontend: React, TypeScript, Next.js, Tailwind",
      "Backend: Node.js, Python, FastAPI, Express",
      "Cloud: AWS, GCP, Docker, CI/CD",
      "Product: Figma, Agile, OKRs, Roadmapping",
    ],
  },
  {
    id: "publications",
    label: "CODEX",
    icon: "📚",
    pos: [-22, 0, 14] as [number, number, number],
    color: "#f4a261",
    emissive: "#e76f51",
    title: "Research Codex",
    subtitle: "Publications",
    content: [
      "Diabetic Retinopathy Detection — IEEE 2023",
      "Bangla Sentiment Analysis via NLP — 2023",
      "Sketch-to-Image Translation GAN — 2022",
      "COVID-19 Detection via Chest X-Ray — 2022",
    ],
  },
  {
    id: "education",
    label: "EDUCATION",
    icon: "🎓",
    pos: [-22, 0, -6] as [number, number, number],
    color: "#2dc653",
    emissive: "#208b3a",
    title: "Level History",
    subtitle: "Education",
    content: [
      "BSc CSE — BRAC University (2019–2024)",
      "CGPA: 3.67 / 4.00 (Distinction)",
      "Thesis: Sketch-to-Image GAN",
      "4 published research papers",
      "Dean's List recognition",
    ],
  },
  {
    id: "contact",
    label: "CONTACT",
    icon: "📡",
    pos: [-8, 0, -22] as [number, number, number],
    color: "#f9c74f",
    emissive: "#f3722c",
    title: "Comms Channel",
    subtitle: "Get in Touch",
    content: [
      "hasnayen3072@gmail.com",
      "+880 1841343493",
      "linkedin.com/in/abu-hasnayen-zillanee",
      "github.com/hasnayen",
      "Lalbagh, Dhaka 1211, Bangladesh",
    ],
    link: "mailto:hasnayen3072@gmail.com",
  },
];

type ZoneDef = typeof ZONE_DATA[number];

// ─── Buildings ────────────────────────────────────────────────────────────────

const BUILDINGS = [
  { p: [9, 3, 0],     s: [2, 6, 2],   c: "#0d1b2a" },
  { p: [-9, 5, 0],    s: [1.5, 10, 1.5], c: "#1b263b" },
  { p: [11, 4, -16],  s: [3, 8, 3],   c: "#162032" },
  { p: [-11, 6, -16], s: [2, 12, 2],  c: "#0d2137" },
  { p: [15, 2.5, 0],  s: [2, 5, 2],   c: "#0a192f" },
  { p: [-15, 3.5, 0], s: [2.5, 7, 2.5], c: "#172040" },
  { p: [5, 4.5, 15],  s: [2, 9, 2],   c: "#12294d" },
  { p: [-5, 2.5, 15], s: [3, 5, 3],   c: "#0d1b2a" },
  { p: [15, 3, 23],   s: [2, 6, 2],   c: "#1b263b" },
  { p: [-15, 4, 23],  s: [2, 8, 2],   c: "#162032" },
  { p: [33, 7, 0],    s: [3, 14, 3],  c: "#0d2137" },
  { p: [-33, 5, 0],   s: [3, 10, 3],  c: "#0a192f" },
  { p: [10, 3.5, -29], s: [2.5, 7, 2.5], c: "#172040" },
  { p: [-10, 4.5, -29], s: [2, 9, 2], c: "#12294d" },
];

// ─── Car physics ──────────────────────────────────────────────────────────────

function useCar() {
  const posRef   = useRef(new THREE.Vector3(0, 0.45, 8));
  const velRef   = useRef(0);
  const angleRef = useRef(Math.PI);
  const wheelAngleRef = useRef(0);
  const keysRef  = useRef<Set<string>>(new Set());

  useEffect(() => {
    const isNavKey = (code: string) =>
      ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(code);
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (isNavKey(e.code)) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);
    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []);

  const pressKey   = useCallback((c: string) => keysRef.current.add(c), []);
  const releaseKey = useCallback((c: string) => keysRef.current.delete(c), []);

  const update = useCallback((delta: number) => {
    const k = keysRef.current;
    const dt = Math.min(delta, 0.05);
    const ACCEL = 10, MAX_F = 15, MAX_R = 7, TURN = 2.5, FRICTION = 0.88;

    if (k.has("KeyW") || k.has("ArrowUp"))
      velRef.current = Math.min(velRef.current + ACCEL * dt, MAX_F);
    else if (k.has("KeyS") || k.has("ArrowDown"))
      velRef.current = Math.max(velRef.current - ACCEL * dt, -MAX_R);

    velRef.current *= FRICTION;
    if (Math.abs(velRef.current) < 0.05) velRef.current = 0;

    const dir = (k.has("KeyA") || k.has("ArrowLeft")) ? 1
              : (k.has("KeyD") || k.has("ArrowRight")) ? -1 : 0;
    if (Math.abs(velRef.current) > 0.1)
      angleRef.current += dir * TURN * dt * Math.sign(velRef.current);
    wheelAngleRef.current = dir * 0.42;

    const nx = posRef.current.x + Math.sin(angleRef.current) * velRef.current * dt;
    const nz = posRef.current.z + Math.cos(angleRef.current) * velRef.current * dt;
    posRef.current.x = Math.max(-44, Math.min(44, nx));
    posRef.current.z = Math.max(-44, Math.min(44, nz));

    return { pos: posRef.current, angle: angleRef.current, vel: velRef.current, wheelAngle: wheelAngleRef.current };
  }, []);

  return { update, posRef, angleRef, velRef, wheelAngleRef, pressKey, releaseKey };
}

// ─── Wheel mesh ───────────────────────────────────────────────────────────────

function Wheel({
  position, steer = false, velRef, wheelAngleRef
}: {
  position: [number, number, number];
  steer?: boolean;
  velRef: React.MutableRefObject<number>;
  wheelAngleRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rollRef  = useRef(0);
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    rollRef.current += velRef.current * dt * 3;
    if (steer) groupRef.current.rotation.y = wheelAngleRef.current;
    const inner = groupRef.current.children[0] as THREE.Mesh;
    inner.rotation.x = rollRef.current;
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.2, 14]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.22, 10]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Car mesh ─────────────────────────────────────────────────────────────────

function CarMesh({
  carGroupRef, velRef, wheelAngleRef
}: {
  carGroupRef: React.RefObject<THREE.Group>;
  velRef: React.MutableRefObject<number>;
  wheelAngleRef: React.MutableRefObject<number>;
}) {
  return (
    <group ref={carGroupRef}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.5, 0.42, 3.0]} />
        <meshStandardMaterial color="#0096c7" metalness={0.6} roughness={0.3} emissive="#004e6e" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.62, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.38, 1.6]} />
        <meshStandardMaterial color="#00b4d8" metalness={0.4} roughness={0.4} emissive="#005f73" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.16, 1.38]}>
        <boxGeometry args={[1.3, 0.2, 0.14]} />
        <meshStandardMaterial color="#003d4f" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.16, -1.38]}>
        <boxGeometry args={[1.3, 0.2, 0.14]} />
        <meshStandardMaterial color="#003d4f" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.55, -1.22]}>
        <boxGeometry args={[1.1, 0.06, 0.28]} />
        <meshStandardMaterial color="#005f73" metalness={0.8} roughness={0.2} />
      </mesh>
      <Wheel position={[-0.82, 0,  0.95]} steer velRef={velRef} wheelAngleRef={wheelAngleRef} />
      <Wheel position={[ 0.82, 0,  0.95]} steer velRef={velRef} wheelAngleRef={wheelAngleRef} />
      <Wheel position={[-0.82, 0, -0.95]} velRef={velRef} wheelAngleRef={wheelAngleRef} />
      <Wheel position={[ 0.82, 0, -0.95]} velRef={velRef} wheelAngleRef={wheelAngleRef} />
      {/* Headlights */}
      <mesh position={[-0.45, 0.28, 1.49]}>
        <boxGeometry args={[0.3, 0.12, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.45, 0.28, 1.49]}>
        <boxGeometry args={[0.3, 0.12, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <pointLight position={[0.4, 0.3, 1.8]} color="#ffffff" intensity={2} distance={8} />
      <pointLight position={[-0.4, 0.3, 1.8]} color="#ffffff" intensity={2} distance={8} />
      {/* Tail lights */}
      <mesh position={[-0.45, 0.28, -1.49]}>
        <boxGeometry args={[0.28, 0.1, 0.04]} />
        <meshStandardMaterial color="#ff2244" emissive="#ff2244" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.45, 0.28, -1.49]}>
        <boxGeometry args={[0.28, 0.1, 0.04]} />
        <meshStandardMaterial color="#ff2244" emissive="#ff2244" emissiveIntensity={2} />
      </mesh>
      {/* Undercar glow */}
      <pointLight position={[0, -0.05, 0]} color="#00b4d8" intensity={1.5} distance={3} />
    </group>
  );
}

// ─── Zone ─────────────────────────────────────────────────────────────────────

function Zone({ data, isActive }: { data: ZoneDef; isActive: boolean }) {
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!floorRef.current) return;
    const mat = floorRef.current.material as THREE.MeshStandardMaterial;
    const t = clock.getElapsedTime();
    mat.emissiveIntensity = isActive
      ? 0.7 + Math.sin(t * 5) * 0.3
      : 0.2 + Math.sin(t * 1.2) * 0.08;
  });

  const col = new THREE.Color(data.color);
  const SIZE = 8.5;

  return (
    <group position={data.pos}>
      {/* Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.2}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Border — 4 box edges */}
      {[
        [[0, 0.06, SIZE / 2], [SIZE, 0.1, 0.12]],
        [[0, 0.06, -SIZE / 2], [SIZE, 0.1, 0.12]],
        [[SIZE / 2, 0.06, 0], [0.12, 0.1, SIZE]],
        [[-SIZE / 2, 0.06, 0], [0.12, 0.1, SIZE]],
      ].map(([pos, scale], i) => (
        <mesh key={i} position={pos as [number,number,number]}>
          <boxGeometry args={scale as [number,number,number]} />
          <meshStandardMaterial color={data.color} emissive={data.emissive} emissiveIntensity={isActive ? 1.5 : 0.5} />
        </mesh>
      ))}
      {/* Corner pillars */}
      {[[-SIZE/2+0.2, -SIZE/2+0.2], [SIZE/2-0.2, -SIZE/2+0.2], [-SIZE/2+0.2, SIZE/2-0.2], [SIZE/2-0.2, SIZE/2-0.2]].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.5, z]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 6]} />
          <meshStandardMaterial color={data.color} emissive={data.emissive} emissiveIntensity={isActive ? 1.2 : 0.4} />
        </mesh>
      ))}
      {/* Floating label */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.65}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {`${data.icon} ${data.label}`}
      </Text>
    </group>
  );
}

// ─── Ground & Roads ───────────────────────────────────────────────────────────

function World() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial color="#040810" roughness={1} />
      </mesh>
      <gridHelper args={[130, 65, "#071228", "#050e1e"]} position={[0, 0.005, 0]} />
      {/* Roads */}
      {[
        [[0, 0.02, 0], [3, 0.01, 80]],
        [[0, 0.02, 0], [80, 0.01, 3]],
        [[0, 0.02, 8], [50, 0.01, 3]],
      ].map(([pos, scale], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={pos as [number,number,number]}>
          <planeGeometry args={[scale[0] as number, scale[2] as number]} />
          <meshStandardMaterial color="#080f1a" roughness={0.95} />
        </mesh>
      ))}
      {/* Buildings */}
      {BUILDINGS.map((b, i) => (
        <group key={i} position={[b.p[0], b.s[1] / 2, b.p[2]]}>
          <mesh castShadow>
            <boxGeometry args={b.s as [number,number,number]} />
            <meshStandardMaterial color={b.c} roughness={0.85} metalness={0.1} />
          </mesh>
          <mesh position={[0, b.s[1] / 2 + 0.06, 0]}>
            <boxGeometry args={[b.s[0] + 0.1, 0.1, b.s[2] + 0.1]} />
            <meshStandardMaterial color="#00b4d8" emissive="#00b4d8" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ─── Camera follow ────────────────────────────────────────────────────────────

function CameraFollow({
  posRef, angleRef
}: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  angleRef: React.MutableRefObject<number>;
}) {
  const camPos  = useRef(new THREE.Vector3(0, 9, 18));
  const camLook = useRef(new THREE.Vector3(0, 0, 0));
  const { camera } = useThree();

  useFrame((_, dt) => {
    const p = posRef.current;
    const a = angleRef.current;
    const D = 7.5, H = 5.5;
    const tx = p.x - Math.sin(a) * D;
    const tz = p.z - Math.cos(a) * D;
    const s = 1 - Math.pow(0.003, dt);
    camPos.current.lerp(new THREE.Vector3(tx, p.y + H, tz), s);
    camLook.current.lerp(new THREE.Vector3(p.x, p.y + 0.6, p.z), s * 1.5);
    camera.position.copy(camPos.current);
    camera.lookAt(camLook.current);
  });

  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({
  posRef, angleRef, velRef, wheelAngleRef, carGroupRef, update, onZoneEnter, activeZone
}: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  angleRef: React.MutableRefObject<number>;
  velRef: React.MutableRefObject<number>;
  wheelAngleRef: React.MutableRefObject<number>;
  carGroupRef: React.RefObject<THREE.Group>;
  update: (dt: number) => { pos: THREE.Vector3; angle: number; vel: number; wheelAngle: number };
  onZoneEnter: (id: string | null) => void;
  activeZone: string | null;
}) {
  const lastZone = useRef<string | null>(null);

  useFrame((_, dt) => {
    const state = update(dt);
    if (carGroupRef.current) {
      carGroupRef.current.position.copy(state.pos);
      carGroupRef.current.rotation.y = state.angle;
    }
    // Zone detection
    let zone: string | null = null;
    for (const z of ZONE_DATA) {
      const dx = state.pos.x - z.pos[0];
      const dz = state.pos.z - z.pos[2];
      if (Math.abs(dx) < 4.8 && Math.abs(dz) < 4.8) { zone = z.id; break; }
    }
    if (zone !== lastZone.current) { lastZone.current = zone; onZoneEnter(zone); }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight position={[12, 22, 10]} intensity={0.5} castShadow color="#a8c0e0"
        shadow-mapSize={[1024, 1024]} shadow-camera-near={0.5} shadow-camera-far={80}
        shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      <pointLight position={[0, 18, 0]} intensity={0.25} color="#0047ab" />
      <Stars radius={90} depth={30} count={1800} factor={3} saturation={0} fade speed={0.5} />
      <World />
      {ZONE_DATA.map((z) => <Zone key={z.id} data={z} isActive={activeZone === z.id} />)}
      <CarMesh carGroupRef={carGroupRef} velRef={velRef} wheelAngleRef={wheelAngleRef} />
      <CameraFollow posRef={posRef} angleRef={angleRef} />
    </>
  );
}

// ─── Info panel ───────────────────────────────────────────────────────────────

function InfoPanel({ zone, onClose }: { zone: ZoneDef | null; onClose: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (zone) setTimeout(() => setShow(true), 40);
    else setShow(false);
  }, [zone]);
  if (!zone) return null;
  return (
    <div className={`fixed top-1/2 right-4 md:right-8 -translate-y-1/2 z-40 w-76 max-w-xs transition-all duration-300 ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
      <div className="rounded-2xl p-5 border backdrop-blur-md shadow-2xl"
        style={{ borderColor: zone.color + "55", background: "linear-gradient(135deg,#050a12ee,#0a1628ee)", boxShadow: `0 0 32px ${zone.color}28` }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase mb-0.5" style={{ color: zone.color }}>
              {zone.icon} Zone Entered
            </p>
            <h3 className="font-serif font-bold text-base text-white leading-snug">{zone.title}</h3>
            <p className="font-mono text-[10px] text-gray-400 mt-0.5">{zone.subtitle}</p>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
            style={{ background: zone.color + "22" }}>
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="h-px mb-3 rounded" style={{ background: `linear-gradient(90deg,${zone.color},transparent)` }} />
        <ul className="space-y-1.5">
          {zone.content.map((line, i) => (
            <li key={i} className="font-mono text-[11px] text-gray-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: zone.color }} />
              {line}
            </li>
          ))}
        </ul>
        {"link" in zone && (zone as ZoneDef & { link?: string }).link && (
          <a href={(zone as ZoneDef & { link?: string }).link} className="mt-3 block text-center font-mono text-[11px] py-2 rounded-lg"
            style={{ background: zone.color + "25", color: zone.color, border: `1px solid ${zone.color}35` }}>
            Send Email →
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Mini-map ─────────────────────────────────────────────────────────────────

function MiniMap({ posRef, angleRef, activeZone }: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  angleRef: React.MutableRefObject<number>;
  activeZone: string | null;
}) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const SZ = 130, WORLD = 96;

  useEffect(() => {
    let rid: number;
    const draw = () => {
      const c = cvs.current; if (!c) return;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, SZ, SZ);
      ctx.fillStyle = "#040810"; ctx.fillRect(0, 0, SZ, SZ);
      // grid
      ctx.strokeStyle = "#071228"; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 8; i++) {
        const p = (i / 8) * SZ;
        ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, SZ); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(SZ, p); ctx.stroke();
      }
      // zones
      ZONE_DATA.forEach(z => {
        const cx = (z.pos[0] / WORLD + 0.5) * SZ;
        const cy = (z.pos[2] / WORLD + 0.5) * SZ;
        const r = 11 * (SZ / WORLD);
        ctx.fillStyle = z.color + (activeZone === z.id ? "60" : "25");
        ctx.strokeStyle = z.color;
        ctx.lineWidth = activeZone === z.id ? 1.5 : 0.7;
        ctx.beginPath(); ctx.rect(cx - r, cy - r, r*2, r*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = z.color; ctx.font = "5px monospace"; ctx.textAlign = "center";
        ctx.fillText(z.label.slice(0, 6), cx, cy + 2);
      });
      // car
      const cx = (posRef.current.x / WORLD + 0.5) * SZ;
      const cy = (posRef.current.z / WORLD + 0.5) * SZ;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angleRef.current);
      ctx.fillStyle = "#00eeff";
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(-3, 3); ctx.lineTo(3, 3); ctx.closePath(); ctx.fill();
      ctx.restore();
      rid = requestAnimationFrame(draw);
    };
    rid = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rid);
  }, [activeZone, posRef, angleRef]);

  return (
    <div className="fixed bottom-20 left-4 z-40 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,180,216,0.3)", boxShadow: "0 0 18px rgba(0,180,216,0.12)" }}>
      <canvas ref={cvs} width={SZ} height={SZ} style={{ display: "block" }} />
      <div style={{ background: "#040810", color: "rgba(0,180,216,0.6)", fontSize: 9, fontFamily: "monospace", textAlign: "center", padding: "2px 0" }}>
        MINI-MAP
      </div>
    </div>
  );
}

// ─── Touch controls ───────────────────────────────────────────────────────────

function TouchControls({ pressKey, releaseKey }: { pressKey: (c: string) => void; releaseKey: (c: string) => void }) {
  const mkBtn = (code: string, icon: React.ReactNode) => (
    <button
      key={code}
      onPointerDown={(e) => { e.preventDefault(); pressKey(code); }}
      onPointerUp={() => releaseKey(code)}
      onPointerLeave={() => releaseKey(code)}
      className="w-11 h-11 rounded-xl flex items-center justify-center select-none"
      style={{ background: "rgba(0,180,216,0.12)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8" }}
    >
      {icon}
    </button>
  );
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-1 md:hidden">
      {mkBtn("ArrowUp", <ChevronUp className="w-5 h-5" />)}
      <div className="flex gap-1">
        {mkBtn("ArrowLeft",  <ChevronLeft  className="w-5 h-5" />)}
        {mkBtn("ArrowDown",  <ChevronDown  className="w-5 h-5" />)}
        {mkBtn("ArrowRight", <ChevronRight className="w-5 h-5" />)}
      </div>
    </div>
  );
}

// ─── HUD ──────────────────────────────────────────────────────────────────────

function HUD({ activeZone, velRef }: { activeZone: string | null; velRef: React.MutableRefObject<number> }) {
  const [spd, setSpd] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSpd(Math.round(Math.abs(velRef.current) * 3.6)), 100);
    return () => clearInterval(id);
  }, [velRef]);

  const zone = ZONE_DATA.find(z => z.id === activeZone);

  return (
    <div className="fixed top-0 inset-x-0 z-40 h-11 bg-black/60 backdrop-blur-md border-b flex items-center px-4 gap-3"
      style={{ borderColor: "rgba(0,180,216,0.2)" }}>
      <span className="font-serif font-bold text-lg" style={{ color: "#00b4d8", textShadow: "0 0 14px rgba(0,180,216,0.8)" }}>AHZ</span>
      <span className="font-mono text-[10px] hidden sm:block" style={{ color: "rgba(0,180,216,0.5)" }}>Drive to explore</span>
      <div className="ml-auto flex items-center gap-4">
        {zone && (
          <span className="font-mono text-[10px] animate-pulse" style={{ color: zone.color }}>
            ▶ {zone.icon} {zone.label}
          </span>
        )}
        <span className="font-mono text-[10px]" style={{ color: "rgba(0,180,216,0.6)" }}>{spd} km/h</span>
      </div>
      <div className="hidden md:flex items-center gap-2 text-[9px] font-mono" style={{ color: "rgba(0,180,216,0.35)" }}>
        <span>WASD</span><span>·</span><span>Drive into zones</span>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CarGame() {
  const carGroupRef = useRef<THREE.Group>(null);
  const { update, posRef, angleRef, velRef, wheelAngleRef, pressKey, releaseKey } = useCar();
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [panelZone, setPanelZone] = useState<ZoneDef | null>(null);

  const handleZoneEnter = useCallback((id: string | null) => {
    setActiveZone(id);
    if (id) setPanelZone(ZONE_DATA.find(z => z.id === id) ?? null);
  }, []);

  return (
    <div data-testid="car-game-root" className="fixed inset-0" style={{ background: "#040810", touchAction: "none" }}>
      <Suspense fallback={
        <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: "#040810" }}>
          <div className="font-serif font-bold text-4xl mb-3" style={{ color: "#00b4d8", textShadow: "0 0 20px rgba(0,180,216,0.8)" }}>AHZ</div>
          <p className="font-mono text-sm" style={{ color: "rgba(0,180,216,0.6)" }}>Loading 3D World…</p>
        </div>
      }>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: false, powerPreference: "default", failIfMajorPerformanceCaveat: false }}
          camera={{ fov: 60, near: 0.1, far: 200, position: [0, 9, 18] }}
        >
          <fog attach="fog" args={["#040810", 28, 75]} />
          <Scene
            posRef={posRef}
            angleRef={angleRef}
            velRef={velRef}
            wheelAngleRef={wheelAngleRef}
            carGroupRef={carGroupRef}
            update={update}
            onZoneEnter={handleZoneEnter}
            activeZone={activeZone}
          />
        </Canvas>
      </Suspense>

      <HUD activeZone={activeZone} velRef={velRef} />
      <InfoPanel zone={panelZone} onClose={() => setPanelZone(null)} />
      <MiniMap posRef={posRef} angleRef={angleRef} activeZone={activeZone} />
      <TouchControls pressKey={pressKey} releaseKey={releaseKey} />
    </div>
  );
}
