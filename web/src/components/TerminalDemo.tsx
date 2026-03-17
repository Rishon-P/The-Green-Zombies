import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Play, RotateCcw } from "lucide-react";

const terminalLines = [
  { text: "$ python app.py", type: "command" as const, delay: 0 },
  { text: "", type: "output" as const, delay: 300 },
  { text: "  You can now view your Streamlit app in your browser.", type: "output" as const, delay: 500 },
  { text: "  Local URL: http://localhost:8501", type: "success" as const, delay: 700 },
  { text: "", type: "output" as const, delay: 900 },
  { text: "Loading models...", type: "output" as const, delay: 1200 },
  { text: "  ✓ DistilBERT classifier loaded (67MB, 40% smaller than BERT)", type: "success" as const, delay: 2000 },
  { text: "  ✓ Presidio PII analyzer initialized", type: "success" as const, delay: 2500 },
  { text: "  ✓ Celo Web3 provider connected (chain_id: 11142220)", type: "success" as const, delay: 3000 },
  { text: "", type: "output" as const, delay: 3200 },
  { text: "📁 File uploaded: banking_mainframe_2019.dat (4.7MB)", type: "info" as const, delay: 3500 },
  { text: "🔄 Legacy Miner: Decoding EBCDIC & COMP-3 binaries...", type: "info" as const, delay: 4000 },
  { text: "  → Parsed 30 records from mainframe dump", type: "output" as const, delay: 4800 },
  { text: "", type: "output" as const, delay: 5000 },
  { text: "🚀 Running Green Analysis...", type: "info" as const, delay: 5200 },
  { text: "  [████████████████████████] 30/30 records classified", type: "success" as const, delay: 6500 },
  { text: "", type: "output" as const, delay: 6700 },
  { text: "📊 Results:", type: "info" as const, delay: 7000 },
  { text: "  🟢 ROT (Digital Waste):    12 records", type: "waste" as const, delay: 7300 },
  { text: "  🔴 TOXIC (PII Found):       9 records", type: "toxic" as const, delay: 7500 },
  { text: "  🟡 CRITICAL (Keep):          9 records", type: "warning" as const, delay: 7700 },
  { text: "  🌱 Est. Carbon Savings:  0.0600 kgCO₂e", type: "success" as const, delay: 8000 },
  { text: "", type: "output" as const, delay: 8200 },
  { text: "♻️ Deleting waste records & minting proof...", type: "info" as const, delay: 8500 },
  { text: "  → SHA-256 proof hash: 0x7a3f8c1d...e8b24f7a", type: "output" as const, delay: 9000 },
  { text: "  → Broadcasting to Celo Sepolia...", type: "output" as const, delay: 9500 },
  { text: "  ✅ TX confirmed: 0x7a3f...e8b2", type: "success" as const, delay: 10500 },
  { text: "  📜 View: https://sepolia.celoscan.io/tx/0x7a3f...e8b2", type: "link" as const, delay: 11000 },
];

const typeColors: Record<string, string> = {
  command: "text-foreground font-bold",
  output: "text-muted-foreground",
  success: "text-primary",
  info: "text-accent",
  waste: "text-primary",
  toxic: "text-toxic",
  warning: "text-warning",
  link: "text-accent underline",
};

const TerminalDemo = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const runDemo = () => {
    setVisibleLines(0);
    setIsRunning(true);

    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        if (index === terminalLines.length - 1) {
          setIsRunning(false);
        }
      }, line.delay);
    });
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            LIVE DEMO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Terminal Simulation
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Watch the complete Eco-Vault pipeline execute in real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-toxic/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">eco-vault — python app.py</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isRunning ? (
                <button
                  onClick={runDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  {visibleLines > 0 ? "Replay" : "Run"}
                </button>
              ) : (
                <span className="text-xs font-mono text-primary animate-pulse">Running...</span>
              )}
            </div>
          </div>

          {/* Terminal body */}
          <div
            ref={containerRef}
            className="p-4 h-[420px] overflow-y-auto scrollbar-none font-mono text-sm leading-relaxed"
          >
            {terminalLines.slice(0, visibleLines).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`${typeColors[line.type]} ${line.text === "" ? "h-3" : ""}`}
              >
                {line.text}
              </motion.div>
            ))}
            {isRunning && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
            )}
            {visibleLines === 0 && !isRunning && (
              <div className="flex items-center justify-center h-full text-muted-foreground/50">
                <p className="text-sm">Click "Run" to start the simulation →</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalDemo;
