import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Messiah Majid | Software Developer & Researcher",
  description: "Portfolio of Messiah Godfred Majid - Computer Science, Math & Biology student at University of Miami. Building impactful software at the intersection of technology and life sciences.",
  keywords: ["Messiah Majid", "Software Developer", "University of Miami", "Computer Science", "Bioinformatics", "Portfolio"],
  authors: [{ name: "Messiah Godfred Majid" }],
  openGraph: {
    title: "Messiah Majid | Software Developer & Researcher",
    description: "Portfolio of Messiah Godfred Majid - Building impactful software at the intersection of technology and life sciences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
