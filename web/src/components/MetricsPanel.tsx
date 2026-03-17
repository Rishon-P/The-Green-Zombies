import { motion } from "framer-motion";
import { Trash2, AlertTriangle, Shield, Leaf, Database, BarChart3 } from "lucide-react";

interface MetricsPanelProps {
  wasteCount: number;
  toxicCount: number;
  criticalCount: number;
  carbonSaved: number;
  totalRecords: number;
}

const MetricsPanel = ({ wasteCount, toxicCount, criticalCount, carbonSaved, totalRecords }: MetricsPanelProps) => {
  const metrics = [
    {
      icon: Trash2,
      label: "Digital Waste (ROT)",
      value: wasteCount,
      suffix: "records",
      description: "Delete to Save Energy",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
    },
    {
      icon: Shield,
      label: "Toxic PII Records",
      value: toxicCount,
      suffix: "flagged",
      description: "Security Risk!",
      color: "text-toxic",
      bg: "bg-toxic/10",
      border: "border-toxic/30",
    },
    {
      icon: AlertTriangle,
      label: "Critical (Keep)",
      value: criticalCount,
      suffix: "records",
      description: "Business Essential",
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
    },
    {
      icon: Leaf,
      label: "Est. Carbon Savings",
      value: carbonSaved.toFixed(4),
      suffix: "kgCO₂e",
      description: "From waste deletion",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
    },
    {
      icon: Database,
      label: "Total Records",
      value: totalRecords,
      suffix: "parsed",
      description: "From mainframe dump",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/30",
    },
    {
      icon: BarChart3,
      label: "Classification Rate",
      value: "100",
      suffix: "%",
      description: "All records classified",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className={`p-4 rounded-xl border ${metric.border} ${metric.bg}/50 backdrop-blur-sm`}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <metric.icon className={`w-3.5 h-3.5 ${metric.color}`} />
            <span className="text-[10px] font-mono text-muted-foreground truncate">{metric.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-heading font-bold ${metric.color}`}>{metric.value}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{metric.suffix}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1">{metric.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsPanel;
