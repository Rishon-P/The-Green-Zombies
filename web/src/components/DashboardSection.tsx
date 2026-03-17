import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Play, Loader2, CheckCircle2, AlertTriangle, Trash2,
  FileText, Database, Shield, Leaf, BarChart3
} from "lucide-react";
import { mockMainframeRecords, analyzeRecord, type MainframeRecord } from "@/data/mockData";
import DataTable from "./DataTable";
import MetricsPanel from "./MetricsPanel";

type DemoState = "idle" | "uploading" | "uploaded" | "analyzing" | "analyzed";

const DashboardSection = () => {
  const [state, setState] = useState<DemoState>("idle");
  const [progress, setProgress] = useState(0);
  const [records, setRecords] = useState<MainframeRecord[]>([]);
  const [analyzedRecords, setAnalyzedRecords] = useState<MainframeRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);

  const simulateUpload = useCallback(() => {
    setState("uploading");
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setRecords(mockMainframeRecords);
        setState("uploaded");
      }
      setProgress(Math.min(p, 100));
    }, 200);
  }, []);

  const simulateAnalysis = useCallback(() => {
    setState("analyzing");
    setCurrentRecord(0);
    setProgress(0);

    let idx = 0;
    const analyzed: MainframeRecord[] = [];
    const interval = setInterval(() => {
      if (idx < mockMainframeRecords.length) {
        const result = analyzeRecord(mockMainframeRecords[idx]);
        analyzed.push(result);
        setAnalyzedRecords([...analyzed]);
        setCurrentRecord(idx + 1);
        setProgress(((idx + 1) / mockMainframeRecords.length) * 100);
        idx++;
      } else {
        clearInterval(interval);
        setState("analyzed");
      }
    }, 150);
  }, []);

  const handleDeleteWaste = useCallback(() => {
    const wasteCount = analyzedRecords.filter((r) => r.classification === "ROT").length;
    setDeletedCount(wasteCount);
    setAnalyzedRecords((prev) => prev.filter((r) => r.classification !== "ROT"));
  }, [analyzedRecords]);

  const handleReset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setRecords([]);
    setAnalyzedRecords([]);
    setCurrentRecord(0);
    setDeletedCount(0);
  }, []);

  const wasteCount = analyzedRecords.filter((r) => r.classification === "ROT").length;
  const toxicCount = analyzedRecords.filter((r) => r.classification === "TOXIC").length;
  const criticalCount = analyzedRecords.filter((r) => r.classification === "CRITICAL").length;
  const carbonSaved = (wasteCount + deletedCount) * 0.005;

  return (
    <section id="dashboard" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-primary bg-primary/10 rounded-full border border-primary/20">
            INTERACTIVE DEMO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Analysis Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Experience the full data lifecycle: upload → analyze → classify → delete → audit
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            {state === "idle" && (
              <button
                onClick={simulateUpload}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg glow-primary hover:brightness-110 transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload Mainframe Dump
              </button>
            )}
            {state === "uploaded" && (
              <button
                onClick={simulateAnalysis}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-lg glow-primary hover:brightness-110 transition-all"
              >
                <Play className="w-4 h-4" />
                🚀 Run Green Analysis
              </button>
            )}
            {state === "analyzed" && wasteCount > 0 && (
              <button
                onClick={handleDeleteWaste}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-destructive text-destructive-foreground rounded-lg hover:brightness-110 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                ♻️ Delete {wasteCount} Waste Records
              </button>
            )}
            {state !== "idle" && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-secondary transition-all"
              >
                Reset Demo
              </button>
            )}
          </div>
        </motion.div>

        {/* Progress bar */}
        <AnimatePresence>
          {(state === "uploading" || state === "analyzing") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm font-mono text-muted-foreground">
                    {state === "uploading"
                      ? "🔄 Legacy Miner: Decoding EBCDIC & COMP-3 binaries..."
                      : `🧠 Analyzing record ${currentRecord}/${mockMainframeRecords.length}...`}
                  </span>
                </div>
                <span className="text-sm font-mono text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success banner */}
        <AnimatePresence>
          {deletedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-xl border border-primary/30 bg-primary/5 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-lg font-heading font-semibold text-primary">
                  ✅ DATA DELETED & AUDITED!
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {deletedCount} waste records removed • Carbon Savings: {(deletedCount * 0.005).toFixed(4)} kgCO₂e
              </p>
              <p className="text-xs font-mono text-primary/70 mt-1">
                Proof hash: 0x{Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics */}
        {state === "analyzed" && (
          <MetricsPanel
            wasteCount={wasteCount + deletedCount}
            toxicCount={toxicCount}
            criticalCount={criticalCount}
            carbonSaved={carbonSaved}
            totalRecords={analyzedRecords.length + deletedCount}
          />
        )}

        {/* Status cards during upload */}
        <AnimatePresence>
          {state === "uploading" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: FileText, label: "File Format", value: "EBCDIC .dat", color: "text-primary" },
                { icon: Database, label: "Records Found", value: `${Math.round(progress * 0.3)}`, color: "text-accent" },
                { icon: Shield, label: "Integrity", value: "Verified", color: "text-primary" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-mono text-muted-foreground">{label}</span>
                  </div>
                  <span className="text-lg font-heading font-bold text-foreground">{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data table */}
        {(state === "uploaded" || state === "analyzing" || state === "analyzed") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DataTable
              records={state === "uploaded" ? records : analyzedRecords}
              showClassification={state !== "uploaded"}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DashboardSection;
