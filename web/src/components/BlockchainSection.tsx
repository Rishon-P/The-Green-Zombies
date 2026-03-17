import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2, ExternalLink, CheckCircle2, Clock, Lock, Hash,
  ArrowRight, Copy, Check, Blocks, Cpu, Fingerprint
} from "lucide-react";
import { blockchainTransactions } from "@/data/mockData";

const BlockchainSection = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState(0);
  const [showMintDemo, setShowMintDemo] = useState(false);
  const [mintStep, setMintStep] = useState(0);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const simulateMint = () => {
    setShowMintDemo(true);
    setMintStep(0);
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((step, i) => {
      setTimeout(() => setMintStep(step), (i + 1) * 800);
    });
  };

  const mintSteps = [
    { label: "Hashing deleted data with SHA-256...", icon: Hash },
    { label: "Building transaction payload...", icon: Cpu },
    { label: "Signing with private key...", icon: Fingerprint },
    { label: "Broadcasting to Celo Sepolia...", icon: Blocks },
    { label: "✅ Transaction confirmed on-chain!", icon: CheckCircle2 },
  ];

  return (
    <section id="blockchain" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-accent bg-accent/10 rounded-full border border-accent/20">
            ON-CHAIN AUDIT
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Blockchain Proof-of-Deletion
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Every deletion is cryptographically hashed and minted on Celo's proof-of-stake network — creating an immutable, auditable carbon credit trail
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Explorer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-heading font-semibold text-foreground">Transaction Explorer</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Celo Sepolia Testnet</span>
            </div>

            <div className="divide-y divide-border">
              {blockchainTransactions.map((tx, index) => (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedTx(index)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedTx === index ? "bg-accent/5" : "hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${tx.status === "confirmed" ? "bg-primary" : "bg-warning animate-pulse"}`} />
                      <span className="text-xs font-mono text-foreground">{tx.hash}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyHash(tx.hash); }}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        {copiedHash === tx.hash ? (
                          <Check className="w-3 h-3 text-primary" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <a
                      href={`https://sepolia.celoscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </a>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span>{tx.records} records deleted</span>
                    <span>•</span>
                    <span className="text-primary">{tx.carbon} kgCO₂e saved</span>
                    <span>•</span>
                    <span className={tx.status === "confirmed" ? "text-primary" : "text-warning"}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Transaction Detail + Mint Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Selected TX Detail */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Transaction Payload</h3>
              <pre className="p-4 rounded-lg bg-muted/50 text-xs font-mono text-foreground leading-relaxed overflow-x-auto scrollbar-none">
{`{
  "app": "Eco-Vault",
  "action": "DIGITAL_DECARBONIZATION",
  "deleted_records": ${blockchainTransactions[selectedTx].records},
  "carbon_saved_kg": ${blockchainTransactions[selectedTx].carbon},
  "proof_hash": "0x${Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}",
  "chain_id": 11142220,
  "network": "celo-sepolia"
}`}
              </pre>
            </div>

            {/* Mint Demo */}
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-4">🔗 Mint Carbon Credit Demo</h3>

              {!showMintDemo ? (
                <button
                  onClick={simulateMint}
                  className="w-full py-3 text-sm font-semibold bg-accent text-accent-foreground rounded-lg glow-accent hover:brightness-110 transition-all"
                >
                  ♻️ Simulate Proof-of-Deletion Mint
                </button>
              ) : (
                <div className="space-y-3">
                  {mintSteps.map((step, index) => {
                    const isActive = mintStep >= index + 1;
                    const isCurrent = mintStep === index + 1;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          isActive
                            ? isCurrent
                              ? "border-accent/30 bg-accent/5"
                              : "border-primary/30 bg-primary/5"
                            : "border-border bg-muted/30 opacity-30"
                        }`}
                      >
                        <step.icon className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? (index === 4 ? "text-primary" : "text-accent") : "text-muted-foreground"
                        } ${isCurrent && index !== 4 ? "animate-spin" : ""}`} />
                        <span className={`text-xs font-mono ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}

                  {mintStep >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 text-center"
                    >
                      <p className="text-xs font-mono text-primary mb-2">
                        📜 View on Celo Explorer
                      </p>
                      <a
                        href="https://sepolia.celoscan.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-accent hover:underline"
                      >
                        sepolia.celoscan.io/tx/0x7a3f...e8b2
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;
