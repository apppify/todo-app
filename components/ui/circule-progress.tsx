import { cn } from "@/lib/utils";
import { cva, type VariantProps, cx } from "class-variance-authority";
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const circleProgressVariants = cva(
  "inline-flex",
  {
    variants: {
      size: {
        default: "size-9",
        sm: "size-8",
        lg: "size-10",
        icon: "size-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof circleProgressVariants> {
  value: number; // Something between 1 and 100
  strokeWidth: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, strokeWidth, size, className, ...divProps }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sz, setSz] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    setSz(containerRef.current.getBoundingClientRect().width)
  }, [containerRef])

  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (sz - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  circleProgressVariants()

  return (
    <div ref={containerRef} className={cn(circleProgressVariants({ size, className }))} {...divProps}>
      {sz > 0 && (
        <svg width={sz} height={sz} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient
              id="circle-progress"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(53.1659 -18.1884) rotate(51.1683) scale(267.012 282.957)"
            >
              <stop stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" />
            </radialGradient>
          </defs>
          <text
            x={sz / 2}
            y={sz / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            className="text-[12px] font-bold"
          >{value}</text>
          <circle
            cx={sz / 2}
            cy={sz / 2}
            r={radius}
            strokeLinecap="round"
            className="fill-none stroke-gray-200"
            style={{
              strokeWidth,
              // strokeDasharray: circumference,
              // strokeDashoffset: circumference,
            }}
          />
          <motion.circle
            cx={sz / 2}
            cy={sz / 2}
            r={radius}
            strokeLinecap="round"
            className="fill-none"
            style={{ stroke: "url(#circle-progress)", strokeWidth }}
            initial={{
              strokeDashoffset: circumference,
              strokeDasharray: circumference,
            }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              ease: 'easeOut',
            }}
          />
        </svg>
      )}
    </div>
  );
};

export { CircularProgress };
