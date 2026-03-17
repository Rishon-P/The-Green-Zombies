import { motion } from "framer-motion";
import { Database, Trash2, Leaf, Link, Shield, Zap } from "lucide-react";
import { impactStats } from "@/data/mockData";
import CountUp from "./CountUp";

const iconMap: Record<string, React.ElementType> = {
  database: Database,
  trash: Trash2,
  leaf: Leaf,
  link: Link,
  shield: Shield,
  zap: Zap,
};

const ImpactSection = () => {
  return (
    <section id="impact" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-radial-glow opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            ENVIRONMENTAL IMPACT
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Making Data Centers Greener
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Every byte of digital waste deleted contributes to reduced energy consumption in data centers worldwide
          </p>
        </motion.div>

        {/* Impact stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {impactStats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-center p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3 group-hover:glow-primary transition-all">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <CountUp value={stat.value} />
                  {stat.suffix && (
                    <span className="text-xs font-mono text-muted-foreground">{stat.suffix}</span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Environmental message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-8 rounded-2xl border-glow bg-card/30 backdrop-blur-sm text-center"
        >
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-4">
            Digital Decarbonization is the Future
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
            Data centers consume 1-2% of global electricity. By intelligently identifying and
            deleting redundant, obsolete, and trivial (ROT) data, we can significantly reduce
            the storage and processing energy footprint — one mainframe dump at a time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["IDC: 90% of data is never accessed again", "Gartner: 80% of stored data is ROT", "EPA: 1 kWh = 0.42 kgCO₂"].map((fact) => (
              <span key={fact} className="px-3 py-1.5 text-xs font-mono text-primary/80 bg-primary/5 rounded-full border border-primary/10">
                {fact}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;
