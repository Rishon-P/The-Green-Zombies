import { motion } from "framer-motion";
import { Database, Brain, Shield, Link, CheckCircle2, Loader2, Clock } from "lucide-react";
import { pipelineSteps } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  database: Database,
  brain: Brain,
  shield: Shield,
  link: Link,
};

const statusConfig = {
  complete: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10 border-primary/30", glow: "glow-primary" },
  active: { icon: Loader2, color: "text-accent", bg: "bg-accent/10 border-accent/30", glow: "glow-accent" },
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted border-border", glow: "" },
};

const PipelineSection = () => {
  return (
    <section id="pipeline" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-glow opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            DATA PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Four-stage pipeline: from legacy binary data to blockchain-verified carbon credits
          </p>
        </motion.div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((step, index) => {
            const Icon = iconMap[step.icon];
            const status = statusConfig[step.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Connector line */}
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-full h-px">
                    <div className={`h-px w-full ${step.status === "complete" ? "bg-primary/40" : "bg-border"}`} />
                    <motion.div
                      className="absolute top-0 left-0 h-px bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: step.status === "complete" ? "100%" : "0%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
                    />
                  </div>
                )}

                <div className={`relative p-6 rounded-xl border ${status.bg} ${status.glow} transition-all duration-300 hover:scale-[1.02]`}>
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-muted-foreground">STEP {step.step}</span>
                    <StatusIcon className={`w-4 h-4 ${status.color} ${step.status === "active" ? "animate-spin" : ""}`} />
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${status.bg}`}>
                      <Icon className={`w-6 h-6 ${status.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs font-mono text-primary mb-3">{step.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Data flow animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 relative h-2 rounded-full bg-muted overflow-hidden max-w-4xl mx-auto"
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/3 rounded-full bg-gradient-to-r from-primary/0 via-primary to-primary/0"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PipelineSection;
