"use client";

import React, { useEffect, useRef } from "react";

/**
 * Authentic Mechanical Gear SVG Component
 * Generates CAD manufacturing gear filled with corporate / davy gray colors
 * and light-outlined cog teeth for maximum definition
 */
function RealGearSvg({
  teeth,
  radius,
  fillColor,
  strokeColor,
  lightOutlineColor = "#E2E8F0",
  holeRadius = radius * 0.35,
  spokeCount = 6,
  className = "",
}: {
  teeth: number;
  radius: number;
  fillColor: string;
  strokeColor: string;
  lightOutlineColor?: string;
  holeRadius?: number;
  spokeCount?: number;
  className?: string;
}) {
  const size = radius * 2.4;
  const center = size / 2;
  const toothDepth = radius * 0.16;
  const outerRadius = radius + toothDepth / 2;
  const innerRadius = radius - toothDepth / 2;

  let gearPath = "";
  const totalAngle = Math.PI * 2;
  const anglePerTeeth = totalAngle / teeth;

  for (let i = 0; i < teeth; i++) {
    const startAngle = i * anglePerTeeth;
    const a1 = startAngle + anglePerTeeth * 0.15;
    const a2 = startAngle + anglePerTeeth * 0.35;
    const a3 = startAngle + anglePerTeeth * 0.65;
    const a4 = startAngle + anglePerTeeth * 0.85;

    const x1 = center + innerRadius * Math.cos(a1);
    const y1 = center + innerRadius * Math.sin(a1);
    const x2 = center + outerRadius * Math.cos(a2);
    const y2 = center + outerRadius * Math.sin(a2);
    const x3 = center + outerRadius * Math.cos(a3);
    const y3 = center + outerRadius * Math.sin(a3);
    const x4 = center + innerRadius * Math.cos(a4);
    const y4 = center + innerRadius * Math.sin(a4);

    if (i === 0) {
      gearPath += `M ${x1} ${y1}`;
    } else {
      gearPath += ` L ${x1} ${y1}`;
    }
    gearPath += ` L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`;
  }
  gearPath += " Z";

  const cutoutRadius = holeRadius * 0.6;
  const cutoutDist = (innerRadius + holeRadius) / 2;
  const cutouts = [];
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i * Math.PI * 2) / spokeCount;
    const cx = center + cutoutDist * Math.cos(angle);
    const cy = center + cutoutDist * Math.sin(angle);
    cutouts.push({ cx, cy, r: cutoutRadius });
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`overflow-visible drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* Outer Glow / Shadow Bevel */}
      <path
        d={gearPath}
        fill="none"
        stroke="#000000"
        strokeWidth="6"
        strokeLinejoin="round"
        opacity="0.4"
      />

      {/* Solid Filled Gear Body (Davy's / Corporate Gray) */}
      <path
        d={gearPath}
        fill={fillColor}
        fillOpacity="0.82"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Light Outlined Cog Teeth Profile */}
      <path
        d={gearPath}
        fill="none"
        stroke={lightOutlineColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Inner Pitch Circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius * 0.86}
        fill="none"
        stroke={lightOutlineColor}
        strokeWidth="1.5"
        strokeDasharray="8 6"
        opacity="0.75"
      />

      {/* Mechanical Cutout Spoke Holes */}
      {cutouts.map((c, idx) => (
        <circle
          key={idx}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="#1E222A"
          stroke={lightOutlineColor}
          strokeWidth="2"
        />
      ))}

      {/* Central Keyway Hub */}
      <circle
        cx={center}
        cy={center}
        r={holeRadius}
        fill="#1E222A"
        stroke={lightOutlineColor}
        strokeWidth="2.5"
      />

      {/* Axle Key Notch */}
      <rect
        x={center - holeRadius * 0.2}
        y={center - holeRadius - 4}
        width={holeRadius * 0.4}
        height={8}
        fill="#1E222A"
        stroke={lightOutlineColor}
        strokeWidth="1.8"
      />

      <circle
        cx={center}
        cy={center}
        r={holeRadius * 0.45}
        fill={lightOutlineColor}
        fillOpacity="0.6"
      />
    </svg>
  );
}

interface ParticleConfig {
  id: string;
  type: "bolt" | "screw";
  basePctX: number;
  basePctY: number;
  size: number;
  baseRotation: number;
  colorClass: string;
}

const PARTICLES: ParticleConfig[] = [
  { id: "b1", type: "bolt", basePctX: 6, basePctY: 8, size: 34, baseRotation: 25, colorClass: "text-[#94A3B8]" },
  { id: "b2", type: "bolt", basePctX: 92, basePctY: 10, size: 30, baseRotation: 55, colorClass: "text-[#CBD5E1]" },
  { id: "b3", type: "bolt", basePctX: 14, basePctY: 42, size: 32, baseRotation: 110, colorClass: "text-[#94A3B8]" },
  { id: "b4", type: "bolt", basePctX: 84, basePctY: 48, size: 36, baseRotation: 75, colorClass: "text-[#F59E0B]" },
  { id: "b5", type: "bolt", basePctX: 8, basePctY: 82, size: 38, baseRotation: 145, colorClass: "text-[#94A3B8]" },
  { id: "b6", type: "bolt", basePctX: 90, basePctY: 85, size: 34, baseRotation: 40, colorClass: "text-[#CBD5E1]" },
  { id: "b7", type: "bolt", basePctX: 50, basePctY: 6, size: 28, baseRotation: 90, colorClass: "text-[#F59E0B]" },

  { id: "s1", type: "screw", basePctX: 4, basePctY: 24, size: 26, baseRotation: 15, colorClass: "text-[#CBD5E1]" },
  { id: "s2", type: "screw", basePctX: 95, basePctY: 30, size: 24, baseRotation: 75, colorClass: "text-[#94A3B8]" },
  { id: "s3", type: "screw", basePctX: 18, basePctY: 68, size: 28, baseRotation: 130, colorClass: "text-[#F59E0B]" },
  { id: "s4", type: "screw", basePctX: 80, basePctY: 72, size: 26, baseRotation: 45, colorClass: "text-[#CBD5E1]" },
  { id: "s5", type: "screw", basePctX: 42, basePctY: 92, size: 30, baseRotation: 105, colorClass: "text-[#94A3B8]" },
  { id: "s6", type: "screw", basePctX: 62, basePctY: 94, size: 26, baseRotation: 20, colorClass: "text-[#F59E0B]" },
];

export default function IndustrialBackground() {
  const gear1Ref = useRef<HTMLDivElement>(null);
  const gear2Ref = useRef<HTMLDivElement>(null);
  const gear3Ref = useRef<HTMLDivElement>(null);

  const particleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef({ y: 0, prevY: 0, vy: 0 });
  const gearAngleRef = useRef(0);

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollRef.current.vy = currentScroll - scrollRef.current.prevY;
      scrollRef.current.prevY = currentScroll;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("scroll", handleScroll);

    let requestRef: number;
    const currentOffsets = new Map<string, { x: number; y: number; r: number }>();

    PARTICLES.forEach((p) => {
      currentOffsets.set(p.id, { x: 0, y: 0, r: 0 });
    });

    const updateLoop = () => {
      // 1. GEAR ROTATION MATH (Constant Slow Idle + Scroll Speed Up - NO CURSOR ROTATION)
      const idleSpeed = 0.08; // Constant smooth slow background rotation
      
      // Decay scroll velocity input
      scrollRef.current.vy *= 0.9;
      const scrollBonus = Math.abs(scrollRef.current.vy) * 0.08;

      gearAngleRef.current += idleSpeed + scrollBonus;

      const currentAngle = gearAngleRef.current;

      if (gear1Ref.current) {
        gear1Ref.current.style.transform = `rotate(${currentAngle}deg)`;
      }
      if (gear2Ref.current) {
        gear2Ref.current.style.transform = `rotate(${-currentAngle * 1.5}deg)`;
      }
      if (gear3Ref.current) {
        gear3Ref.current.style.transform = `rotate(${currentAngle * 2.25}deg)`;
      }

      // 2. SCREWS & BOLTS CURSOR MAGNETIC REPULSION / REACTION
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      PARTICLES.forEach((p) => {
        const el = particleRefs.current.get(p.id);
        if (!el) return;

        const homeX = (p.basePctX / 100) * winW;
        const homeY = (p.basePctY / 100) * winH;

        const current = currentOffsets.get(p.id) || { x: 0, y: 0, r: 0 };
        const actualX = homeX + current.x;
        const actualY = homeY + current.y;

        const dx = actualX - mouseX;
        const dy = actualY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 220; // Magnetic field radius around cursor

        let targetDx = 0;
        let targetDy = 0;
        let targetDr = 0;

        if (dist < radius && dist > 0) {
          const force = (1 - dist / radius) * 90; // Push force strength
          const angle = Math.atan2(dy, dx);
          targetDx = Math.cos(angle) * force;
          targetDy = Math.sin(angle) * force;
          targetDr = force * 2; // Extra spin on push
        }

        // Smooth Lerp physics towards target home offset
        current.x += (targetDx - current.x) * 0.12;
        current.y += (targetDy - current.y) * 0.12;
        current.r += (targetDr - current.r) * 0.1;

        currentOffsets.set(p.id, current);

        el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0px) rotate(${p.baseRotation + current.r}deg)`;
      });

      requestRef = requestAnimationFrame(updateLoop);
    };

    requestRef = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#2E323B] text-[#94A3B8]">
      {/* Iron Gray Wall Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, #3D4452 0%, #252930 100%)
          `,
        }}
      />

      {/* Interactive Scattered Screws, Nuts & Bolts Reacting to Cursor */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          ref={(node) => {
            if (node) particleRefs.current.set(p.id, node);
            else particleRefs.current.delete(p.id);
          }}
          className="absolute pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${p.basePctX}%`,
            top: `${p.basePctY}%`,
            transform: `rotate(${p.baseRotation}deg)`,
          }}
        >
          {p.type === "bolt" ? (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 40 40"
              className={`opacity-60 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${p.colorClass}`}
            >
              <polygon
                points="20,2 35,10 35,30 20,38 5,30 5,10"
                fill="#1E222A"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="15" y1="20" x2="25" y2="20" stroke="currentColor" strokeWidth="2.5" />
              <line x1="20" y1="15" x2="20" y2="25" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 30 30"
              className={`opacity-55 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${p.colorClass}`}
            >
              <circle cx="15" cy="15" r="12" fill="#1E222A" stroke="currentColor" strokeWidth="3" />
              <line x1="8" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="3" />
              <line x1="15" y1="8" x2="15" y2="22" stroke="currentColor" strokeWidth="3" />
            </svg>
          )}
        </div>
      ))}

      {/* HUGE Screen-Covering Interlocking Gears Cluster (CONSTANT IDLE ROTATION + SPEED UP ON SCROLL ONLY) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-75 scale-100 sm:scale-110 lg:scale-125">
        <div className="relative w-[1050px] h-[1050px] flex items-center justify-center">
          {/* Main Center Gear (36 Teeth) */}
          <div
            ref={gear1Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <RealGearSvg teeth={36} radius={320} fillColor="#374151" strokeColor="#475569" lightOutlineColor="#E2E8F0" spokeCount={6} />
          </div>

          {/* Interlocking Secondary Gear (Top Right - 24 Teeth) */}
          <div
            ref={gear2Ref}
            className="absolute top-[120px] right-[70px] will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <RealGearSvg teeth={24} radius={213} fillColor="#555555" strokeColor="#6B7280" lightOutlineColor="#CBD5E1" spokeCount={5} />
          </div>

          {/* Interlocking Small Gear (Bottom Left - 16 Teeth) */}
          <div
            ref={gear3Ref}
            className="absolute bottom-[130px] left-[85px] will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            <RealGearSvg teeth={16} radius={142} fillColor="#1F2937" strokeColor="#374151" lightOutlineColor="#94A3B8" spokeCount={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
