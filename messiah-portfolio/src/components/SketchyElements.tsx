"use client";

import React from "react";
import { motion } from "framer-motion";

interface SketchyBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const SketchyBorder: React.FC<SketchyBorderProps> = ({
  children,
  className = "",
  color = "#2d2d2d",
}) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="8 4"
          rx="4"
          style={{
            filter: "url(#sketchy)",
          }}
        />
        <defs>
          <filter id="sketchy">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
};

interface CircleHighlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  active?: boolean;
}

export const CircleHighlight: React.FC<CircleHighlightProps> = ({
  children,
  className = "",
  color = "#ff6b6b",
  active = false,
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <motion.svg
        className="absolute pointer-events-none"
        style={{
          top: "-8px",
          left: "-10px",
          width: "calc(100% + 20px)",
          height: "calc(100% + 16px)",
        }}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={active ? { opacity: 1, pathLength: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="48%"
          ry="45%"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transformOrigin: "center",
            transform: "rotate(-3deg)",
          }}
        />
      </motion.svg>
    </span>
  );
};

interface ScribbleUnderlineProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const ScribbleUnderline: React.FC<ScribbleUnderlineProps> = ({
  children,
  className = "",
  color = "#ff6b6b",
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute w-full pointer-events-none"
        style={{ bottom: "-6px", left: 0, height: "10px" }}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        <path
          d="M0 5 Q 10 2, 20 5 T 40 5 T 60 5 T 80 5 T 100 5"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

interface WashiTapeProps {
  className?: string;
  rotation?: number;
  pattern?: "stripes" | "dots" | "solid";
  color?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  className = "",
  rotation = -5,
  pattern = "stripes",
  color = "#ffd54f",
}) => {
  const getPattern = () => {
    switch (pattern) {
      case "dots":
        return `radial-gradient(circle, ${color} 2px, transparent 2px)`;
      case "solid":
        return color;
      default:
        return `repeating-linear-gradient(45deg, ${color}, ${color} 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)`;
    }
  };

  return (
    <div
      className={`absolute w-20 h-7 opacity-80 ${className}`}
      style={{
        background: getPattern(),
        backgroundSize: pattern === "dots" ? "10px 10px" : undefined,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
      }}
    />
  );
};

interface PushpinProps {
  className?: string;
  color?: string;
}

export const Pushpin: React.FC<PushpinProps> = ({
  className = "",
  color = "#ff6b6b",
}) => {
  return (
    <div
      className={`absolute w-5 h-5 rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}99)`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)",
      }}
    />
  );
};

interface DoodleArrowProps {
  className?: string;
  direction?: "right" | "down" | "left" | "up";
  color?: string;
}

export const DoodleArrow: React.FC<DoodleArrowProps> = ({
  className = "",
  direction = "right",
  color = "#2d2d2d",
}) => {
  const getRotation = () => {
    switch (direction) {
      case "down":
        return 90;
      case "left":
        return 180;
      case "up":
        return -90;
      default:
        return 0;
    }
  };

  return (
    <svg
      width="40"
      height="24"
      viewBox="0 0 40 24"
      fill="none"
      className={className}
      style={{ transform: `rotate(${getRotation()}deg)` }}
    >
      <path
        d="M2 12C8 11 14 13 20 12C26 11 32 13 38 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 6C33 9 36 11 38 12C36 13 33 15 30 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

interface StarDoodleProps {
  className?: string;
  size?: number;
  filled?: boolean;
  color?: string;
}

export const StarDoodle: React.FC<StarDoodleProps> = ({
  className = "",
  size = 24,
  filled = false,
  color = "#ffd54f",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 2L14 8L20 9L15.5 14L17 20L12 17L7 20L8.5 14L4 9L10 8L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </svg>
  );
};

interface SpiralDoodleProps {
  className?: string;
  color?: string;
}

export const SpiralDoodle: React.FC<SpiralDoodleProps> = ({
  className = "",
  color = "#2d2d2d",
}) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M16 8C20 8 24 12 24 16C24 20 20 24 16 24C12 24 10 22 10 18C10 14 14 12 16 14C18 16 18 18 16 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

interface PaperClipProps {
  className?: string;
  color?: string;
  rotation?: number;
}

export const PaperClip: React.FC<PaperClipProps> = ({
  className = "",
  color = "#888",
  rotation = -15,
}) => {
  return (
    <svg
      width="20"
      height="48"
      viewBox="0 0 20 48"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M14 4C14 2 12 0 10 0C8 0 6 2 6 4V36C6 40 8 44 10 44C12 44 14 40 14 36V12C14 10 12 8 10 8C8 8 6 10 6 12V32"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

interface CoffeStainProps {
  className?: string;
  size?: number;
}

export const CoffeeStain: React.FC<CoffeStainProps> = ({
  className = "",
  size = 80,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
    >
      <circle
        cx="40"
        cy="40"
        r="35"
        fill="none"
        stroke="rgba(139, 90, 43, 0.15)"
        strokeWidth="6"
      />
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="none"
        stroke="rgba(139, 90, 43, 0.08)"
        strokeWidth="3"
      />
    </svg>
  );
};

export const NotebookSpiral: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const spirals = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className={`absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-evenly py-4 ${className}`}>
      {spirals.map((i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full border-2 border-gray-400 bg-paper ml-2"
          style={{
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
          }}
        />
      ))}
    </div>
  );
};
