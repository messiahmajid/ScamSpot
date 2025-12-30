"use client";

import React from "react";
import { motion } from "framer-motion";
import { WashiTape, StarDoodle } from "./SketchyElements";
import {
  EmailIcon,
  PhoneIcon,
  LinkedInIcon,
  PaperPlaneIcon,
} from "./DoodleIcons";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-paper-dark/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating paper planes */}
        <motion.div
          className="absolute top-20 left-[10%] opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <PaperPlaneIcon size={40} className="text-accent-coral" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-[15%] opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            rotate: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <PaperPlaneIcon size={32} className="text-accent-teal" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-[20%] opacity-20"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 25, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        >
          <PaperPlaneIcon size={28} className="text-accent-purple" />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-handwriting text-5xl sm:text-6xl text-pencil inline-block relative">
            Get In Touch
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
                d="M0 8 Q 50 0, 100 8 T 200 4"
                stroke="#ff6b6b"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </motion.svg>
          </h2>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            className="bg-white p-8 md:p-12 shadow-paper relative"
            style={{
              border: "2px solid #2d2d2d",
              borderRadius: "8px 4px 12px 4px",
            }}
          >
            <WashiTape className="-top-3 left-12" rotation={-3} color="#ff6b6b" />
            <WashiTape className="-top-3 right-12" rotation={5} pattern="dots" color="#4ecdc4" />

            {/* Intro text */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <PaperPlaneIcon size={48} className="text-accent-coral" />
              </motion.div>
              <p className="font-sketch text-xl text-pencil leading-relaxed max-w-lg mx-auto">
                I&apos;m always excited to connect with fellow developers, researchers,
                and innovators. Let&apos;s build something{" "}
                <span className="highlight-text">amazing</span> together!
              </p>
            </div>

            {/* Contact Links */}
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Email */}
              <motion.a
                href="mailto:messiah.majid@miami.edu"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center p-6 rounded-xl transition-all"
                style={{
                  background: "#fff5f5",
                  border: "2px dashed #ffcdd2",
                }}
              >
                <div className="relative mb-3">
                  <EmailIcon size={32} className="text-accent-coral" />
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ background: "rgba(255, 107, 107, 0.2)" }}
                    />
                  </motion.div>
                </div>
                <p className="font-marker text-lg text-pencil mb-1">Email</p>
                <p className="font-sketch text-sm text-pencil-light text-center break-all">
                  messiah.majid@miami.edu
                </p>

                {/* Circle hover effect */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ overflow: "visible" }}
                >
                  <ellipse
                    cx="50%"
                    cy="50%"
                    rx="48%"
                    ry="45%"
                    fill="none"
                    stroke="#ff6b6b"
                    strokeWidth="2.5"
                    strokeDasharray="8 4"
                    style={{ transform: "rotate(-3deg)", transformOrigin: "center" }}
                  />
                </svg>
              </motion.a>

              {/* Phone */}
              <motion.a
                href="tel:+17864132337"
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center p-6 rounded-xl transition-all relative"
                style={{
                  background: "#e8f5e9",
                  border: "2px dashed #a5d6a7",
                }}
              >
                <div className="relative mb-3">
                  <PhoneIcon size={32} className="text-green-600" />
                </div>
                <p className="font-marker text-lg text-pencil mb-1">Phone</p>
                <p className="font-sketch text-sm text-pencil-light">
                  (786) 413-2337
                </p>

                {/* Circle hover effect */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ overflow: "visible" }}
                >
                  <ellipse
                    cx="50%"
                    cy="50%"
                    rx="48%"
                    ry="45%"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeDasharray="8 4"
                    style={{ transform: "rotate(2deg)", transformOrigin: "center" }}
                  />
                </svg>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/messiahmajid"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center p-6 rounded-xl transition-all relative"
                style={{
                  background: "#e3f2fd",
                  border: "2px dashed #90caf9",
                }}
              >
                <div className="relative mb-3">
                  <LinkedInIcon size={32} className="text-accent-blue" />
                </div>
                <p className="font-marker text-lg text-pencil mb-1">LinkedIn</p>
                <p className="font-sketch text-sm text-pencil-light">
                  /in/messiahmajid
                </p>

                {/* Circle hover effect */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ overflow: "visible" }}
                >
                  <ellipse
                    cx="50%"
                    cy="50%"
                    rx="48%"
                    ry="45%"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeDasharray="8 4"
                    style={{ transform: "rotate(-2deg)", transformOrigin: "center" }}
                  />
                </svg>
              </motion.a>
            </div>

            {/* Decorative stars */}
            <div className="absolute -bottom-3 left-8">
              <StarDoodle size={24} color="#ffd54f" filled />
            </div>
            <div className="absolute -bottom-2 right-12">
              <StarDoodle size={20} color="#ff6b6b" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
