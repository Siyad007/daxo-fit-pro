import React from 'react';
import { motion } from 'framer-motion';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'area';
  height?: number;
  showValues?: boolean;
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  type = 'bar',
  height = 200,
  showValues = true,
  className = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    if (range === 0) return 20;
    return ((value - minValue) / range) * (height - 40) + 20;
  };

  const getLineY = (value: number) => {
    if (range === 0) return height / 2;
    return height - ((value - minValue) / range) * (height - 40) - 20;
  };

  const getAreaPath = () => {
    if (data.length === 0) return '';
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (100 - 10) + 5;
      const y = getLineY(item.value);
      return `${x},${y}`;
    }).join(' L');
    
    return `M ${points} L 95,${height - 20} L 5,${height - 20} Z`;
  };

  const getLinePath = () => {
    if (data.length === 0) return '';
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * (100 - 10) + 5;
      const y = getLineY(item.value);
      return `${x},${y}`;
    }).join(' L');
    
    return `M ${points}`;
  };

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Chart content */}
        {type === 'bar' && data.map((item, index) => {
          const barHeight = getBarHeight(item.value);
          const barY = height - barHeight;
          const barX = (index / (data.length - 1)) * (100 - 10) + 5;
          const barWidth = 80 / data.length;
          
          return (
            <motion.g key={index}>
              <motion.rect
                x={`${barX}%`}
                y={barY}
                width={`${barWidth}%`}
                height={barHeight}
                fill={item.color || '#10b981'}
                rx="4"
                initial={{ height: 0, y: height }}
                animate={{ height: barHeight, y: barY }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
              {showValues && (
                <text
                  x={`${barX + barWidth/2}%`}
                  y={barY - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-600"
                >
                  {Math.round(item.value)}
                </text>
              )}
            </motion.g>
          );
        })}
        
        {type === 'line' && (
          <motion.path
            d={getLinePath()}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}
        
        {type === 'area' && (
          <motion.path
            d={getAreaPath()}
            fill="url(#areaGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
        )}
        
        {/* Data points */}
        {type === 'line' && data.map((item, index) => {
          const x = (index / (data.length - 1)) * (100 - 10) + 5;
          const y = getLineY(item.value);
          
          return (
            <motion.circle
              key={index}
              cx={`${x}%`}
              cy={y}
              r="4"
              fill={item.color || '#10b981'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            />
          );
        })}
        
        {/* Gradient for area chart */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-500">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;
