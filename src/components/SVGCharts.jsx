import React, { useState } from 'react';

// ==========================================
// 1. DYNAMIC SVG DONUT CHART
// ==========================================
export function SVGDonutChart({ data, categories, activeCategory, onCategoryHover }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Map category IDs to styling colors
  const colorMap = {
    transportation: { stroke: '#10B981', bg: 'bg-emerald-500' }, // emerald
    homeEnergy: { stroke: '#38BDF8', bg: 'bg-sky-400' },      // sky blue
    food: { stroke: '#84CC16', bg: 'bg-lime-500' },          // leaf green
    shopping: { stroke: '#F59E0B', bg: 'bg-amber-500' },      // warning amber
    waste: { stroke: '#EF4444', bg: 'bg-red-500' }            // danger red
  };

  const radius = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius; // ~376.99
  const cx = 100;
  const cy = 100;

  // Compute accumulated segments
  let cumulativePercent = 0;
  const segments = Object.entries(data).map(([key, value]) => {
    const percent = value;
    const strokeLength = (percent / 100) * circumference;
    const strokeOffset = circumference - strokeLength;
    // Rotate offset based on cumulative percent
    const rotation = (cumulativePercent / 100) * 360 - 90; // offset by -90 to start at top
    cumulativePercent += percent;

    return {
      key,
      percent,
      strokeLength,
      strokeOffset,
      rotation,
      color: colorMap[key]?.stroke ?? '#ccc',
      bgColor: colorMap[key]?.bg ?? 'bg-stone-500',
      label: categories[key]?.label ?? key
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      {/* SVG Donut Circle */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full transform transition-transform duration-500"
          aria-label="Carbon emissions breakdown donut chart"
        >
          {/* Base Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth - 2}
            className="dark:stroke-zinc-800"
          />

          {/* Render Active Segments */}
          {segments.map((seg, idx) => {
            const isSelected = hoveredIdx === idx || activeCategory === seg.key;
            return (
              <circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${seg.strokeLength} ${circumference}`}
                strokeDashoffset={seg.strokeOffset}
                transform={`rotate(${seg.rotation} ${cx} ${cy})`}
                strokeLinecap={seg.percent > 0 ? "round" : "butt"}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  if (onCategoryHover) onCategoryHover(seg.key);
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  if (onCategoryHover) onCategoryHover(null);
                }}
                className="transition-all duration-300 cursor-pointer origin-center"
                style={{
                  filter: isSelected ? 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' : 'none',
                }}
              />
            );
          })}

          {/* Center Text Indicator */}
          <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">
            <text
              textAnchor="middle"
              y="-5"
              className="text-[10px] tracking-wider font-extrabold uppercase fill-stone-400 dark:fill-zinc-500"
            >
              Emissions
            </text>
            <text
              textAnchor="middle"
              y="18"
              className="text-xl font-black fill-stone-800 dark:fill-white"
            >
              {hoveredIdx !== null 
                ? `${segments[hoveredIdx].percent}%` 
                : activeCategory 
                  ? `${data[activeCategory]}%`
                  : '100%'
              }
            </text>
          </g>
        </svg>
      </div>

      {/* Grid Legend */}
      <div className="flex-1 w-full space-y-3.5 text-left">
        {segments.map((seg, idx) => {
          const isSelected = hoveredIdx === idx || activeCategory === seg.key;
          return (
            <div 
              key={seg.key}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                if (onCategoryHover) onCategoryHover(seg.key);
              }}
              onMouseLeave={() => {
                setHoveredIdx(null);
                if (onCategoryHover) onCategoryHover(null);
              }}
              className={`flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-stone-100/70 dark:bg-zinc-800/50 scale-[1.02] shadow-subtle border-l-4' 
                  : 'border-l-4 border-transparent'
              }`}
              style={{ borderLeftColor: isSelected ? seg.color : 'transparent' }}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-3.5 h-3.5 rounded-full`} style={{ backgroundColor: seg.color }} />
                <span className="text-sm font-semibold text-stone-700 dark:text-zinc-300">
                  {seg.label}
                </span>
              </div>
              <span className="text-sm font-black text-stone-900 dark:text-white">
                {seg.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. INTERACTIVE WEEKLY LINE CHART
// ==========================================
export function SVGLineChart({ actualData, targetData, unit = 'kg' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Chart dimensions
  const width = 500;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Math helpers
  const maxValue = Math.max(...actualData, ...targetData, 3.0);
  const getX = (index) => paddingX + (index * (width - 2 * paddingX)) / 6;
  const getY = (val) => height - paddingY - (val * (height - 2 * paddingY)) / maxValue;

  // SVG Paths
  let actualPath = '';
  let targetPath = '';
  let actualArea = '';

  actualData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) {
      actualPath += `M ${x} ${y}`;
      actualArea += `M ${x} ${height - paddingY} L ${x} ${y}`;
    } else {
      // Make smooth curve using bezier controls
      const prevX = getX(idx - 1);
      const prevY = getY(actualData[idx - 1]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + (x - prevX) / 2;
      const cpY2 = y;
      actualPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
      actualArea += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
    }

    if (idx === actualData.length - 1) {
      actualArea += ` L ${x} ${height - paddingY} Z`;
    }
  });

  targetData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) {
      targetPath += `M ${x} ${y}`;
    } else {
      const prevX = getX(idx - 1);
      const prevY = getY(targetData[idx - 1]);
      const cpX1 = prevX + (x - prevX) / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + (x - prevX) / 2;
      const cpY2 = y;
      targetPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y}`;
    }
  });

  return (
    <div className="relative p-2 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle">
      {/* Legend */}
      <div className="flex justify-end gap-4 text-xs font-semibold px-4 pt-2">
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400">
          <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-stone-400 inline-block" />
          <span>Target</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2 overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = paddingY + pct * (height - 2 * paddingY);
          const gridVal = (maxValue * (1 - pct)).toFixed(1);
          return (
            <g key={idx}>
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="#f3f4f6" 
                className="dark:stroke-zinc-800"
                strokeWidth="1" 
              />
              <text 
                x={paddingX - 8} 
                y={y + 4} 
                className="text-[9px] fill-stone-400 dark:fill-zinc-650"
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {days.map((day, idx) => {
          const x = getX(idx);
          return (
            <text 
              key={idx}
              x={x} 
              y={height - 12} 
              className="text-[10px] fill-stone-500 dark:fill-zinc-450 font-medium"
              textAnchor="middle"
            >
              {day}
            </text>
          );
        })}

        {/* Gradient fill */}
        {actualData.length > 0 && (
          <path d={actualArea} fill="url(#areaGrad)" />
        )}

        {/* Target Dotted Line */}
        {targetData.length > 0 && (
          <path 
            d={targetPath} 
            fill="none" 
            stroke="#9ca3af" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
        )}

        {/* Actual Line */}
        {actualData.length > 0 && (
          <path 
            d={actualPath} 
            fill="none" 
            stroke="#10B981" 
            strokeWidth="2.5" 
          />
        )}

        {/* Interaction Circles */}
        {actualData.map((val, idx) => {
          const x = getX(idx);
          const y = getY(val);
          const isHovered = hoveredPoint === idx;
          return (
            <g key={idx} className="cursor-pointer">
              {/* Invisible touch helper */}
              <circle
                cx={x}
                cy={y}
                r="16"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Visible circle outline */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? "6" : "4"}
                fill="#ffffff"
                stroke="#10B981"
                strokeWidth={isHovered ? "3.5" : "2"}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredPoint !== null && (
        <div 
          className="absolute z-10 p-3 bg-stone-900 text-white rounded-xl shadow-heavy text-xs text-left space-y-1 pointer-events-none transition-all duration-200"
          style={{
            left: `${(getX(hoveredPoint) / width) * 100}%`,
            top: `${(getY(actualData[hoveredPoint]) / height) * 100 - 35}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-bold border-b border-stone-850 pb-1 flex justify-between gap-6">
            <span>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][hoveredPoint]}</span>
            <span className="text-emerald-400">Actual</span>
          </div>
          <div>Emitted: <span className="font-extrabold">{actualData[hoveredPoint]} {unit}</span></div>
          <div>Target: <span className="font-medium">{targetData[hoveredPoint]} {unit}</span></div>
          {actualData[hoveredPoint] > targetData[hoveredPoint] ? (
            <div className="text-amber-400 text-[10px] mt-1 font-semibold flex items-center gap-0.5">
              ⚠️ {Math.round(((actualData[hoveredPoint] - targetData[hoveredPoint]) / targetData[hoveredPoint]) * 100)}% over target
            </div>
          ) : (
            <div className="text-emerald-400 text-[10px] mt-1 font-semibold flex items-center gap-0.5">
              ✓ Below target
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MONTHLY COMPARISON BAR CHART (6 Months)
// ==========================================
export function SVGBarChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Expected array: [{ month: 'Jan', actual: 6.8, target: 6.0 }, ...]
  const width = 500;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const actuals = data.map(d => d.actual);
  const targets = data.map(d => d.target);
  const maxVal = Math.max(...actuals, ...targets, 2.0);

  const getX = (idx) => paddingX + (idx * (width - 2 * paddingX)) / data.length;
  const getY = (val) => height - paddingY - (val * (height - 2 * paddingY)) / maxVal;
  const barWidth = 14;

  return (
    <div className="relative p-2 bg-white dark:bg-zinc-900 border border-stone-150 dark:border-zinc-850 rounded-2xl shadow-subtle">
      {/* Legend */}
      <div className="flex justify-end gap-4 text-xs font-semibold px-4 pt-2">
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400">
          <span className="w-3 h-3 bg-emerald-500 rounded-sm inline-block" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-400">
          <span className="w-3 h-3 bg-stone-200 dark:bg-zinc-800 rounded-sm inline-block" />
          <span>Target</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto mt-2 overflow-visible">
        {/* Horizontal Grids */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = paddingY + pct * (height - 2 * paddingY);
          const gridVal = (maxVal * (1 - pct)).toFixed(1);
          return (
            <g key={idx}>
              <line 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="#f3f4f6" 
                className="dark:stroke-zinc-800"
                strokeWidth="1" 
              />
              <text 
                x={paddingX - 8} 
                y={y + 4} 
                className="text-[9px] fill-stone-400 dark:fill-zinc-650"
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Render Bars */}
        {data.map((item, idx) => {
          const startX = getX(idx) + (width - 2 * paddingX) / data.length / 2 - barWidth;
          const actualY = getY(item.actual);
          const targetY = getY(item.target);

          const actualHeight = height - paddingY - actualY;
          const targetHeight = height - paddingY - targetY;

          const isHovered = hoveredIdx === idx;

          return (
            <g key={idx} className="cursor-pointer">
              {/* Invisible interaction bar */}
              <rect
                x={startX - 10}
                y={paddingY}
                width={barWidth * 2 + 20}
                height={height - 2 * paddingY}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />

              {/* Target Bar (Light gray background) */}
              <rect
                x={startX + barWidth / 2}
                y={targetY}
                width={barWidth}
                height={Math.max(2, targetHeight)}
                rx="4"
                fill="#e5e7eb"
                className="dark:fill-zinc-800 transition-all duration-300"
              />

              {/* Actual Bar (Emerald) */}
              <rect
                x={startX - barWidth / 2}
                y={actualY}
                width={barWidth}
                height={Math.max(2, actualHeight)}
                rx="4"
                fill={isHovered ? "#059669" : "#10B981"}
                className="transition-all duration-300"
              />

              {/* Month Text Label */}
              <text
                x={startX}
                y={height - 12}
                className="text-[10px] fill-stone-500 dark:fill-zinc-450 font-bold"
                textAnchor="middle"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIdx !== null && (
        <div 
          className="absolute z-10 p-3 bg-stone-900 text-white rounded-xl shadow-heavy text-xs text-left space-y-1 pointer-events-none transition-all duration-200"
          style={{
            left: `${((getX(hoveredIdx) + (width - 2 * paddingX) / data.length / 2) / width) * 100}%`,
            top: `${(getY(data[hoveredIdx].actual) / height) * 100 - 35}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-bold border-b border-stone-850 pb-1">
            {data[hoveredIdx].monthName ?? data[hoveredIdx].month}
          </div>
          <div>Score: <span className="font-extrabold">{data[hoveredIdx].actual} tons</span></div>
          <div>Goal: <span className="font-semibold">{data[hoveredIdx].target} tons</span></div>
          <div>
            Change: {' '}
            <span className={`font-bold ${data[hoveredIdx].actual <= data[hoveredIdx].target ? 'text-emerald-400' : 'text-amber-400'}`}>
              {data[hoveredIdx].actual <= data[hoveredIdx].target 
                ? `-${Math.round((1 - data[hoveredIdx].actual/data[hoveredIdx].target)*100)}% under goal`
                : `+${Math.round((data[hoveredIdx].actual/data[hoveredIdx].target - 1)*100)}% over goal`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. CATEGORY BENCHMARK BAR CHART (Side-by-Side comparison)
// ==========================================
export function SVGComparisonChart({ userVal, countryVal, globalVal, targetVal }) {
  const benchmarks = [
    { label: 'Your Score', val: userVal, color: '#10B981' }, // emerald
    { label: 'USA Avg', val: countryVal, color: '#6b7280' },  // gray-500
    { label: 'Global Avg', val: globalVal, color: '#9ca3af' }, // gray-400
    { label: 'Sustainable', val: targetVal, color: '#84CC16' } // lime-500
  ];

  const maxVal = Math.max(...benchmarks.map(b => b.val), 1.0);

  return (
    <div className="space-y-4">
      {benchmarks.map((item, idx) => {
        const pct = Math.max(5, (item.val / maxVal) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-600 dark:text-zinc-400">{item.label}</span>
              <span className="font-black text-stone-800 dark:text-zinc-200">{item.val.toFixed(1)} T</span>
            </div>
            <div className="h-3.5 w-full bg-stone-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${pct}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
