import { motion } from "framer-motion";
import { ArrowDown, Leaf, Zap, Shield } from "lucide-react";
import ParticleField from "./ParticleField";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid z-0" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-glow z-0" />

      {/* Particles */}
      <ParticleField />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-sm font-mono text-primary">Hackathon Project 2025</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight mb-6"
        >
          <span className="text-foreground">🌱 </span>
          <span className="text-gradient-primary">Eco-Vault</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl font-heading font-light text-muted-foreground mb-4"
        >
          The Green Data Scavenger
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground/80 mb-12 leading-relaxed"
        >
          Mine legacy mainframe data, classify it with energy-efficient AI,
          detect PII with enterprise security, and mint blockchain-verified
          carbon credits for every byte of digital waste responsibly deleted.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {[
            { icon: Leaf, label: "Green AI", desc: "DistilBERT" },
            { icon: Shield, label: "PII Security", desc: "Presidio" },
            { icon: Zap, label: "Blockchain Proof", desc: "Celo" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs font-mono text-muted-foreground">({desc})</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#dashboard")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 text-base font-semibold bg-primary text-primary-foreground rounded-xl glow-primary hover:brightness-110 transition-all"
          >
            🚀 Launch Interactive Demo
          </a>
          <a
            href="#pipeline"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#pipeline")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 text-base font-semibold border border-border text-foreground rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
