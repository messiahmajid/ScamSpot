"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Leadership from "@/components/Leadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PhotoStack from "@/components/PhotoStack";
import { FloatingDoodles, ScatteredDots, WavyDivider, CoffeeRing, TapeStrip } from "@/components/Doodles";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Global floating doodles */}
      <FloatingDoodles className="fixed inset-0 z-0" />

      {/* Polaroid photo stacks on sides */}
      <PhotoStack position="left" />
      <PhotoStack position="right" />

      {/* Scattered decorative elements */}
      <ScatteredDots className="fixed inset-0 z-0" />

      {/* Coffee ring stains for that authentic scrapbook feel */}
      <CoffeeRing className="fixed top-[15%] right-[3%] z-0" size={80} />
      <CoffeeRing className="fixed bottom-[25%] left-[2%] z-0" size={60} />

      {/* Random tape strips */}
      <TapeStrip className="fixed top-[30%] left-[1%] z-0" rotation={15} color="#f8bbd9" />
      <TapeStrip className="fixed top-[60%] right-[2%] z-0" rotation={-10} color="#b3e5fc" />
      <TapeStrip className="fixed bottom-[40%] left-[3%] z-0" rotation={5} color="#c8e6c9" />

      {/* Main content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />

        <WavyDivider className="my-4 opacity-30" color="#ff6b6b" />

        <About />

        <WavyDivider className="my-4 opacity-30" color="#4ecdc4" />

        <Skills />

        <WavyDivider className="my-4 opacity-30" color="#ffd54f" />

        <Experience />

        <WavyDivider className="my-4 opacity-30" color="#a855f7" />

        <Projects />

        <WavyDivider className="my-4 opacity-30" color="#3b82f6" />

        <Leadership />

        <WavyDivider className="my-4 opacity-30" color="#ff6b6b" />

        <Contact />
        <Footer />
      </div>
    </main>
  );
}
