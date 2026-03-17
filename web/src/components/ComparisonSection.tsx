import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const comparisons = [
  {
    feature: "Legacy Data Parsing",
    ecoVault: "full",
    traditional: "none",
    manual: "partial",
  },
  {
    feature: "AI Classification",
    ecoVault: "full",
    traditional: "none",
    manual: "none",
  },
  {
    feature: "PII Detection",
    ecoVault: "full",
    traditional: "partial",
    manual: "partial",
  },
  {
    feature: "Energy Efficiency",
    ecoVault: "full",
    traditional: "none",
    manual: "none",
  },
  {
    feature: "Blockchain Audit Trail",
    ecoVault: "full",
    traditional: "none",
    manual: "none",
  },
  {
    feature: "Carbon Quantification",
    ecoVault: "full",
    traditional: "none",
    manual: "none",
  },
  {
    feature: "Automated Pipeline",
    ecoVault: "full",
    traditional: "partial",
    manual: "none",
  },
  {
    feature: "GDPR Compliance",
    ecoVault: "full",
    traditional: "partial",
    manual: "partial",
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "full") return <Check className="w-4 h-4 text-primary" />;
  if (status === "partial") return <Minus className="w-4 h-4 text-warning" />;
  return <X className="w-4 h-4 text-toxic" />;
};

const ComparisonSection = () => {
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
            COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Why Eco-Vault?
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Compared to traditional data management and manual approaches
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground">Feature</th>
                  <th className="px-6 py-4 text-center text-xs font-mono text-primary">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-heading font-semibold">Eco-Vault</span>
                      <span className="text-[10px] text-muted-foreground">AI + Blockchain</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-mono text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-heading font-semibold text-foreground">Traditional DLP</span>
                      <span className="text-[10px]">Rule-based</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-mono text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-heading font-semibold text-foreground">Manual Review</span>
                      <span className="text-[10px]">Human-only</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-foreground">{row.feature}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={row.ecoVault} />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={row.traditional} />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={row.manual} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
