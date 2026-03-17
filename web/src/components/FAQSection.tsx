import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is digital decarbonization?",
    answer: "Digital decarbonization is the practice of reducing the carbon footprint of data storage by identifying and responsibly deleting redundant, obsolete, and trivial (ROT) data. Data centers consume 1-2% of global electricity, and studies show that 80% of stored data is never accessed again. By removing this waste, we directly reduce energy consumption.",
  },
  {
    question: "How does the AI classification work?",
    answer: "We use DistilBERT, a distilled version of BERT that's 40% smaller and 60% faster while retaining 97% of BERT's language understanding. It classifies text records as either positive (critical business data) or negative (digital waste). Combined with Microsoft Presidio's entity recognition, we create a three-tier classification: TOXIC (PII), ROT (waste), and CRITICAL (keep).",
  },
  {
    question: "Why Celo blockchain instead of Ethereum mainnet?",
    answer: "Celo is a proof-of-stake blockchain that uses 99.99% less energy than proof-of-work networks like Ethereum (pre-merge). For a project focused on environmental sustainability, using an energy-efficient blockchain is essential. We deploy on Celo Sepolia testnet for hackathon demonstrations, but the approach works on mainnet.",
  },
  {
    question: "What mainframe formats are supported?",
    answer: "Currently, we support EBCDIC (Extended Binary Coded Decimal Interchange Code) character encoding and COMP-3 (packed decimal) numeric formats — the most common formats in IBM mainframe systems used by banks and financial institutions. The parser handles fixed-length record layouts typical of COBOL applications.",
  },
  {
    question: "How is carbon savings calculated?",
    answer: "We estimate 0.005 kgCO₂e per deleted record based on average storage energy costs. This is a simplified model — actual savings depend on storage type (HDD vs SSD), data center PUE (Power Usage Effectiveness), and electricity grid carbon intensity. The blockchain proof stores this estimate alongside the SHA-256 hash of deleted data.",
  },
  {
    question: "Is the deleted data recoverable?",
    answer: "No. Once waste records are deleted and the proof-of-deletion is minted on-chain, the original data cannot be recovered. The SHA-256 hash serves as a one-way fingerprint — it proves what was deleted without revealing the actual content. This is by design for both privacy and environmental purposes.",
  },
  {
    question: "How does Presidio PII detection work?",
    answer: "Microsoft Presidio uses a combination of NLP models, regular expressions, and context-aware rules to detect PII entities. It supports 20+ entity types including names, SSNs, email addresses, phone numbers, passport numbers, credit card numbers, and more. Each detection includes a confidence score for threshold-based filtering.",
  },
  {
    question: "Can this scale to enterprise workloads?",
    answer: "The current implementation is a hackathon prototype. For enterprise scale, you'd want batch processing with Apache Spark, a dedicated ML serving infrastructure (e.g., TensorFlow Serving), and a production blockchain deployment. The architecture is designed to be modular — each pipeline stage can be independently scaled.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Everything you need to know about Eco-Vault and digital decarbonization
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-heading font-medium text-foreground">{faq.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-4 pl-12">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
