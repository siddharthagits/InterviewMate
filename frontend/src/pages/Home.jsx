import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";
import ThemeBackground from "../components/common/ThemeBackground";

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
    <div style={{ position: "relative", minHeight: "100vh", background: "transparent", width: "100%", overflowX: "hidden" }}>

      {/* Ambient Theme Background (Zeabur dark silk wave / Lago warm ivory peach) */}
      <ThemeBackground />

      {/* Particle canvas — fixed behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground />
      </div>

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