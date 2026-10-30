import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function OrbitalBoxVisualizer({
  sublevelName = "2p",
  boxes = [["up", "down"], ["up"], []], // Array of orbital boxes with 'up' | 'down'
  labels = ["px", "py", "pz"],
  highlightErrorIndex = null,
  isError = false,
  interactive = false,
  onBoxClick = null,
  size = "md"
}) {
  const boxDimensions = size === "lg" ? "w-14 h-16" : size === "sm" ? "w-8 h-10" : "w-11 h-13";
  const arrowSize = size === "lg" ? "w-5 h-5" : size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="inline-flex flex-col items-center">
      {/* Sublevel title */}
      <span className="text-xs font-bold text-moe-navy mb-1 font-mono">
        {sublevelName}
      </span>

      {/* Connected or grouped orbital boxes */}
      <div className="inline-flex items-center -space-x-px rtl:space-x-reverse">
        {boxes.map((box, idx) => {
          const isTargetedError = highlightErrorIndex === idx;
          const label = labels && labels[idx] ? labels[idx] : `${idx + 1}`;

          return (
            <div
              key={idx}
              onClick={() => interactive && onBoxClick && onBoxClick(idx)}
              className={`${boxDimensions} border-2 relative flex items-center justify-center gap-0.5 bg-white transition-all select-none ${
                isTargetedError || (isError && isTargetedError)
                  ? 'border-red-500 bg-red-50/50 shadow-sm animate-pulse z-10'
                  : 'border-slate-300 hover:border-moe-teal'
              } ${interactive ? 'cursor-pointer hover:bg-slate-50' : ''}`}
            >
              {/* Electron Spin Arrows */}
              <div className="flex items-center justify-center gap-0.5 h-full">
                {box.includes("up") && (
                  <span className="flex flex-col items-center text-moe-green-dark font-black" title="غزل إيجابي (+1/2)">
                    <ArrowUp className={`${arrowSize} stroke-[3] text-emerald-600`} />
                  </span>
                )}
                {box.includes("down") && (
                  <span className="flex flex-col items-center text-moe-blue-dark font-black" title="غزل سلبي (-1/2)">
                    <ArrowDown className={`${arrowSize} stroke-[3] text-blue-600`} />
                  </span>
                )}
                {/* When an error question deliberately renders two UP arrows in the same box */}
                {box.filter(item => item === "up").length > 1 && (
                  <span className="flex flex-col items-center text-red-600 font-black" title="خطأ: سهمان في نفس الاتجاه!">
                    <ArrowUp className={`${arrowSize} stroke-[3] text-red-600`} />
                  </span>
                )}
              </div>

              {/* Sub-label for orbital coordinate (px, py, pz, etc.) */}
              <span className="absolute -bottom-4 text-[9px] text-slate-400 font-mono">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
