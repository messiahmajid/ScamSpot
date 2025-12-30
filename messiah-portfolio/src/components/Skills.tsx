"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { WashiTape } from "./SketchyElements";
import {
  PythonIcon,
  JavaIcon,
  DatabaseIcon,
  CodeIcon,
  BrainIcon,
  DNAIcon,
} from "./DoodleIcons";

interface Skill {
  name: string;
  category: "language" | "framework" | "tool";
  icon?: React.ReactNode;
  color: string;
}

const skills: Skill[] = [
  { name: "Python", category: "language", icon: <PythonIcon size={20} />, color: "#4ecdc4" },
  { name: "Java", category: "language", icon: <JavaIcon size={20} />, color: "#ff6b6b" },
  { name: "R", category: "language", color: "#a855f7" },
  { name: "SQL", category: "language", icon: <DatabaseIcon size={20} />, color: "#3b82f6" },
  { name: "MATLAB", category: "language", color: "#f59e0b" },
  { name: "Databricks", category: "framework", color: "#ff6b6b" },
  { name: "Tableau", category: "framework", color: "#4ecdc4" },
  { name: "Scikit-learn", category: "framework", icon: <BrainIcon size={20} />, color: "#f59e0b" },
  { name: "Matplotlib", category: "framework", color: "#3b82f6" },
  { name: "TensorFlow", category: "framework", icon: <BrainIcon size={20} />, color: "#ff6b6b" },
  { name: "PyTorch", category: "framework", icon: <BrainIcon size={20} />, color: "#a855f7" },
  { name: "BLAST", category: "tool", icon: <DNAIcon size={20} />, color: "#4ecdc4" },
  { name: "BioPython", category: "tool", icon: <DNAIcon size={20} />, color: "#22c55e" },
  { name: "ChimeraX", category: "tool", icon: <DNAIcon size={20} />, color: "#3b82f6" },
];

const categories = [
  { id: "all", label: "All Skills" },
  { id: "language", label: "Languages" },
  { id: "framework", label: "Frameworks" },
  { id: "tool", label: "Bio Tools" },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2d2d2d 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-handwriting text-5xl sm:text-6xl text-pencil inline-block relative">
            Technical Skills
            <motion.svg
              className="absolute -bottom-2 left-0 w-full"
              height="12"
              viewBox="0 0 200 12"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <path
                d="M0 6 Q 50 12, 100 6 T 200 6"
                stroke="#4ecdc4"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </h2>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 font-sketch text-lg rounded-full transition-all ${
                activeCategory === category.id
                  ? "bg-pencil text-white shadow-paper"
                  : "bg-white text-pencil-light hover:text-pencil shadow-sm"
              }`}
              style={{
                border: "2px solid #2d2d2d",
              }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                scale: 1.1,
                rotate: 3,
                zIndex: 10,
              }}
              className="relative group"
            >
              <div
                className="bg-white p-4 flex flex-col items-center justify-center gap-2 aspect-square shadow-paper hover:shadow-paper-hover transition-all cursor-pointer"
                style={{
                  border: "2px solid #2d2d2d",
                  borderRadius: "8px 4px 12px 4px",
                }}
              >
                {/* Colored circle decoration */}
                <div
                  className="absolute top-2 right-2 w-3 h-3 rounded-full opacity-60"
                  style={{ backgroundColor: skill.color }}
                />

                {/* Icon */}
                <div style={{ color: skill.color }}>
                  {skill.icon || <CodeIcon size={24} />}
                </div>

                {/* Skill name */}
                <p className="font-sketch text-sm sm:text-base text-pencil text-center">
                  {skill.name}
                </p>

                {/* Hover circle effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <svg className="w-full h-full" style={{ overflow: "visible" }}>
                    <ellipse
                      cx="50%"
                      cy="50%"
                      rx="48%"
                      ry="48%"
                      fill="none"
                      stroke={skill.color}
                      strokeWidth="2.5"
                      strokeDasharray="8 4"
                      style={{
                        transform: "rotate(-5deg)",
                        transformOrigin: "center",
                      }}
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -left-4 top-1/4 hidden lg:block">
          <WashiTape rotation={90} color="#ffd54f" />
        </div>
        <div className="absolute -right-4 top-1/2 hidden lg:block">
          <WashiTape rotation={-90} pattern="dots" color="#ff6b6b" />
        </div>
      </div>
    </section>
  );
}
