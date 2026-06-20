import React from 'react';
import { motion } from 'framer-motion';

export default function Waveform({ value, intensity = 'cyan' }) {
  // value represents kg CO2 / week. Normal baseline is ~150-250 kg.
  // Generate points for the soundwave representation based on value.
  const pointCount = 36;
  const points = [];
  
  // Calculate amplitude: higher carbon = higher amplitude
  const baseAmplitude = Math.min(45, Math.max(8, (value / 250) * 20));
  
  for (let i = 0; i < pointCount; i++) {
    // Generate a beautiful symmetric soundwave-like array of heights
    const factor = Math.sin((i / (pointCount - 1)) * Math.PI);
    const waveHeight = baseAmplitude * factor * (0.6 + 0.4 * Math.sin(i * 0.8));
    points.push(waveHeight);
  }

  // Get color based on intensity rating
  const strokeColor = intensity === 'red' 
    ? '#ef4444' 
    : intensity === 'green' 
      ? '#3A5A40' 
      : '#00D9FF'; // electric cyan default

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const barVariants = {
    initial: { scaleY: 0.3 },
    animate: (customHeight) => ({
      scaleY: [0.3, 1, 0.3],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1.2 + Math.random() * 0.8,
        ease: 'easeInOut'
      }
    })
  };

  return (
    <div className="w-full bg-[#1A1F2E] border border-[rgba(0,217,255,0.15)] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-heavy">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,217,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,217,255,0.02)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
      
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Living Carbon Waveform</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: strokeColor }} />
          <span className="font-mono text-xs font-bold" style={{ color: strokeColor }}>
            {value.toFixed(1)} kg CO₂/week
          </span>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full h-32 flex items-center justify-center gap-[3px] md:gap-[5px] z-10"
      >
        {points.map((pt, i) => (
          <motion.div
            key={i}
            custom={pt}
            variants={barVariants}
            style={{
              width: '4px',
              height: `${Math.max(6, pt * 2.2)}px`,
              backgroundColor: strokeColor,
              borderRadius: '4px',
              transformOrigin: 'center',
              boxShadow: intensity !== 'green' ? `0 0 8px ${strokeColor}44` : 'none'
            }}
          />
        ))}
      </motion.div>
      
      <div className="text-[10px] text-stone-500 text-center font-medium max-w-xs leading-relaxed z-10">
        Real-time audio-frequency emulation of carbon outputs. Peak frequencies adjust dynamically with logged habits.
      </div>
    </div>
  );
}
