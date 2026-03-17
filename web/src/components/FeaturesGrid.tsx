import { motion } from "framer-motion";
import {
  Recycle, ShieldCheck, Cpu, Coins, FileSearch, BarChart3,
  CloudOff, Scale, Fingerprint, FileWarning, Workflow, TreeDeciduous
} from "lucide-react";

const features = [
  {
    icon: Recycle,
    title: "Digital Waste Detection",
    description: "Automatically identifies ROT (Redundant, Obsolete, Trivial) data in legacy mainframe dumps using NLP classification.",
  },
  {
    icon: ShieldCheck,
    title: "PII Guardian",
    description: "Microsoft Presidio scans for 20+ PII types including SSNs, emails, phone numbers, and passport IDs with confidence scoring.",
  },
  {
    icon: Cpu,
    title: "Green AI Processing",
    description: "DistilBERT uses 40% fewer parameters and 60% less energy than full BERT, making classification environmentally responsible.",
  },
  {
    icon: Coins,
    title: "Carbon Credit Minting",
    description: "Every deletion generates a verifiable carbon credit on Celo's proof-of-stake blockchain with 99.99% less energy than PoW.",
  },
  {
    icon: FileSearch,
    title: "Legacy Format Support",
    description: "Parses EBCDIC character encoding and COMP-3 packed decimal formats from IBM mainframe binary dumps.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards tracking classification distribution, carbon savings trends, and compliance scores across all processed data.",
  },
  {
    icon: CloudOff,
    title: "Data Minimization",
    description: "Follows GDPR data minimization principles — only retain what's necessary, delete what's not, and prove you did it right.",
  },
  {
    icon: Scale,
    title: "Regulatory Compliance",
    description: "Supports GDPR, HIPAA, and SOX compliance requirements with auditable proof-of-deletion trails stored on-chain.",
  },
  {
    icon: Fingerprint,
    title: "Cryptographic Proofs",
    description: "SHA-256 hash of deleted data creates tamper-proof certificates that can be independently verified by auditors.",
  },
  {
    icon: FileWarning,
    title: "Risk Classification",
    description: "Three-tier system: TOXIC (PII exposure risk), ROT (safe to delete), and CRITICAL (business-essential records to keep).",
  },
  {
    icon: Workflow,
    title: "Automated Pipeline",
    description: "End-to-end automation from file upload to blockchain certification — no manual classification needed.",
  },
  {
    icon: TreeDeciduous,
    title: "Environmental Impact",
    description: "Quantifies carbon savings per deletion batch, contributing to measurable reduction in data center energy consumption.",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Everything You Need for Digital Decarbonization
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            A comprehensive toolkit for responsible data management and environmental accountability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-5 rounded-xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="mb-3">
                <feature.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
