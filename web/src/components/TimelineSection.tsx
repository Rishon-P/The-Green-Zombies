import { motion } from "framer-motion";
import { Calendar, Code, Rocket, Trophy, Zap, Star } from "lucide-react";

const timelineEvents = [
  {
    date: "Day 1",
    title: "Problem Discovery",
    description: "Identified that 80% of enterprise data is ROT — costing billions in storage and energy. Legacy mainframes hold the most untouched data.",
    icon: Calendar,
    highlight: false,
  },
  {
    date: "Day 1",
    title: "Architecture Design",
    description: "Designed 4-stage pipeline: Legacy Miner → Green AI → PII Scanner → Blockchain Audit. Chose energy-efficient tech at every layer.",
    icon: Code,
    highlight: false,
  },
  {
    date: "Day 2",
    title: "Core Development",
    description: "Built EBCDIC parser, integrated DistilBERT classifier and Presidio PII engine. Connected to Celo Sepolia testnet for proof-of-deletion.",
    icon: Zap,
    highlight: true,
  },
  {
    date: "Day 2",
    title: "Dashboard & Analytics",
    description: "Created interactive Streamlit dashboard with real-time metrics, data tables, progress tracking, and blockchain explorer integration.",
    icon: Star,
    highlight: false,
  },
  {
    date: "Day 3",
    title: "Testing & Polish",
    description: "End-to-end testing with mock mainframe data. Added carbon quantification formulas, compliance scoring, and download functionality.",
    icon: Rocket,
    highlight: false,
  },
  {
    date: "Day 3",
    title: "Demo Ready",
    description: "Final presentation preparation with this interactive web showcase. Ready to demonstrate digital decarbonization in action!",
    icon: Trophy,
    highlight: true,
  },
];

const TimelineSection = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            HACKATHON JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Built in 72 Hours
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            From concept to working prototype — our hackathon development timeline
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Node */}
                <div className={`absolute left-4 top-1 w-5 h-5 rounded-full border-2 ${
                  event.highlight ? "border-primary bg-primary/20 glow-primary" : "border-border bg-card"
                }`}>
                  <div className={`absolute inset-1 rounded-full ${event.highlight ? "bg-primary" : "bg-muted"}`} />
                </div>

                {/* Content */}
                <div className={`p-5 rounded-xl border ${
                  event.highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card/50"
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-2 mb-2">
                    <event.icon className={`w-4 h-4 ${event.highlight ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-mono text-primary">{event.date}</span>
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-foreground mb-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
