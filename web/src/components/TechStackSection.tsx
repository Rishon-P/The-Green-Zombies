import { motion } from "framer-motion";
import { Code, Brain, Shield, Link, Layout, Lock } from "lucide-react";
import { techStack } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  brain: Brain,
  shield: Shield,
  link: Link,
  layout: Layout,
  lock: Lock,
};

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  primary: { text: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  success: { text: "text-success", bg: "bg-success/10", border: "border-success/30" },
  toxic: { text: "text-toxic", bg: "bg-toxic/10", border: "border-toxic/30" },
  accent: { text: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  warning: { text: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
};

const TechStackSection = () => {
  return (
    <section id="techstack" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Tech Stack
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Built with purpose: every tool chosen for energy efficiency, security, and transparency
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => {
            const Icon = iconMap[tech.icon];
            const colors = colorMap[tech.color];

            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`relative p-6 rounded-xl border ${colors.border} bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:${colors.bg}`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colors.bg} mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{tech.name}</h3>
                  <p className={`text-xs font-mono ${colors.text} mb-3`}>{tech.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>

                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-16 h-16 ${colors.bg} rounded-bl-[40px] rounded-tr-xl opacity-0 group-hover:opacity-50 transition-opacity`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-xl border border-border bg-card/30 backdrop-blur-sm"
        >
          <h3 className="text-sm font-heading font-semibold text-foreground mb-6 text-center">System Architecture</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            {[
              { label: "Mainframe\n.dat File", sub: "EBCDIC/COMP-3", color: "primary" },
              { label: "Legacy\nMiner", sub: "Python Parser", color: "primary" },
              { label: "DistilBERT\nClassifier", sub: "Green AI", color: "success" },
              { label: "Presidio\nScanner", sub: "PII Detection", color: "toxic" },
              { label: "Celo\nBlockchain", sub: "Proof-of-Deletion", color: "accent" },
            ].map((node, i, arr) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`p-4 rounded-lg border ${colorMap[node.color].border} ${colorMap[node.color].bg} min-w-[120px]`}>
                  <p className="text-xs font-heading font-semibold text-foreground whitespace-pre-line">{node.label}</p>
                  <p className={`text-[10px] font-mono ${colorMap[node.color].text} mt-1`}>{node.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block text-muted-foreground">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
