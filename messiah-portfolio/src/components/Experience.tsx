"use client";

import React from "react";
import { motion } from "framer-motion";
import { WashiTape, Pushpin, StarDoodle } from "./SketchyElements";
import { RocketIcon, MicroscopeIcon } from "./DoodleIcons";

interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  icon: React.ReactNode;
  color: string;
  highlights: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Johnson & Johnson",
    role: "MedTech Supply Chain Intern",
    location: "Raritan, NJ",
    period: "May 2025 - Present",
    icon: <RocketIcon size={28} />,
    color: "#ff6b6b",
    highlights: [
      "Strengthened delivery accuracy for critical healthcare shipments by analyzing ML-driven Available-to-Promise platform, identifying and resolving 20+ high-impact data quality issues across SQL pipelines, Azure workflows, and Looker dashboards",
      "Accelerated reporting workflows by developing automated solutions that unified ATP system performance metrics, reducing manual workload by 30+ hours/month",
    ],
  },
  {
    company: "UM Luque Laboratory",
    role: "Research Assistant",
    location: "Coral Gables, FL",
    period: "Jan 2025 - Present",
    icon: <MicroscopeIcon size={28} />,
    color: "#4ecdc4",
    highlights: [
      "Built Python-based bioinformatics software to model viral protein structures and simulate capsid dynamics, achieving 88% viral disassembly prediction accuracy",
      "Applied mathematical modeling to quantify bacteriophage-host interactions, improving predictive accuracy of host-virus dynamics by 72%",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-4 relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #2d2d2d 25%, transparent 25%), linear-gradient(-45deg, #2d2d2d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2d2d2d 75%), linear-gradient(-45deg, transparent 75%, #2d2d2d 75%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-handwriting text-5xl sm:text-6xl text-pencil inline-block relative">
            Experience
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
                d="M0 8 C 30 2, 70 12, 100 6 S 170 2, 200 8"
                stroke="#a855f7"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - hand-drawn style */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 hidden sm:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line
                x1="50%"
                y1="0"
                x2="50%"
                y2="100%"
                stroke="#2d2d2d"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>
          </div>

          {/* Experience Cards */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-12 sm:mb-16 ${
                index % 2 === 0
                  ? "md:pr-1/2 md:text-right"
                  : "md:pl-1/2 md:ml-auto"
              }`}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-4 md:left-1/2 top-8 w-4 h-4 rounded-full transform -translate-x-1/2 z-10 hidden sm:block"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 0 4px #faf8f5, 0 0 0 6px ${exp.color}`,
                }}
              />

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? -1 : 1 }}
                className={`relative bg-white p-6 shadow-paper ml-8 sm:ml-0 ${
                  index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                }`}
                style={{
                  border: "2px solid #2d2d2d",
                  borderRadius: "8px 4px 12px 4px",
                  transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
                }}
              >
                <Pushpin
                  className={`${
                    index % 2 === 0 ? "right-6" : "left-6"
                  } -top-2`}
                  color={exp.color}
                />
                <WashiTape
                  className={`-top-3 ${index % 2 === 0 ? "left-8" : "right-8"}`}
                  rotation={index % 2 === 0 ? -5 : 5}
                  color={exp.color}
                />

                {/* Header */}
                <div className={`flex items-start gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${exp.color}20` }}
                  >
                    <span style={{ color: exp.color }}>{exp.icon}</span>
                  </div>
                  <div className={index % 2 === 0 ? "md:text-right" : ""}>
                    <h3 className="font-marker text-xl text-pencil">{exp.company}</h3>
                    <p className="font-sketch text-lg text-pencil-light">{exp.role}</p>
                    <p className="font-sketch text-sm text-pencil-light">
                      {exp.location} " {exp.period}
                    </p>
                  </div>
                </div>

                {/* Highlights */}
                <ul className={`space-y-3 ${index % 2 === 0 ? "md:text-left" : ""}`}>
                  {exp.highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <StarDoodle
                        size={16}
                        color={exp.color}
                        filled
                        className="flex-shrink-0 mt-1"
                      />
                      <p className="font-sketch text-sm text-pencil leading-relaxed">
                        {highlight}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
