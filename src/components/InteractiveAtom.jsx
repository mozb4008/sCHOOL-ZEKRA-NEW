import React, { useState } from 'react';
import { Sparkles, Play, Pause, Info, Zap } from 'lucide-react';

export const atomPresets = [
  { symbol: "H", name: "الهيدروجين", z: 1, shells: [1], desc: "إلكترون وحيد في مستوى n=1" },
  { symbol: "C", name: "الكربون", z: 6, shells: [2, 4], desc: "مستويان للطاقة: 2 إلكترون في K و 4 في L" },
  { symbol: "Na", name: "الصوديوم", z: 11, shells: [2, 8, 1], desc: "3 مستويات رئيسية، إلكترون تكافؤ وحيد في 3s" },
  { symbol: "Cl", name: "الكلور", z: 17, shells: [2, 8, 7], desc: "7 إلكترونات تكافؤ في المستوى الخارجي" },
  { symbol: "Cr", name: "الكروم (استثناء)", z: 24, shells: [2, 8, 13, 1], desc: "استقرار نصف الامتلاء: [Ar] 4s¹ 3d⁵" },
  { symbol: "Cu", name: "النحاس (استثناء)", z: 29, shells: [2, 8, 18, 1], desc: "استقرار الامتلاء الكامل: [Ar] 4s¹ 3d¹⁰" },
];

export default function InteractiveAtom({ onSelectPreset }) {
  const [selectedAtom, setSelectedAtom] = useState(atomPresets[2]); // Default to Sodium (Na)
  const [isRotating, setIsRotating] = useState(true);
  const [speed, setSpeed] = useState(1); // 1 = normal, 0.5 = slow, 2 = fast
  const [activeOrbit, setActiveOrbit] = useState(null);

  const handleSelect = (atom) => {
    setSelectedAtom(atom);
    if (onSelectPreset) onSelectPreset(atom);
  };

  // Orbital radii and inclination angles for visually stunning 3D look
  const orbitRadii = [65, 110, 155, 195];
  const orbitColors = ['#07a869', '#0da9a6', '#3d7eb9', '#7258a4'];
  const shellLabels = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col items-center relative overflow-hidden">
      
      {/* Decorative gradient glow behind the atom */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-moe-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-moe-green/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls of the visualizer */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-moe-green animate-pulse" />
            <h3 className="text-lg font-bold text-moe-navy">النموذج التفاعلي لذرة العنصر</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            تأملي حركة الإلكترونات في المدارات واضغطي على أي مدار لاكتشاف سعته
          </p>
        </div>

        {/* Speed & Pause controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-xl hover:bg-white text-slate-700 transition-colors"
            title={isRotating ? "إيقاف مؤقت" : "تشغيل الدوران"}
          >
            {isRotating ? <Pause className="w-4 h-4 text-moe-navy" /> : <Play className="w-4 h-4 text-moe-green" />}
          </button>
          
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 0.5 : 1)}
            className="px-2.5 py-1 rounded-xl bg-white text-slate-700 hover:text-moe-green border border-slate-200 transition-colors"
          >
            السرعة: {speed === 0.5 ? 'بطيئة' : speed === 1 ? 'عادية' : 'سريعة'}
          </button>
        </div>
      </div>

      {/* Quick Element Selectors */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 z-10">
        {atomPresets.map((atom) => (
          <button
            key={atom.symbol}
            onClick={() => handleSelect(atom)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAtom.symbol === atom.symbol
                ? 'bg-moe-navy text-white shadow-md scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="font-mono text-moe-green font-extrabold">{atom.symbol}</span>
            <span>{atom.name}</span>
            <span className="text-[10px] opacity-70">({atom.z})</span>
          </button>
        ))}
      </div>

      {/* The Interactive SVG Atom Visualizer */}
      <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center my-2 select-none">
        <svg 
          viewBox="-220 -220 440 440" 
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Nucleus Glow Filter */}
            <filter id="nucleus-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Electron Glow */}
            <filter id="electron-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Radial Gradient for Nucleus */}
            <radialGradient id="nucleusGradient" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </radialGradient>
          </defs>

          {/* Orbits rendering */}
          {selectedAtom.shells.map((count, index) => {
            const radius = orbitRadii[index] || 200;
            const orbitColor = orbitColors[index] || '#64748b';
            const isActive = activeOrbit === index;
            // Inclination angles to simulate 3D gyroscope atom
            const inclination = (index * 35) - 20;

            return (
              <g 
                key={`orbit-${index}`}
                transform={`rotate(${inclination})`}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setActiveOrbit(index)}
              >
                {/* Background dashed orbit track */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={radius}
                  ry={radius * 0.45}
                  fill="none"
                  stroke={isActive ? orbitColor : '#cbd5e1'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  strokeDasharray={isActive ? "none" : "4 4"}
                  className="transition-colors hover:stroke-moe-teal"
                  opacity={isActive ? 1 : 0.65}
                />

                {/* Rotating group holding the electrons */}
                <g 
                  style={{
                    animation: isRotating 
                      ? `spin ${Math.max(8, (20 + index * 8) / speed)}s linear infinite ${index % 2 === 1 ? 'reverse' : 'normal'}`
                      : 'none',
                    transformOrigin: '0 0'
                  }}
                >
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / count;
                    const ex = radius * Math.cos(angle);
                    const ey = (radius * 0.45) * Math.sin(angle);

                    return (
                      <g key={`e-${index}-${eIdx}`}>
                        {/* Glow halo */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r="6"
                          fill={orbitColor}
                          opacity="0.3"
                          filter="url(#electron-glow)"
                        />
                        {/* Core electron dot */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r="4"
                          fill={orbitColor}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Central Pulsating Nucleus */}
          <g className="cursor-pointer" onClick={() => setActiveOrbit(null)}>
            {/* Outer energy aura */}
            <circle
              cx="0"
              cy="0"
              r="28"
              fill="#ef4444"
              opacity="0.2"
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
            {/* Nucleus main sphere */}
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="url(#nucleusGradient)"
              filter="url(#nucleus-glow)"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Nucleus text info */}
            <text
              x="0"
              y="1"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="900"
              className="font-mono pointer-events-none select-none"
            >
              {selectedAtom.symbol}
            </text>
            <text
              x="0"
              y="13"
              textAnchor="middle"
              fill="#fed7aa"
              fontSize="7"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              +{selectedAtom.z}p
            </text>
          </g>
        </svg>

        {/* Orbit information floating pill */}
        {activeOrbit !== null && (
          <div className="absolute bottom-2 bg-moe-navy text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-moe-teal/30 flex items-center gap-2 animate-in fade-in duration-200">
            <Info className="w-3.5 h-3.5 text-moe-teal" />
            <span>المستوى {shellLabels[activeOrbit]}: يحتوي على {selectedAtom.shells[activeOrbit]} إلكترون</span>
          </div>
        )}
      </div>

      {/* Selected Element Quick Information Bar */}
      <div className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-moe-navy text-white flex items-center justify-center font-bold text-sm">
            {selectedAtom.symbol}
          </div>
          <div>
            <div className="font-bold text-slate-800">
              عنصر {selectedAtom.name} (العدد الذري: {selectedAtom.z})
            </div>
            <div className="text-slate-500 text-[11px]">
              {selectedAtom.desc}
            </div>
          </div>
        </div>

        {/* Shell capacity pills */}
        <div className="flex items-center gap-1.5">
          {selectedAtom.shells.map((val, idx) => (
            <div 
              key={idx}
              className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold border ${
                idx === selectedAtom.shells.length - 1
                  ? 'bg-moe-green text-white border-moe-green shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
              title={`المستوى ${idx + 1}`}
            >
              n={idx+1}: {val}e⁻
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
