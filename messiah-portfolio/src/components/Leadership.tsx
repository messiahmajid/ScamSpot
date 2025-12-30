"use client";

import React from "react";
import { motion } from "framer-motion";
import { WashiTape, StarDoodle, PaperClip } from "./SketchyElements";
import { UsersIcon, LightbulbIcon, HeartIcon, CodeIcon, RocketIcon } from "./DoodleIcons";

interface LeadershipItem {
  title: string;
  organization: string;
  period: string;
  icon: React.ReactNode;
  color: string;
  highlights: string[];
}

const leadershipRoles: LeadershipItem[] = [
  {
    title: "First Year Fellow",
    organization: "University of Miami Residential Life",
    period: "Apr 2024 - Present",
    icon: <UsersIcon size={28} />,
    color: "#ff6b6b",
    highlights: [
      "Mentored 78 first-year students in academic planning and research exploration, increasing student confidence by 30%",
      "Led 12 coding workshops in Python and Java for 78 participants, enhancing programming proficiency by 35%",
    ],
  },
  {
    title: "Computing & Technology Mentor",
    organization: "Foote Fellows Honors Program",
    period: "Aug 2024 - Present",
    icon: <LightbulbIcon size={28} />,
    color: "#4ecdc4",
    highlights: [
      "Provided one-on-one mentorship to 10+ honors students, increasing engagement in research projects by 40%",
      "Facilitated 2 technical seminars on data structures and bioinformatics, improving project performance by 30%",
    ],
  },
];

interface ExtracurricularItem {
  name: string;
  icon: React.ReactNode;
}

const extracurriculars: ExtracurricularItem[] = [
  { name: "ColorStack UM", icon: <CodeIcon size={20} /> },
  { name: "Google Developer Students Club", icon: <RocketIcon size={20} /> },
  { name: "National Society of Black Engineers", icon: <UsersIcon size={20} /> },
  { name: "Kappa Theta Pi Technology Fraternity", icon: <CodeIcon size={20} /> },
];

export default function Leadership() {
  return (
    <section id="leadership" className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-handwriting text-5xl sm:text-6xl text-pencil inline-block relative">
            Leadership
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
                d="M0 6 Q 40 0, 80 8 T 160 4 T 200 8"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </h2>
        </motion.div>

        {/* Leadership Roles */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {leadershipRoles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? 1 : -1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="relative"
            >
              <PaperClip
                className={`absolute ${index % 2 === 0 ? "-left-2" : "-right-2"} -top-4 z-10`}
                color="#888"
                rotation={index % 2 === 0 ? -15 : 15}
              />

              <div
                className="bg-white p-6 shadow-paper relative"
                style={{
                  border: "2px solid #2d2d2d",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <WashiTape
                  className="-top-3 right-8"
                  rotation={index % 2 === 0 ? 3 : -3}
                  pattern="dots"
                  color={role.color}
                />

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <span style={{ color: role.color }}>{role.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-marker text-xl text-pencil">{role.title}</h3>
                    <p className="font-sketch text-pencil-light">{role.organization}</p>
                    <p className="font-handwriting text-lg text-pencil-light mt-1">
                      {role.period}
                    </p>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-3">
                  {role.highlights.map((highlight, i) => (
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
                        color={role.color}
                        filled
                        className="flex-shrink-0 mt-1"
                      />
                      <p className="font-sketch text-sm text-pencil leading-relaxed">
                        {highlight}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extracurricular Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <HeartIcon size={28} className="text-accent-coral" />
            <h3 className="font-marker text-2xl text-pencil">Extracurricular Activities</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {extracurriculars.map((activity, index) => (
              <motion.div
                key={activity.name}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: (index - 1.5) * 2 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  boxShadow: "4px 4px 12px rgba(0,0,0,0.15)",
                }}
                className="px-5 py-3 bg-white shadow-paper cursor-default"
                style={{
                  border: "2px solid #2d2d2d",
                  borderRadius: "4px 8px 4px 8px",
                }}
              >
                <p className="font-sketch text-pencil flex items-center gap-2">
                  <span className="text-accent-teal">{activity.icon}</span>
                  {activity.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
