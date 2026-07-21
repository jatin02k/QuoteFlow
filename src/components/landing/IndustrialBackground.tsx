"use client";

import React, { useEffect, useRef } from "react";

/**
 * Industrial Gear SVG Component
 * Heavy-duty precision vector gear with tooth-by-tooth cogs & cutouts
 */
function GearSvg({
  teeth,
  radius,
  holeRadius = radius * 0.35,
  spokeCount = 5,
  className = "",
}: {
  teeth: number;
  radius: number;
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

  const cutoutRadius = holeRadius * 0.55;
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
      className={`overflow-visible ${className}`}
    >
      <path
        d={gearPath}
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle
        cx={center}
        cy={center}
        r={innerRadius * 0.86}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="10 6"
        opacity="0.85"
      />
      {cutouts.map((c, idx) => (
        <circle
          key={idx}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="#121316"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      ))}
      <circle
        cx={center}
        cy={center}
        r={holeRadius}
        fill="#121316"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx={center}
        cy={center}
        r={holeRadius * 0.4}
        fill="currentColor"
        fillOpacity="0.6"
      />
    </svg>
  );
}

// Hex Bolt SVG Component
function HexBolt({ x, y, size = 28, rotation = 0, className = "" }: { x: string; y: string; size?: number; rotation?: number; className?: string }) {
  return (
    <svg
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`absolute pointer-events-none opacity-45 ${className}`}
    >
      <polygon
        points="20,2 35,10 35,30 20,38 5,30 5,10"
        fill="#1A1C22"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="2.5" />
      <line x1="20" y1="16" x2="20" y2="24" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

// Screw / Washer SVG Component
function ScrewComponent({ x, y, size = 22, rotation = 0, className = "" }: { x: string; y: string; size?: number; rotation?: number; className?: string }) {
  return (
    <svg
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
      width={size}
      height={size}
      viewBox="0 0 30 30"
      className={`absolute pointer-events-none opacity-40 ${className}`}
    >
      <circle cx="15" cy="15" r="12" fill="#1A1C22" stroke="currentColor" strokeWidth="3" />
      <line x1="8" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="3" />
      <line x1="15" y1="8" x2="15" y2="22" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function IndustrialBackground() {
  const gear1Ref = useRef<HTMLDivElement>(null);
  const gear2Ref = useRef<HTMLDivElement>(null);
  const gear3Ref = useRef<HTMLDivElement>(null);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let currentScroll = window.scrollY;

    const updateRotation = () => {
      currentScroll = window.scrollY;
      const baseRotation = currentScroll * 0.15;

      // Gear 1 (Main Central - 30 teeth)
      if (gear1Ref.current) {
        gear1Ref.current.style.transform = `rotate(${baseRotation}deg)`;
      }

      // Gear 2 (Interlocking Top Right - 18 teeth: ratio 30/18 = 1.666)
      if (gear2Ref.current) {
        const gear2Rotation = -baseRotation * (30 / 18);
        gear2Ref.current.style.transform = `rotate(${gear2Rotation}deg)`;
      }

      // Gear 3 (Interlocking Bottom Left - 12 teeth: ratio 30/12 = 2.5)
      if (gear3Ref.current) {
        const gear3Rotation = baseRotation * (30 / 12);
        gear3Ref.current.style.transform = `rotate(${gear3Rotation}deg)`;
      }

      requestRef.current = requestAnimationFrame(updateRotation);
    };

    requestRef.current = requestAnimationFrame(updateRotation);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#121316] text-[#6B7280]">
      {/* Rugged Wall Texture & Lighting */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(193, 127, 36, 0.15) 0%, transparent 65%),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 80px 80px, 80px 80px",
        }}
      />

      {/* Industrial Pipelines Vector Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-35 stroke-[#4B5563]" fill="none">
        {/* Horizontal Main Pipe */}
        <line x1="0" y1="18%" x2="100%" y2="18%" strokeWidth="8" />
        <line x1="0" y1="18%" x2="100%" y2="18%" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="16 12" />
        {/* Pipe Flange Joints */}
        <rect x="15%" y="15%" width="12" height="20" fill="#374151" stroke="#9CA3AF" strokeWidth="2" />
        <rect x="75%" y="15%" width="12" height="20" fill="#374151" stroke="#9CA3AF" strokeWidth="2" />

        {/* Vertical Feed Pipe */}
        <line x1="85%" y1="0" x2="85%" y2="100%" strokeWidth="8" />
        <line x1="85%" y1="0" x2="85%" y2="100%" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="16 12" />
        <rect x="83.5%" y="40%" width="20" height="12" fill="#374151" stroke="#9CA3AF" strokeWidth="2" />

        {/* Pressure Gauge Dial on Pipe */}
        <circle cx="85%" cy="40%" r="14" fill="#1F2937" stroke="#C17F24" strokeWidth="2" />
        <line x1="85%" y1="40%" x2="88%" y2="34%" stroke="#C17F24" strokeWidth="2" />
      </svg>

      {/* Scattered Hex Bolts & Screws */}
      <HexBolt x="10%" y="12%" size={32} rotation={15} className="text-[#9CA3AF]" />
      <HexBolt x="88%" y="15%" size={28} rotation={45} className="text-[#9CA3AF]" />
      <HexBolt x="78%" y="82%" size={34} rotation={70} className="text-[#6B7280]" />
      <HexBolt x="12%" y="75%" size={30} rotation={110} className="text-[#9CA3AF]" />

      <ScrewComponent x="5%" y="45%" size={24} rotation={30} className="text-[#D1D5DB]" />
      <ScrewComponent x="92%" y="60%" size={22} rotation={80} className="text-[#D1D5DB]" />
      <ScrewComponent x="48%" y="8%" size={26} rotation={15} className="text-[#C17F24]" />
      <ScrewComponent x="52%" y="90%" size={24} rotation={135} className="text-[#D1D5DB]" />

      {/* Centered 3 Heavy Interlocking Gears (Aligned Tooth-by-Tooth) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 scale-95 sm:scale-100 lg:scale-115">
        <div className="relative w-[700px] h-[700px] flex items-center justify-center">
          {/* Main Heavy Center Gear (Gear 1: 30 Teeth, Radius 210px) */}
          <div
            ref={gear1Ref}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform text-[#9CA3AF]"
            style={{ transformOrigin: "center center" }}
          >
            <GearSvg teeth={30} radius={210} spokeCount={6} />
          </div>

          {/* Interlocking Secondary Gear (Gear 2: 18 Teeth, Radius 126px, Top Right Tooth-by-Tooth Mesh) */}
          <div
            ref={gear2Ref}
            className="absolute top-[92px] right-[52px] will-change-transform text-[#D1D5DB]"
            style={{ transformOrigin: "center center" }}
          >
            <GearSvg teeth={18} radius={126} spokeCount={5} />
          </div>

          {/* Interlocking Small Gear (Gear 3: 12 Teeth, Radius 84px, Bottom Left Amber Accent Mesh) */}
          <div
            ref={gear3Ref}
            className="absolute bottom-[98px] left-[62px] will-change-transform text-[#C17F24]"
            style={{ transformOrigin: "center center" }}
          >
            <GearSvg teeth={12} radius={84} spokeCount={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
