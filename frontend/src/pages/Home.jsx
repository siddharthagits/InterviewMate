import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>

      {/* Particle canvas — fixed behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground />
      </div>

      {/* Multi-layer glow overlays */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%,   rgba(124,58,237,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 60%,  rgba(6,182,212,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 80%,  rgba(245,158,11,0.04) 0%, transparent 55%)
          `,
        }}
      />

      {/* Fixed Navbar */}
      <Navbar />

      {/* Scrollable page content — offset for fixed navbar */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <Features />
        <AboutSection />
        <Footer />
      </div>

    </div>
  );
}

export default Home;