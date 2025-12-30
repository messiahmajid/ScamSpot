"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const CodeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6L3 12L8 18" style={{ strokeDasharray: "100", strokeDashoffset: "0" }} />
    <path d="M16 6L21 12L16 18" style={{ strokeDasharray: "100", strokeDashoffset: "0" }} />
    <path d="M14 4L10 20" style={{ strokeDasharray: "100", strokeDashoffset: "0" }} />
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C9 2 7 4 7 6.5C5 7 4 9 4 11C4 13 5 15 7 16C7 18 8 20 10 21C11 21.5 12.5 22 12.5 22" />
    <path d="M12 2C15 2 17 4 17 6.5C19 7 20 9 20 11C20 13 19 15 17 16C17 18 16 20 14 21C13 21.5 12.5 22 12.5 22" />
    <path d="M12 2V22" />
    <path d="M7.5 10C8.5 10 9 10.5 9 11.5" />
    <path d="M16.5 10C15.5 10 15 10.5 15 11.5" />
  </svg>
);

export const DNAIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2C6 6 8 8 12 8C16 8 18 6 18 2" />
    <path d="M6 22C6 18 8 16 12 16C16 16 18 18 18 22" />
    <path d="M6 8C6 12 8 14 12 14C16 14 18 12 18 8" />
    <line x1="6" y1="5" x2="18" y2="5" />
    <line x1="6" y1="11" x2="18" y2="11" />
    <line x1="6" y1="19" x2="18" y2="19" />
  </svg>
);

export const RocketIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C14 4 16 6 18 10C18 14 16 18 12 22C8 18 6 14 6 10C8 6 10 4 12 2Z" />
    <circle cx="12" cy="10" r="2" />
    <path d="M6 14L2 18L6 16" />
    <path d="M18 14L22 18L18 16" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L14 8L20 9L15.5 14L17 20L12 17L7 20L8.5 14L4 9L10 8L12 2Z" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4C4 4 5 3 8 3C11 3 12 4 12 4V20C12 20 11 19 8 19C5 19 4 20 4 20V4Z" />
    <path d="M20 4C20 4 19 3 16 3C13 3 12 4 12 4V20C12 20 13 19 16 19C19 19 20 20 20 20V4Z" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8 2 5 5 5 9C5 12 7 14 8 16V18H16V16C17 14 19 12 19 9C19 5 16 2 12 2Z" />
    <line x1="9" y1="21" x2="15" y2="21" />
    <line x1="10" y1="18" x2="10" y2="21" />
    <line x1="14" y1="18" x2="14" y2="21" />
    <path d="M9 14C10 13 11 12 12 12C13 12 14 13 15 14" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 6C10 2 4 2 4 8C4 12 12 20 12 20C12 20 20 12 20 8C20 2 14 2 12 6Z" />
  </svg>
);

export const EmailIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7L12 13L21 7" />
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <line x1="8" y1="11" x2="8" y2="17" />
    <line x1="8" y1="8" x2="8" y2="8.5" />
    <path d="M12 17V14C12 12 13 11 15 11C17 11 17 12 17 14V17" />
    <line x1="12" y1="11" x2="12" y2="17" />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9 18C9 15 7 14 7 12C7 10 8 9 8 9C7 7 8 5 8 5C10 5 11 6 11 6C11.5 5.8 12.5 5.8 13 6C13 6 14 5 16 5C16 5 17 7 16 9C16 9 17 10 17 12C17 14 15 15 15 18" />
    <path d="M9 18C10 17 14 17 15 18" />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 4H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L20 15V19C20 20 19 21 18 21C10 21 3 14 3 6C3 5 4 4 5 4Z" />
  </svg>
);

export const ArrowIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12H19" />
    <path d="M12 5L19 12L12 19" />
  </svg>
);

export const PythonIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4C8 4 8 6 8 7V9H12.5V10H6C4 10 4 12 4 14C4 16 4 18 6 18H8V16C8 14 9 13 11 13H14C16 13 17 12 17 10V7C17 5 15 4 12 4Z" />
    <path d="M12 20C16 20 16 18 16 17V15H11.5V14H18C20 14 20 12 20 10C20 8 20 6 18 6H16V8C16 10 15 11 13 11H10C8 11 7 12 7 14V17C7 19 9 20 12 20Z" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" />
    <circle cx="14" cy="17" r="0.5" fill="currentColor" />
  </svg>
);

export const JavaIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 17C8 17 6 18 9 18.5C12 19 15 19 18 17.5" />
    <path d="M7 15C7 15 5 16 8 16.5C12 17 16 17 19 15" />
    <path d="M12 3C12 3 16 7 10 11C6 14 9 16 9 16" />
    <path d="M14 20C14 20 15 21 13 21C9 21 8 20 8 20" />
    <path d="M13 5C13 5 17 8 14 12" />
  </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6V12C4 14 8 16 12 16C16 16 20 14 20 12V6" />
    <path d="M4 12V18C4 20 8 22 12 22C16 22 20 20 20 18V12" />
  </svg>
);

export const PaperPlaneIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

export const MicroscopeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 21H18" />
    <path d="M12 21V18" />
    <circle cx="12" cy="14" r="4" />
    <path d="M12 10V3" />
    <path d="M9 3H15" />
    <path d="M10 6H14" />
  </svg>
);

export const GraduationCapIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3L2 9L12 15L22 9L12 3Z" />
    <path d="M2 9V15" />
    <path d="M6 11V17C6 19 9 21 12 21C15 21 18 19 18 17V11" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 21H16" />
    <path d="M12 17V21" />
    <path d="M7 4H17V8C17 12 15 16 12 16C9 16 7 12 7 8V4Z" />
    <path d="M7 6H4C4 10 5 11 7 11" />
    <path d="M17 6H20C20 10 19 11 17 11" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21V18C3 16 5 14 9 14C13 14 15 16 15 18V21" />
    <circle cx="17" cy="8" r="2" />
    <path d="M21 21V19C21 17 20 16 17 15.5" />
  </svg>
);
