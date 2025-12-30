"use client";

import React from "react";
import { motion } from "framer-motion";

// Collection of hand-drawn style decorative doodles
export const FloatingDoodles: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Floating stars */}
      <motion.svg
        className="absolute top-20 left-[5%] w-8 h-8 opacity-20"
        viewBox="0 0 24 24"
        animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <path
          d="M12 2L14 8L20 9L15.5 14L17 20L12 17L7 20L8.5 14L4 9L10 8L12 2Z"
          stroke="#ffd54f"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Spiral doodle */}
      <motion.svg
        className="absolute top-40 right-[8%] w-10 h-10 opacity-15"
        viewBox="0 0 32 32"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M16 8C20 8 24 12 24 16C24 20 20 24 16 24C12 24 10 22 10 18C10 14 14 12 16 14C18 16 18 18 16 18"
          stroke="#ff6b6b"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>

      {/* Small heart */}
      <motion.svg
        className="absolute bottom-32 left-[10%] w-6 h-6 opacity-20"
        viewBox="0 0 24 24"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path
          d="M12 6C10 2 4 2 4 8C4 12 12 20 12 20C12 20 20 12 20 8C20 2 14 2 12 6Z"
          stroke="#ff6b6b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Squiggle line */}
      <motion.svg
        className="absolute top-1/3 right-[5%] w-16 h-8 opacity-10"
        viewBox="0 0 60 20"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <path
          d="M2 10 Q 15 2, 30 10 T 58 10"
          stroke="#4ecdc4"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Small circle cluster */}
      <motion.svg
        className="absolute bottom-1/4 right-[12%] w-12 h-12 opacity-15"
        viewBox="0 0 40 40"
        animate={{ rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <circle cx="12" cy="12" r="6" stroke="#a855f7" strokeWidth="1.5" fill="none" />
        <circle cx="28" cy="16" r="4" stroke="#a855f7" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="28" r="5" stroke="#a855f7" strokeWidth="1.5" fill="none" />
      </motion.svg>

      {/* Arrow doodle */}
      <motion.svg
        className="absolute top-2/3 left-[6%] w-10 h-10 opacity-15"
        viewBox="0 0 40 40"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path
          d="M5 20 C 15 18, 25 22, 35 20"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M28 14 L 35 20 L 28 26"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
};

// Doodle border decoration
export const DoodleBorder: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "#2d2d2d"
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      preserveAspectRatio="none"
    >
      <rect
        x="4"
        y="4"
        width="calc(100% - 8px)"
        height="calc(100% - 8px)"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="8 6"
        rx="4"
        opacity="0.3"
      />
    </svg>
  );
};

// Decorative corner doodles
export const CornerDoodle: React.FC<{
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}> = ({ position, className = "" }) => {
  const rotations = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <svg
      className={`absolute w-12 h-12 opacity-20 ${positions[position]} ${className}`}
      viewBox="0 0 40 40"
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      <path
        d="M2 2 Q 2 20, 20 20 Q 20 38, 38 38"
        stroke="#2d2d2d"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2" fill="#ffd54f" />
    </svg>
  );
};

// Scattered dots pattern
export const ScatteredDots: React.FC<{ className?: string }> = ({ className = "" }) => {
  const dots = [
    { x: 10, y: 15, size: 3, color: "#ff6b6b" },
    { x: 25, y: 8, size: 2, color: "#4ecdc4" },
    { x: 40, y: 20, size: 4, color: "#ffd54f" },
    { x: 55, y: 12, size: 2, color: "#a855f7" },
    { x: 70, y: 18, size: 3, color: "#3b82f6" },
    { x: 85, y: 10, size: 2, color: "#ff6b6b" },
    { x: 15, y: 85, size: 2, color: "#4ecdc4" },
    { x: 30, y: 90, size: 3, color: "#ffd54f" },
    { x: 60, y: 88, size: 2, color: "#a855f7" },
    { x: 80, y: 92, size: 4, color: "#3b82f6" },
  ];

  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      {dots.map((dot, i) => (
        <motion.circle
          key={i}
          cx={`${dot.x}%`}
          cy={`${dot.y}%`}
          r={dot.size}
          fill={dot.color}
          opacity={0.3}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </svg>
  );
};

// Wavy line divider
export const WavyDivider: React.FC<{ className?: string; color?: string }> = ({
  className = "",
  color = "#e5e5e5"
}) => {
  return (
    <svg
      className={`w-full h-4 ${className}`}
      viewBox="0 0 400 16"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M0 8 Q 50 2, 100 8 T 200 8 T 300 8 T 400 8"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
    </svg>
  );
};

// Tape strip decoration
export const TapeStrip: React.FC<{
  className?: string;
  color?: string;
  rotation?: number;
}> = ({ className = "", color = "#ffd54f", rotation = -3 }) => {
  return (
    <div
      className={`w-20 h-6 opacity-70 ${className}`}
      style={{
        background: `repeating-linear-gradient(45deg, ${color}, ${color} 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 8px)`,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
      }}
    />
  );
};

// Coffee ring stain
export const CoffeeRing: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 60
}) => {
  return (
    <svg
      className={`opacity-10 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 60 60"
    >
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke="rgba(139, 90, 43, 0.4)"
        strokeWidth="4"
      />
      <circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="rgba(139, 90, 43, 0.2)"
        strokeWidth="2"
      />
    </svg>
  );
};

// Pencil scribble
export const PencilScribble: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.svg
      className={`w-24 h-8 opacity-20 ${className}`}
      viewBox="0 0 100 30"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <path
        d="M5 15 C 20 5, 30 25, 50 15 S 80 5, 95 15"
        stroke="#2d2d2d"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};
