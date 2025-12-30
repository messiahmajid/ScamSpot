"use client";

import React from "react";
import { motion } from "framer-motion";
import { StarDoodle } from "./SketchyElements";
import { LinkedInIcon, GitHubIcon, EmailIcon, HeartIcon } from "./DoodleIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 bg-pencil text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Top decorative line */}
        <svg className="w-full h-4 mb-8" viewBox="0 0 400 10" preserveAspectRatio="none">
          <path
            d="M0 5 Q 100 0, 200 5 T 400 5"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo/Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="font-handwriting text-4xl mb-2">Messiah Majid</h3>
            <p className="font-sketch text-white/70">
              Building at the intersection of tech & life sciences
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <motion.a
              href="mailto:messiah.majid@miami.edu"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <EmailIcon size={20} className="text-white" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/messiahmajid"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <LinkedInIcon size={20} className="text-white" />
            </motion.a>
            <motion.a
              href="https://github.com/messiahmajid"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <GitHubIcon size={20} className="text-white" />
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/20" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sketch text-white/60 flex items-center gap-2"
          >
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <HeartIcon size={16} className="text-accent-coral inline" />
            </motion.span>{" "}
            in Miami
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sketch text-white/60"
          >
            {currentYear} Messiah Majid. All rights reserved.
          </motion.p>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-4 left-4 opacity-20">
          <StarDoodle size={20} color="#ffd54f" filled />
        </div>
        <div className="absolute bottom-4 right-4 opacity-20">
          <StarDoodle size={16} color="#ff6b6b" />
        </div>
      </div>
    </footer>
  );
}
