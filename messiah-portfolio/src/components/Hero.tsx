"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScribbleUnderline, StarDoodle, DoodleArrow } from "./SketchyElements";
import { LinkedInIcon, EmailIcon, GitHubIcon } from "./DoodleIcons";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12 px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scattered doodles */}
        <motion.div
          className="absolute top-20 left-10 opacity-20"
          animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <StarDoodle size={40} color="#ffd54f" filled />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 opacity-20"
          animate={{ rotate: [0, -10, 0], y: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <StarDoodle size={32} color="#ff6b6b" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 opacity-20"
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <StarDoodle size={28} color="#4ecdc4" filled />
        </motion.div>

        {/* Grid paper lines in background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#2d2d2d 1px, transparent 1px), linear-gradient(90deg, #2d2d2d 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Greeting with tape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-block font-sketch text-xl sm:text-2xl text-pencil-light bg-highlight-yellow px-4 py-1 rounded transform -rotate-1 click-wiggle hover-wiggle">
            Hey there! I&apos;m
          </span>
        </motion.div>

        {/* Main Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-handwriting text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-pencil mb-6 leading-tight click-wiggle"
        >
          <ScribbleUnderline color="#ff6b6b">
            Messiah Majid
          </ScribbleUnderline>
        </motion.h1>

        {/* Subtitle with arrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8"
        >
          <span className="font-sketch text-2xl sm:text-3xl text-pencil-light click-wiggle hover-wiggle">
            Computer Science
          </span>
          <span className="hidden sm:inline font-handwriting text-3xl text-accent-coral click-wiggle">+</span>
          <span className="font-sketch text-2xl sm:text-3xl text-pencil-light click-wiggle hover-wiggle">
            Math
          </span>
          <span className="hidden sm:inline font-handwriting text-3xl text-accent-teal click-wiggle">+</span>
          <span className="font-sketch text-2xl sm:text-3xl text-pencil-light click-wiggle hover-wiggle">
            Biology
          </span>
        </motion.div>

        {/* Description in notebook paper style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative max-w-2xl mx-auto mb-10"
        >
          <div
            className="bg-white/80 p-6 rounded-lg shadow-paper transform rotate-1"
            style={{
              border: "2px solid #2d2d2d",
              borderRadius: "4px 12px 4px 8px",
            }}
          >
            <p className="font-sketch text-lg sm:text-xl text-pencil leading-relaxed">
              Building impactful software at the intersection of{" "}
              <span className="highlight-text click-wiggle">technology</span> and{" "}
              <span className="highlight-pink click-wiggle">life sciences</span>.
              Currently studying at the{" "}
              <span className="highlight-blue click-wiggle">University of Miami</span>
            </p>
          </div>
          {/* Tape decoration */}
          <div
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 -rotate-2 w-16 h-6 opacity-80"
            style={{
              background:
                "repeating-linear-gradient(45deg, #ffd54f, #ffd54f 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
              boxShadow: "1px 2px 3px rgba(0,0,0,0.1)",
            }}
          />
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-12"
        >
          <motion.a
            href="mailto:messiah.majid@miami.edu"
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-paper hover:shadow-paper-hover transition-all"
            style={{ border: "2px solid #2d2d2d" }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <EmailIcon size={20} className="text-accent-coral" />
            <span className="font-sketch text-sm sm:text-base hidden sm:inline">Email</span>
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/messiahmajid"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-paper hover:shadow-paper-hover transition-all"
            style={{ border: "2px solid #2d2d2d" }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <LinkedInIcon size={20} className="text-accent-blue" />
            <span className="font-sketch text-sm sm:text-base hidden sm:inline">LinkedIn</span>
          </motion.a>

          <motion.a
            href="https://github.com/messiahmajid"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-paper hover:shadow-paper-hover transition-all"
            style={{ border: "2px solid #2d2d2d" }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <GitHubIcon size={20} className="text-pencil" />
            <span className="font-sketch text-sm sm:text-base hidden sm:inline">GitHub</span>
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center"
        >
          <span className="font-handwriting text-lg text-pencil-light mb-2">
            scroll down
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <DoodleArrow direction="down" color="#666" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
