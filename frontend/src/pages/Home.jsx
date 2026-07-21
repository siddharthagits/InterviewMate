import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>

      {/* Particle canvas — covers the whole page behind everything */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground />
      </div>

      {/* Radial glow overlays on top of particles */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 50% at 50% 0%,  rgba(99,102,241,0.12) 0%, transparent 65%),
          radial-gradient(ellipse 50% 40% at 80% 60%, rgba(6,182,212,0.07)  0%, transparent 60%)
        `,
      }} />

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Navbar />
        <Hero />
        <Features />
        <Footer />
      </div>

    </div>
  );
}

export default Home;