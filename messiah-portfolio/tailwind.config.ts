import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#faf8f5",
        "paper-dark": "#f0ebe3",
        cream: "#fff9e6",
        pencil: "#2d2d2d",
        "pencil-light": "#666666",
        highlight: {
          yellow: "#fff59d",
          pink: "#f8bbd9",
          blue: "#b3e5fc",
          green: "#c8e6c9",
          orange: "#ffcc80",
        },
        accent: {
          coral: "#ff6b6b",
          teal: "#4ecdc4",
          purple: "#a855f7",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        handwriting: ["Caveat", "cursive"],
        sketch: ["Patrick Hand", "cursive"],
        marker: ["Permanent Marker", "cursive"],
        body: ["Nunito", "sans-serif"],
      },
      animation: {
        "wiggle": "wiggle 0.5s ease-in-out",
        "float": "float 3s ease-in-out infinite",
        "scribble": "scribble 0.3s ease-in-out",
        "draw": "draw 1s ease-in-out forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "paper-float": "paperFloat 4s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scribble: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "25%": { transform: "scale(1.02) rotate(1deg)" },
          "50%": { transform: "scale(1) rotate(-1deg)" },
          "75%": { transform: "scale(1.02) rotate(1deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        draw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        paperFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
        },
      },
      boxShadow: {
        "paper": "2px 2px 8px rgba(0, 0, 0, 0.1), -1px -1px 4px rgba(255, 255, 255, 0.5)",
        "paper-hover": "4px 4px 12px rgba(0, 0, 0, 0.15), -2px -2px 6px rgba(255, 255, 255, 0.6)",
        "polaroid": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 4px 4px 0 rgba(0, 0, 0, 0.05)",
        "tape": "1px 1px 3px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "notebook-lines": "repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)",
        "grid-paper": "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
        "paper-texture": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
